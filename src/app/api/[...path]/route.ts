import { NextRequest } from "next/server";

const BASE_URL = "http://10.1.1.135:4143";

async function handler(req: NextRequest, { params }: any) {
  const path = params.path.join("/");
  const url = `${BASE_URL}/${path}${req.nextUrl.search}`;

  const body = req.method !== "GET" ? await req.text() : undefined;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.text();

  return new Response(data, {
    status: response.status,
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };