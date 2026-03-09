"use client"
import { useFiltro } from '@/components/contexts/FiltroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, ChevronLeft, ChevronRight, House, Library, List, Repeat2, Scale, SquareKanban } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BalanceteSet } from '@/components/buscadores';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter } from 'next/navigation';


  

export default function Balancete() {

 //COMEÇAR COMO PADRAO SEMPRE QUE CARREGAR A PAGINA
   const { filtros, setFiltros } = useFiltro();
    const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" }).replace(/^./, (letra) => letra.toUpperCase())
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
        pagina: "Balancete",
        lojaCidade: "Todas",
        periodo: mesAtual
      }));
    }, []);
  
  
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<BalanceteSet[]>([]) 
 
      
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
           comportamento: 6,
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
          await delay(5500);
   
         // 2️⃣ Depois busca os dados
         const [dadosRes] = await Promise.all([
           fetch(`${baseUrl}/Balancete`, { signal })
         ]);
   
         if (!dadosRes.ok) {
           throw new Error("Erro na API");
         }
   
         const dados = await dadosRes.json();
   
         setInfo(dados);
   
       } catch (error: any) {
         if (error.name !== "AbortError") {
           console.error("Erro ao carregar Dashboard:", error);
         }
       } finally {
         setLoading(false); // 🔥 desliga aqui
       }
     }
   
     carregarDados();
   
     return () => {
       controller.abort(); // evita duplicação no StrictMode
     };
   }, [ip, filtros]);

  const formatarNumero = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
      

 const inputRef = useRef<HTMLInputElement>(null);
 const [medidaSelecionada, setMedidaSelecionada] = useState<string>(filtros.medida ?? "")

      

   const lojas = [
    "Matriz +",
    "Michelin-TO",
    "T. de A.",
    "Novo Repartimento",
    "Palmas",
    "Parauapebas",
    "Michelin-PA",
    "Borracharia",
    "Augustinópolis",
    "Paraíso",
    "Xinguara",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    if (currentIndex < lojas.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const faturamentoGeral = info[0]?.faturamento || 0;
  const vendaProd = info[0]?.vendaProd || 0;

  const calcularPorcentagem = (valor: number): string => {
    if (!faturamentoGeral || faturamentoGeral === 0) return "0%";
    return ((valor || 0) / faturamentoGeral * 100).toFixed(2) + "%";
  };

  const calcularPorcentagemP = (valor: number): string => {
    if (!vendaProd || vendaProd === 0) return "0%";
    return ((valor || 0) / vendaProd * 100).toFixed(2) + "%";
  };
  if (!autorizado) return null;
  
 return (  
   <main className="sm:ml-14 p-2 h-screen md:h-auto bg-yellow-200">
    <div className=" w-full h-auto flex items-center flex-row mt-14 sm:mt-2">
          <div className='w-full h-auto flex items-left flex-col '>
            <h1 className="hidden w-auto h-auto text-2xl pl-3 pt-2">DRE / Balancete</h1>           
          </div>         
   </div>

        <section className="sm:w-140">
          <Card className='bg-slate-150 shadow-none border-0'>
                  
              <CardContent className='m-0 p-2 pt-0'>
                <div className="flex items-center justify-center">
                      <div className="text-[2.2vh] sm:text-lg font-normal text-gray-900">                       
                       DRE - Balancete</div>
                        <Scale className="ml-7 w-7 h-7"></Scale>
                </div>
                        <Pagination className='hidden'>
                            <PaginationContent className="items-center justify-center gap-4">

                                <PaginationItem>
                                <ChevronLeft onClick={handlePrevious} 
                                className={currentIndex === 0 ? "pointer-events-none opacity-20 w-20 h-8" : "w-20 h-8 "}>
                                 </ChevronLeft>                                
                                </PaginationItem>

                                {/* Nome da Loja Atual */}
                                <PaginationItem className='w-60 bg-amber-300 flex justify-center rounded-2xl'>
                                <span className="px-6 py-2 font-semibold text-lg">
                                    {lojas[currentIndex]}
                                </span>
                                </PaginationItem>

                                <PaginationItem>
                                <ChevronRight
                                    onClick={handleNext}
                                    className={
                                    currentIndex === lojas.length - 1
                                        ? "pointer-events-none opacity-20 w-20 h-8" : "w-20 h-8"}
                                />
                                </PaginationItem>

                            </PaginationContent>
                            
                        </Pagination>
                        {currentIndex === 0 ?
                        <p className='w-full hidden justify-center text-gray-500 mt-1'>
                            Matriz + Rovanny + T. de A. </p> : ""}
                        {loading ? (
                            <div className="w-full h-100 flex flex-col justify-center items-center mt-10">
                              <div className="w-20 h-20 border-4 mb-6 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
                              <p className='text-gray-600'>Carregando</p>
                            </div>
                          ) : info.length > 0 && (
                          
                        <div className='w-full h-auto mt-4 flex flex-row justify-between'>
                            <div className='w-auto h-full flex flex-row justify-between'>
                              
                                <div>
                                    <p className='font-bold'>Faturamento Geral</p><hr className='border-gray-800'></hr><br></br>
                                    <p>Venda de produtos</p><hr className='border-gray-600'></hr>
                                    <p>Custo matéria-prima</p><hr className='border-gray-600'></hr>
                                    <p>Lucro bruto venda</p><hr className='border-gray-600'></hr><br></br>

                                    <p>Fatur. de serviços</p><hr className='border-gray-600'></hr>
                                    <p>Receitas fixas</p><hr className='border-gray-600'></hr>
                                    <p>Bonific. de entrada</p><hr className='border-gray-600'></hr>
                                    <p>Total das receitas</p><hr className='border-gray-600'></hr><br></br>

                                    <p>Despesas fixas</p><hr className='border-gray-600'></hr>
                                    <p>Despesas variáveis</p><hr className='border-gray-600'></hr>
                                    <p>Total das despesas</p><hr className='border-gray-600'></hr><br></br>

                                    <p>Boletos em atraso</p><hr className='border-gray-600'></hr><br></br>

                                    <p>Bonific. de saída</p><hr className='border-gray-600'></hr>
                                    <p>Total de avarias</p><hr className='border-gray-600'></hr>
                                    <p>Total de comodatos</p><hr className='border-gray-600'></hr>
                                    <p>Desconto financ. </p><hr className='border-gray-600'></hr>
                                    <p>Total perdido</p><hr className='border-gray-600'></hr>
                                    <p>Total de outros</p><hr className='border-gray-600'></hr>
                                    <p>Desconto concedido</p><hr className='border-gray-600'></hr><br></br>

                                    <p>Lucro bruto geral</p><hr className='border-gray-600'></hr>
                                    <p>Investimentos</p><hr className='border-gray-600'></hr><br></br>

                                    <p className='font-bold'>Lucro Líquido Saldo</p><hr className='border-gray-600'></hr>
                                </div>
                                <div className='text-right m-0'>
                                    <p className='font-bold'>:</p><hr className='border-gray-600'></hr><br></br>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr><br></br>

                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr><br></br>

                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr><br></br>

                                    <p>:</p><hr className='border-gray-600'></hr><br></br>
                                    
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr><br></br>

                                    <p>:</p><hr className='border-gray-600'></hr>
                                    <p>:</p><hr className='border-gray-600'></hr><br></br>

                                    <p className='font-bold'>:</p><hr className='border-gray-600'></hr>
                                </div>

                            </div>
                            <div className='w-auto px-3 h-full text-right'>
                                <p className='font-bold'>{formatarNumero(info[0].faturamento)}</p><hr className='border-gray-600'></hr><br></br>
                                <p></p>
                                <p>{formatarNumero(info[0].vendaProd)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].custoMateria)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].lucroBruto)}</p><hr className='border-gray-600'></hr><br></br>

                                <p>{formatarNumero(info[0].vendaServ)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].receitaFixa)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].boniEntrada)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].totalReceitas)}</p><hr className='border-gray-600'></hr><br />

                                <p>{formatarNumero(info[0].despesasFixas)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].despesasVariaveis)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].totalDespesas)}</p><hr className='border-gray-600'></hr><br></br>

                                <p>{formatarNumero(info[0].boletosAtraso)}</p><hr className='border-gray-600'></hr><br></br>
                                                                    
                                <p>0,00</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].tAvarias)}</p><hr className='border-gray-600'></hr>
                                <p>0,00</p><hr className='border-gray-600'></hr>
                                <p>0,00</p><hr className='border-gray-600'></hr>
                                <p>0,00</p><hr className='border-gray-600'></hr>
                                <p>0,00</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].descontoC)}</p><hr className='border-gray-600'></hr><br></br>

                                <p>{formatarNumero(info[0].lucroBrutoGeral)}</p><hr className='border-gray-600'></hr>
                                <p>{formatarNumero(info[0].investimentos)}</p><hr className='border-gray-600' /><br></br>

                                <p className='font-bold'>{formatarNumero(info[0].lucroLiquido)}</p><hr className='border-gray-600'></hr>
                            </div>
                            <div className='w-auto h-full text-right px-1'>
                                <p className='font-bold'>100%</p><hr className='border-gray-600'/><br />

                                <p>{calcularPorcentagem(info[0].vendaProd)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagemP(info[0].custoMateria)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].lucroBruto)}</p><hr className='border-gray-600'/><br />

                                <p>{calcularPorcentagem(info[0].vendaServ)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].receitaFixa)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].boniEntrada)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].totalReceitas)}</p><hr className='border-gray-600'/><br />

                                <p>{calcularPorcentagem(info[0].despesasFixas)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].despesasVariaveis)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].totalDespesas)}</p><hr className='border-gray-600'/><br />

                                <p>{calcularPorcentagem(info[0].boletosAtraso)}</p><hr className='border-gray-600'/><br />

                                <p>{calcularPorcentagem(0)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].tAvarias)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(0)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(0)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(0)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(0)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].descontoC)}</p><hr className='border-gray-600'/><br />

                                <p>{calcularPorcentagem(info[0].lucroBrutoGeral)}</p><hr className='border-gray-600'/>
                                <p>{calcularPorcentagem(info[0].investimentos)}</p><hr className='border-gray-600'/><br />

                                <p className='font-bold'>{calcularPorcentagem(info[0].lucroLiquido)}</p><hr className='border-gray-600' />
                            </div>
                            
                        </div>)}
              </CardContent>
           </Card>
        </section>
    </main>
    )  ;
}