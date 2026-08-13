import { NextResponse } from "next/server";

const BACKEND_API_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function proxyRequest(request) {
  try {
    const headers = new Headers(request.headers);
    headers.delete("host");

    const init = {
      method: request.method,
      headers,
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      init.body = request.body;
      init.duplex = "half";
    }

    const upstream = await fetch(`${BACKEND_API_URL}/listings`, init);
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
    console.error("Listings proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Не удалось обработать запрос по объявлениям" },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
