import { NextResponse } from "next/server";

const BACKEND_API_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export async function POST(request) {
  try {
    const headers = new Headers(request.headers);

    headers.delete("host");
    headers.delete("content-length");

    const upstream = await fetch(`${BACKEND_API_URL}/upload`, {
      method: "POST",
      headers,
      body: request.body,
      duplex: "half",
    });

    const data = await upstream.json().catch(() => ({
      success: false,
      message: "Некорректный ответ сервера",
    }));

    return NextResponse.json(data, {
      status: upstream.status,
    });
  } catch (error) {
    console.error("Upload proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Не удалось загрузить файл",
      },
      {
        status: 502,
      },
    );
  }
}
