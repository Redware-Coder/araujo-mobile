import { NextResponse } from "next/server";

const BASE_URL = "http://177.54.239.199:4143/api/SqlApp";

async function handler(req: Request, { params }: { params: { path?: string[] } }) {
  try {
    const path = params.path?.join("/") || "";

    const url = new URL(req.url);

    // 🔗 Monta URL final da API externa
    const targetUrl = `${BASE_URL}/${path}${url.search}`;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? await req.text()
        : undefined,
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { error: "Erro no proxy universal" },
      { status: 500 }
    );
  }
}

// suporta todos os métodos
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };