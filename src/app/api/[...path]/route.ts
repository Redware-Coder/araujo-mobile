import { NextRequest, NextResponse } from "next/server";

// 🔵 GET (já funcionando)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const url = `http://177.54.239.199:4143/api/SqlApp/${path.join("/")}${req.nextUrl.search}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao conectar API externa" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const body = await req.text(); // pega o body original

  const url = `http://177.54.239.199:4143/api/SqlApp/${path.join("/")}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao enviar dados para API externa" },
      { status: 500 }
    );
  }
}