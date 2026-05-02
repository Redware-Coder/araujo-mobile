export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const cnpj = searchParams.get("cnpj");

  if (!id || !cnpj) {
    return new Response(JSON.stringify({ erro: "Parâmetros inválidos" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `http://177.54.239.199:4143/api/SqlApp/ConfirmarEmpresa?id=${id}&cnpj=${cnpj}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ erro: "Erro na API externa" }), {
        status: response.status,
      });
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ erro: "Erro ao conectar API" }), {
      status: 500,
    });
  }
}