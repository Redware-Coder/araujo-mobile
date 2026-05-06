import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");

  const url = `http://177.54.239.199:4143/api/SqlApp/${path}${
    req.nextUrl.search
  }`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Erro ao conectar API externa" },
      { status: 500 }
    );
  }
}