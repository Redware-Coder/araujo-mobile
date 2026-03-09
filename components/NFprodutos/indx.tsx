import { Boxes, Building2 } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Lojas, NFProdutoSet } from "@/components/buscadores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {  Table,  TableBody,  TableCaption,  TableCell,  TableFooter,  TableHead,  TableHeader,  TableRow,} from "@/components/ui/table"
import { useFiltro } from "../contexts/FiltroContext";




export default function ProdutosNota() {   
const [loading, setLoading] = useState(false)
const [info, setInfo] = useState<NFProdutoSet[]>([]) 

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

      const baseUrl = getApiBaseUrl(ip);

      const dadosFiltro = {
        comportamento: 8,
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
        body: JSON.stringify(dadosFiltro),
        signal
      });

      await delay(3500);

      // 2️⃣ Depois busca os dados
        const params = new URLSearchParams();
        params.append('loja', filtros.loja);
        params.append('nf', filtros.nf);

       const response = await fetch(`${baseUrl}/NFProdutos?${params.toString()}`);
       const data = await response.json();
       setInfo(data);     

    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Erro ao carregar Dashboard:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  carregarDados();

  return () => {
    controller.abort();
  };

}, [ip, filtros]);



  const formatarNumero = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    if (currentIndex < filtros.loja.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

 return (
   
   <div className="space-y-2">
  {loading && (
    <p  className="pointer-events-none opacity-20 w-20 h-8">Carregando...</p>
    //className={currentIndex === 0 ? "pointer-events-none opacity-20 w-20 h-8" : "w-20 h-8 "}
  )}

  {!loading && info.length > 0 && (
    <div className="space-y-2 bg">
      {info.map((item, index) => (
        <div
          key={`${item.loja}-${item.nf}-${item.codProd}-${index}`}
          className="border rounded-lg bg p-3 bg-slate-100 shadow-sm"
        >
          <div className="font-semibold text-sm mb-1">
            {item.codProd} - {item.nome}
          </div>

          <div className="grid grid-cols-3 gap-2 text-[1.5vh] text-gray-700">
            <div><strong>IPI:</strong> {formatarNumero(item.ipi)}</div>
            <div><strong>ST:</strong> {formatarNumero(item.st)}</div>
            <div><strong>Qtde:</strong> {item.qtde}</div>
            <div><strong>Compra:</strong><br /> {formatarNumero(item.precoCompra)}</div>
            <div><strong>Custo:</strong><br />  {formatarNumero(item.precoCusto)}</div>
            <div><strong>Venda:</strong><br />  {formatarNumero(item.precoVenda)}</div>            
          </div>
        </div>
      ))}
    </div>
  )}

  {!loading && info.length === 0 && (
    <p className="text-sm text-muted-foreground">
      Nenhum produto encontrado.
    </p>
  )}
</div>
  );
}