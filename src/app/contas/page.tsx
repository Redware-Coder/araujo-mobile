"use client"
import { BanknoteArrowUp, Boxes, Building2, SquareKanban } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { ContasSet } from "@/components/buscadores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Table,  TableBody,  TableCaption,  TableCell,  TableFooter,  TableHead,  TableHeader,  TableRow,} from "@/components/ui/table"
import { useFiltro } from "@/components/contexts/FiltroContext";
import { useRouter } from "next/navigation"; 
import { FiltroW } from "@/components/buscarWindow";


export default function Contas() {       

    //COMEÇAR COMO PADRAO SEMPRE QUE CARREGAR A PAGINA
   const { filtros, setFiltros } = useFiltro();
   const router = useRouter();
     const [autorizado, setAutorizado] = useState(false);
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
        medida: "Todas",
        pagina: "Contas",
        lojaCidade: "Todas"
      }));
    }, []);

const [contasDados, setContasDados] = useState<ContasSet[]>([]) 
const [loading, setLoading] = useState(false)



const [ip, setIp] = useState("");

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

    useEffect(() => {
      if (!ip) return;

      async function aplicarFiltro() {
        const baseUrl = getApiBaseUrl(ip);

        const dados = {
          comportamento: 5,
          loja: filtros.lojaCidade,
          periodo: filtros.periodo,
          mes: new Date().getMonth() + 1,
          ano: new Date().getFullYear(),
          dataini: filtros.dataInicial,
          datafin: filtros.dataFinal,
          referencia: "",
          medida: filtros.medida
        };

        await fetch(`${baseUrl}/UpComunicacao`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
      }

      aplicarFiltro();
    }, [filtros, ip]); 
    
        useEffect(() => {
    
        async function buscarIP() {
          try {
            const res = await fetch("/api");
            const data = await res.json();
            setIp(data.ip);
          } catch (err) {
            console.error("Erro ao buscar IP");
          }
        }
    
        buscarIP();
      }, []);
    
 

useEffect(() => {
  if (!ip || !filtros.medida) return;  

  setLoading(true);
  const baseUrl = getApiBaseUrl(ip);

  const timer = setTimeout(() => {
    async function Read() {
      try {
        const response = await fetch(`${baseUrl}/Contas`);
        const data = await response.json()
        setContasDados(data);      
        console.log(data);
      } catch (error) {
        console.error("Erro ao Conectar com Banco de dados")
      }         
    }
   Promise.all([Read()]).finally(() => {
      setLoading(false)
    })
  }, 4500)

  return () => clearTimeout(timer)
  }, [filtros, ip])

  const formatarNumero = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

        const totalProd = contasDados.reduce(
                (acc, item) => acc + item.areceber,
                0
              )

        const totalServ = contasDados.reduce(
          (acc, item) => acc + item.apagar,
          0
        )

        const totalTudo = contasDados.reduce(
          (acc, item) => acc + item.saldo,
          0
        )


if (!autorizado) return null;
 return (
     <main className="flex flex-col items-center lg:items-start lg:ml-56 p-2 bg-slate-100 h-dvh">
        <div className=" w-full h-auto flex items-center flex-row mt-14 sm:mt-2 mb-3">
          <div className='w-full h-auto flex items-left flex-row items-center gap-4 '>
                    <h1 className=" w-auto h-auto text-2xl pl-3 pt-2 sm:pt-7">Financeiro</h1> 
                    <div className='w-auto h-auto hidden sm:block'><FiltroW /></div>              
                </div>         
        </div>
            <section className="lg:w-140 w-full">                
                <Card className="mt-4">
                    <CardHeader className="pl-4 pr-4">
                        <div className="flex items-center justify-center">
                            <CardTitle className="text-2xl sm:text-2xl">
                            Contas das Lojas
                            </CardTitle>
                            <BanknoteArrowUp className="ml-auto w-6 h-6" rotate={3} />
                        </div>
                        <CardDescription>
                            <p>Loja(s): {filtros.lojaCidade} </p>                           
                            Período: {filtros.periodo != "Manual" ? filtros.periodo : 
                            filtros.dataInicial?.toLocaleDateString("pt-BR") + " à " +
                            filtros.dataFinal?.toLocaleDateString("pt-BR")
                            }
                            </CardDescription>          
                        </CardHeader>
                
                    <CardContent className="p-2">
                        <Table>
                            <TableCaption></TableCaption>
                            <TableHeader>
                                <TableRow className="font-bold">
                                <TableHead className="w-20">Lojas</TableHead>
                                <TableHead className="text-right">Receber</TableHead>
                                <TableHead className="text-right">Pagar</TableHead>
                                <TableHead className="text-right">Saldo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                        <div className="h-5 w-full mb-2 bg-gray-300 rounded animate-pulse" />
                                        </TableCell>
                                    </TableRow>              
                                    
                                ) : (contasDados.slice(0, 14).map((contas) => (
                                            <TableRow key={contas.loja}>
                                                <TableCell className="w-20">{contas.nomeLoja}</TableCell>
                                                <TableCell className="w-20 text-right text-blue-600">{formatarNumero(Number(contas.areceber))}</TableCell>
                                                <TableCell className="w-20 text-right text-gray-800">{formatarNumero(Number(contas.apagar))}</TableCell>
                                                <TableCell className={`text-right bg-yellow-100 w-14 font-semibold ${contas.saldo > 150 ? "text-green-800" : "text-red-500"}`}>
                                                    
                                                                                                        
                                                    {formatarNumero(Number(contas.saldo))}</TableCell>
                                            </TableRow>
                                            )))}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="text-[14px]">
                                <TableCell> Totais</TableCell>
                                <TableCell className="text-right font-semibold text-blue-600">
                                    {loading ? (
                                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                                    ) : (
                                    <>{totalProd.toLocaleString("pt-BR")}</>
                                    )}
                                </TableCell>

                                <TableCell className="text-right font-semibold text-gray-800">
                                    {loading ? (
                                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                                    ) : (
                                    <>{totalServ.toLocaleString("pt-BR")}</>
                                    )}
                                </TableCell>

                                <TableCell className="text-right font-semibold text-green-800">
                                    {loading ? (
                                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse ml-auto" />
                                    ) : (
                                    <>{totalTudo.toLocaleString("pt-BR")}</>
                                    )}
                                </TableCell>
                                </TableRow>
                            </TableFooter>                      
                    </Table>
                    </CardContent>
                </Card>
        </section>
   </main>
  );
}