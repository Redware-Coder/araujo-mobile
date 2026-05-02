"use client";
import React, { useEffect, useState } from 'react';
import { DadosMobile, Props, Com } from "@/components/buscadores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Building2, DollarSign, Funnel, Landmark, TableProperties } from "lucide-react";
import ChartOverview from "@/components/chart";
import Grid from "@/components/Grid";
import { useFiltro } from '@/components/contexts/FiltroContext';
import { useRouter } from "next/navigation"; 
import { FiltroW } from '@/components/buscarWindow';

export default function Home() {
  
   const { filtros, setFiltros } = useFiltro();   
   const [info, setInfo] = useState<DadosMobile[]>([]) 
   const [valor, setValores] = useState<Props[]>([]) 
   const [comunicacao, setCominucacao] = useState<Com[]>([]) 
   const [loading, setLoading] = useState(false)
   const [ip, setIp] = useState("");
   const router = useRouter();
   const [autorizado, setAutorizado] = useState<boolean | null>(null);

  useEffect(() => {
    if (filtros.dev === "start") {
      setAutorizado(true);
    } else {
      setAutorizado(false);
      router.replace("/");
    }
  }, [filtros.dev, router]);

  useEffect(() => {
      setFiltros((prev) => ({
        ...prev,
        pagina: "Dashboard",
        lojaCidade: "Todas",
        periodo: "Hoje"
      }));
    }, []); 

  useEffect(() => {
    async function buscarIP() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
      } catch (err) {
        console.error("Erro ao buscar IP externo", err);
      }
    }

    buscarIP();
  }, []);

  function getApiBaseUrl(ip: string) {
  if (ip.startsWith("177.54.239.199")) {
    return "http://10.1.1.135:4143/api/SqlApp";
  }

  return "http://177.54.239.199:4143/api/SqlApp";
  
}

  function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  useEffect(() => {
  if (!ip || !filtros.medida) return;

  const controller = new AbortController();
  const signal = controller.signal;

  async function carregarDados() {
    try {
      setLoading(true);

      //const baseUrl = getApiBaseUrl(ip);
    const baseUrl = "http://177.54.239.199:4143/api/SqlApp";

      const dadosFiltro = {
        comportamento: 1,
        loja: filtros.lojaCidade,
        periodo: filtros.periodo,
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        dataini: filtros.dataInicial,
        datafin: filtros.dataFinal,
        referencia: "",
        medida: filtros.medida
      };

      // 1️⃣ Primeiro envia filtro
      await fetch(`${baseUrl}/UpComunicacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosFiltro),
        signal
      });

      //Espera o sincronizador atualizar as tabelas
       await delay(4500);

      // 2️⃣ Depois busca os dados
      const [dadosRes, comunicacaoRes] = await Promise.all([
        fetch(`${baseUrl}/Dados`, { signal }),
        fetch(`${baseUrl}/Comunicacao`, { signal })
      ]);

      if (!dadosRes.ok || !comunicacaoRes.ok) {
        throw new Error("Erro na API");
      }

      const dados = await dadosRes.json();
      const comunicacao = await comunicacaoRes.json();

      setInfo(dados);
      setValores(dados);
      setCominucacao(comunicacao);

    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Erro ao carregar Dashboard:", error);
      }
    } finally {
      setLoading(false); // 🔥 Só desliga aqui
    }
  }

  carregarDados();

  return () => {
    controller.abort(); // evita duplicação no StrictMode
  };
}, [ip, filtros]);

if (autorizado !== true) {
    return null;
  }

  return (
  
   <main className="lg:ml-56 p-2 bg-slate-100 h-dvh">
    <div className=" w-full h-auto flex items-center flex-row mb-4 mt-14 sm:mt-2">
      <div className='w-full h-auto flex items-center flex-row gap-4'>
        <h1 className=" w-auto h-auto text-2xl pl-3 pt-2 sm:pt-5">Dashboard</h1>
        <div className='w-auto h-auto'><FiltroW></FiltroW></div>
      </div>
     
    </div>
    <section className="sm:justify-start grid grid-cols sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
      
      <Card>
        <CardHeader className="pl-4 pr-4">
          <div className="flex items-center justify-center">
            <CardTitle className="text-2xl sm:text-2xl">
              Faturamento
            </CardTitle>
            <DollarSign className="ml-auto w-6 h-6"></DollarSign>
          </div>
          <CardDescription>Vendas da(s) Loja(s), Cidade ou Estado </CardDescription>
        </CardHeader>
        <CardContent className="pl-4 pr-4">
          <div className="w-auto flex justify-center text-lg sm:text-[1.4vh] font-semibold lg:text-lg text-green-700">Vendido:</div>
          <div className='w-auto mb-1 flex flex-row items-center justify-center'>            
            <div className="text-lg sm:text-[1.4vh] mr-4 sm:hidden lg:text-lg lg:block text-gray-500 font-semibold">R$ </div>
             {loading ? (
              <div className="w-auto flex flex-col gap-2">
                <div className="h-8 w-50 bg-gray-300 rounded animate-pulse" />
              </div>
            ) : (info.length > 0 && (
            <div className="text-[5.3vh] sm:text-[3vh] lg:text-[4vh] justify-center flex font-semibold text-green-700">{info[0].venda}</div>))}
            
          </div>
          

        <div className="flex items-center justify-between flex-row">          
          <div className="w-auto">                    
            <div className="text-lg sm:text-[1.7vh] lg:text-lg text-blue-700">Recebido:</div>
            <div className="text-lg sm:text-[1.7vh]  lg:text-lg text-orange-500">A Receber:</div>
          </div>

          <div className="w-auto">
            <div className="text-lg  sm:text-[1.7vh]  sm:hidden lg:text-lg lg:block text-blue-700">R$:</div>
            <div className="text-lg  sm:text-[1.7vh] sm:hidden lg:text-lg lg:block text-orange-500">R$:</div>
          </div>
            {loading ? (
              <div className="w-auto flex flex-col gap-2">
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
              </div>
            ) : (info.length > 0 && (
                          <div className="w-auto flex flex-col">            
                            <div className="text-lg sm:text-[1.7vh]  lg:text-lg flex justify-end text-blue-700">{info[0].recebido}</div>
                            <div className="text-lg sm:text-[1.7vh]  lg:text-lg flex justify-end text-orange-500">{info[0].areceber}</div>
                          
                          </div>
              ))}          
        </div>   
        </CardContent>           
      </Card>

      <Card>
        <CardHeader className="pl-4 pr-4">
          <div className="flex items-center justify-center">
            <CardTitle className="text-2xl sm:text-2xl">
              Detalhes de Venda
            </CardTitle>
            <TableProperties className="ml-auto w-6 h-6"></TableProperties>
          </div>
          <CardDescription>Valores separados por tipo</CardDescription>          
        </CardHeader>
        <CardContent className="px-4 text-gray-800">
         <div className="flex items-center justify-between flex-row mb-2">
            <div className="text-lg  sm:text-[1.7vh] lg:text-lg font-semibold">Qtd de Pneus Vendidos:</div>

            {loading ? (
              <div className="w-auto flex flex-col gap-2">
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
              </div>
            ) : (valor.length > 0 && (
              <div className="text-lg sm:text-[1.7vh] lg:text-lg font-semibold flex justify-end">{valor[0].qtdPneu}</div>
            ))}
        </div><hr></hr>
        <div className="flex items-center justify-between flex-row mt-2">
          <div className="w-auto">
            <div className="text-lg  sm:text-[1.7vh] lg:text-lg font-bol">Pneus:</div>
            <div className="text-lg  sm:text-[1.7vh] lg:text-lg font-bol">Serviços:</div>
            <div className="text-lg  sm:text-[1.7vh] lg:text-lg font-bol">Peças/Outros:</div>
          </div>

          <div className="w-auto">
            <div className="text-lg  sm:hidden  md:text-lg lg:block">R$:</div>
            <div className="text-lg  sm:hidden  md:text-lg lg:block">R$:</div>
            <div className="text-lg sm:hidden  md:text-lg lg:block">R$:</div>
          </div>
          {loading ? (
              <div className="w-auto flex flex-col gap-2">
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
              </div>
            ) : (valor.length > 0 && (
                <div className="w-auto">
                  <div className="text-lg sm:text-[1.7vh] lg:text-lg flex justify-end">{valor[0].pneu}</div>
                  <div className="text-lg sm:text-[1.7vh] lg:text-lg flex justify-end">{valor[0].servico}</div>
                  <div className="text-lg sm:text-[1.7vh] lg:text-lg flex justify-end">{valor[0].outros}</div>
                </div> 
          ))}      

        </div>  
        </CardContent>  
        <CardContent className="lex-row gap-4 ml-5 hidden">
          <div className="w-44 h-36 flex items-center justify-center bg-slate-400">GRAFICO</div> 

          <div className="w-44 h-36 flex flex-col px-4 pt-4">
            <div className="w-auto h-6 flex flex-row items-center justify-between gap-1">
              <div className="w-4 h-4 bg-black"></div>
              <div className="w-12-h-5">Pneu</div>
              <div className="w-20 h-6 ml-2"> (82.60%)</div>
            </div>  
            <div className="w-auto h-6 flex flex-row items-center justify-between gap-1">
              <div className="w-4 h-4 bg-black"></div>
              <div className="w-12-h-5">Pneu</div>
              <div className="w-20 h-6 ml-2"> (82.60%)</div>
            </div>  
            <div className="w-auto h-6 flex flex-row items-center justify-between gap-1">
              <div className="w-4 h-4 bg-black"></div>
              <div className="w-12-h-5">Pneu</div>
              <div className="w-20 h-6 ml-2"> (82.60%)</div>
            </div>            
          </div> 
        </CardContent>   
      </Card>

       <Card className='bg-gray-900' >
        <CardHeader>
          <div className="flex items-center justify-center ">
           <CardTitle className="text-2xl sm:text-2xl text-white">
              Financeiro
            </CardTitle>
            <Landmark className="ml-auto w-6 h-6 text-white"></Landmark>
          </div>
          <CardDescription className='text-slate-300'>
            Valores de Recebimento, Pagamento e Boletos em atraso          
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-4 pr-4 text-white">
        <div className="flex items-center justify-between flex-row">
          <div className="w-auto">            
            <div className="text-lg sm:text-[1.7vh] lg:text-lg ">A Receber:</div>
            <div className="text-lg sm:text-[1.7vh] lg:text-lg  ">A Pagar:</div>
            <div className="text-lg sm:text-[1.7vh] lg:text-lg  t">Boletos Atraso:</div>
          </div>

          <div className="w-auto">
            <div className="text-lg  sm:text-[1.7vh] lg:text-lg ">R$:</div>
            <div className="text-lg  sm:text-[1.7vh] lg:text-lg ">R$:</div>
            <div className="text-lg  sm:text-[1.7vh] lg:text-lg ">R$:</div>
          </div>
            {loading ? (
              <div className="w-auto flex flex-col gap-2">
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
              </div>
            ) : (info.length > 0 && (
                          <div className="w-auto flex flex-col">            
                            <div className="text-lg sm:text-[1.7vh] lg:text-lg flex justify-end ">
                              {valor[0].areceberFinanceiro.toLocaleString("pt-BR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                              })}
                            </div>
                            <div className="text-lg sm:text-[1.7vh] lg:text-lg flex justify-end ">
                              {valor[0].apagarFinanceiro.toLocaleString("pt-BR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                              })}
                            </div>
                            <div className="text-lg sm:text-[1.7vh] lg:text-lg flex justify-end ">
                              {valor[0].boletovencido.toLocaleString("pt-BR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                              })}</div>
                          
                          </div>
              ))}          
        </div>   
        </CardContent>        
        </Card>
 </section>

 <section className="mt-4 flex flex-col md:flex-row gap-4">  
    <Grid/>
 </section>

   </main>
  );
}