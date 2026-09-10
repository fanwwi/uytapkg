import { NextResponse } from "next/server";

let rawBackendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
rawBackendUrl = rawBackendUrl.replace(/\/$/, "");
if (!rawBackendUrl.endsWith("/api") && !rawBackendUrl.includes("localhost")) {
  rawBackendUrl = `${rawBackendUrl}/api`;
}
const BACKEND_API_URL = rawBackendUrl;

async function proxyRequest(request, context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const segments = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
    const path = segments.join("/");
    
    // Build query string
    const url = new URL(request.url);
    const searchParams = url.search;
    
    const targetUrl = `${BACKEND_API_URL}/${path}${searchParams}`;

    const headers = new Headers(request.headers);
    headers.delete("host");

    // Бэкенд настроен на `trust proxy: 1` и берёт IP клиента из
    // X-Forwarded-For для express-rate-limit (логин/регистрация/платежи/AI).
    // Next.js как fetch, а не как настоящий HTTP-прокси, копирует ВСЕ
    // заголовки входящего запроса как есть — включая X-Forwarded-For,
    // которое клиент может прислать сам и полностью подделать реальный IP,
    // обнуляя защиту от брутфорса и финансовый DoS через платные AI/платёжные
    // эндпоинты. Поэтому здесь принудительно выставляем ЕДИНСТВЕННОЕ
    // доверенное значение, а не то, что прислал клиент.
    //
    // Стандартная конвенция reverse-прокси (Vercel Edge, nginx, ALB,
    // Cloudflare и т.п.) — ДОПИСЫВАТЬ реально увиденный IP пира в конец
    // существующего X-Forwarded-For, а не заменять его целиком. Поэтому
    // последний элемент списка — это IP, который видел именно последний
    // hop перед нами (его нельзя подделать клиентским заголовком, в
    // отличие от первого элемента, который как раз и есть то, что мог
    // прислать сам клиент). Если фактическая инфраструктура разворота
    // окажется другой (например, платформа НЕ дописывает, а полностью
    // заменяет заголовок) — это стоит перепроверить отдельно после деплоя.
    const platformForwardedFor = request.headers.get("x-forwarded-for");
    const forwardedParts = platformForwardedFor
      ? platformForwardedFor.split(",").map((part) => part.trim()).filter(Boolean)
      : [];
    const trustedClientIp = forwardedParts.length > 0
      ? forwardedParts[forwardedParts.length - 1]
      : null;

    headers.delete("x-forwarded-for");
    headers.delete("x-real-ip");
    headers.delete("forwarded");

    if (trustedClientIp) {
      headers.set("x-forwarded-for", trustedClientIp);
    }

    const init = {
      method: request.method,
      headers,
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      init.body = request.body;
      init.duplex = "half";
    }

    const upstream = await fetch(targetUrl, init);
    const text = await upstream.text();

    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, {
      status: upstream.status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Catch-all proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка проксирования API" },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
export const OPTIONS = proxyRequest;
