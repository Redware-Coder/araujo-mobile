import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const cnpj = searchParams.get("cnpj");

  const url = `http://177.54.239.199:4143/api/SqlApp/ConfirmarEmpresa?id=${id}&cnpj=${cnpj}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: "Erro ao conectar API interna" }, { status: 500 });
  }
}