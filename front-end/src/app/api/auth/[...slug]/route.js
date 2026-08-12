import { NextResponse } from "next/server";

const BACKEND_API_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function proxyRequest(request, context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const segments = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
    const path = segments.join("/");
    const normalizedPath = path.startsWith("auth/") ? path : `auth/${path}`;
    const targetUrl = normalizedPath ? `${BACKEND_API_URL}/${normalizedPath}` : BACKEND_API_URL;

    const headers = new Headers(request.headers);
    headers.delete("host");

    const init = {
      method: request.method,
      headers,
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      init.body = await request.text();
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
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Не удалось обработать запрос авторизации" },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
