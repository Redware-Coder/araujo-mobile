const EXTERNA = "http://177.54.239.199:4143/api/SqlApp";
const INTERNA = "http://10.1.1.135:4143/api/SqlApp";

async function tentarFetch(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const cnpj = searchParams.get("cnpj");

  if (!id || !cnpj) {
    return new Response(JSON.stringify({ erro: "Parâmetros inválidos" }), {
      status: 400,
    });
  }

  const endpoint = `/ConfirmarEmpresa?id=${id}&cnpj=${cnpj}`;

  // 🔥 1. tenta externa primeiro
  let data = await tentarFetch(`${EXTERNA}${endpoint}`);

  // 🔁 2. fallback para interna
  if (!data) {
    console.log("⚠️ Externa falhou, tentando interna...");
    data = await tentarFetch(`${INTERNA}${endpoint}`);
  }

  // ❌ 3. se tudo falhar
  if (!data) {
    return new Response(
      JSON.stringify({ erro: "Não foi possível conectar a nenhuma API" }),
      { status: 500 }
    );
  }

  return Response.json(data);
}