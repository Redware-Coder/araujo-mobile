import { NextRequest, NextResponse } from "next/server";
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