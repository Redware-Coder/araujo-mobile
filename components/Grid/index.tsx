import { Boxes, Building2 } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Lojas } from "@/components/buscadores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {  Table,  TableBody,  TableCaption,  TableCell,  TableFooter,  TableHead,  TableHeader,  TableRow,} from "@/components/ui/table"
import { useFiltro } from "../contexts/FiltroContext";




export default function Grid() {   
const [lojaDados, setLojaDados] = useState<Lojas[]>([]) 
const [loading, setLoading] = useState(false)

const { filtros } = useFiltro()

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
  if (!ip || !filtros.medida) return;

  setLoading(true);
  const baseUrl = getApiBaseUrl(ip);

  const timer = setTimeout(() => {
    async function Read() {
      try {
        const response = await fetch(`${baseUrl}/Lojas`);
        const data = await response.json()
        setLojaDados(data);      
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

        const totalProd = lojaDados.reduce(
                (acc, item) => acc + item.produto,
                0
              )

        const totalServ = lojaDados.reduce(
          (acc, item) => acc + item.servico,
          0
        )

        const totalTudo = lojaDados.reduce(
          (acc, item) => acc + item.total,
          0
        )



 return (
   <Card>
     <CardHeader className="pl-4 pr-4">
          <div className="flex items-center justify-center">
            <CardTitle className="text-2xl sm:text-2xl">
              Vendas por Lojas
            </CardTitle>
            <Building2 className="ml-auto w-6 h-6" rotate={3} />
          </div>
          <CardDescription>
            Período selecionado: {filtros.periodo != "Manual" ? filtros.periodo : 
            filtros.dataInicial?.toLocaleDateString("pt-BR") + " à " +
            filtros.dataFinal?.toLocaleDateString("pt-BR")
            }
            </CardDescription>          
        </CardHeader>
   
    <CardContent className="p-1">
        <Table>
            <TableCaption></TableCaption>
            <TableHeader>
                <TableRow className="font-bold">
                <TableHead className="w-20">Lojas</TableHead>
                <TableHead className="text-right">Produtos</TableHead>
                <TableHead className="text-right">Serviços</TableHead>
                <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                  {loading ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <div className="h-5 w-full mb-2 bg-gray-300 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>              
                    
                  ) : (lojaDados.slice(0, 14).map((lojaDados) => (
                            <TableRow key={lojaDados.loja}>
                                <TableCell>{lojaDados.nome}</TableCell>
                                <TableCell className="text-right text-blue-600">{formatarNumero(Number(lojaDados.produto))}</TableCell>
                                <TableCell className="text-right text-gray-800">{formatarNumero(Number(lojaDados.servico))}</TableCell>
                                <TableCell className="text-right text-green-800">{formatarNumero(Number(lojaDados.total))}</TableCell>
                              </TableRow>
                            )))}
            </TableBody>
            <TableFooter>
                <TableRow className="text-[14px]">
                  <TableCell> Totais</TableCell>
                  <TableCell className="text-right text-blue-600">
                    {loading ? (
                      <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                    ) : (
                      <>{formatarNumero(totalProd)}</>
                    )}
                  </TableCell>

                  <TableCell className="text-right text-gray-800">
                    {loading ? (
                      <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                    ) : (
                      <>{formatarNumero(totalServ)}</>
                    )}
                  </TableCell>

                  <TableCell className="text-right text-green-800">
                    {loading ? (
                      <div className="h-4 w-20 bg-gray-300 rounded animate-pulse ml-auto" />
                    ) : (
                      <>{formatarNumero(totalTudo)}</>
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>                      
    </Table>
    </CardContent>
   </Card>
  );
}