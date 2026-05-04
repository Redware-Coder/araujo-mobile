import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://177.54.239.199:4143/api/SqlApp";

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/");

    const url = `${BASE_URL}/${path}${req.nextUrl.search}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? await req.text() : undefined,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Erro proxy API:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export { handler as GET, handler as POST };