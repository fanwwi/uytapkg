import { NextResponse } from "next/server";

const BACKEND_API_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export async function GET(request) {
  try {
    const upstream = await fetch(`${BACKEND_API_URL}/constants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    console.error("Constants proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Не удалось загрузить справочники" },
      { status: 502 },
    );
  }
}
