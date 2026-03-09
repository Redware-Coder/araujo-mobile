"use client"
import { useFiltro } from '@/components/contexts/FiltroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, House, Library, List, Repeat2, SquareKanban } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BoletosVencidosSet } from '@/components/buscadores';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogOverlay } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

export default function Estoque() {

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
        pagina: "Boletos",
        lojaCidade: "Todas",
        periodo: filtros.periodo
      }));
    }, []);
  
  
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<BoletosVencidosSet[]>([]) 
 
      
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
          comportamento: 4,
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
    if (!ip) return;

    setLoading(true);
    const baseUrl = getApiBaseUrl(ip);

    const timer = setTimeout(async () => {      
      
    async function Iniciar() {
      try {
        const response = await fetch(`${baseUrl}/BoletosVencidos`);
        const data = await response.json()
        setInfo(data)
      } catch (error) {
        console.error("Erro ao Conectar com Banco de dados")
      }
    }           
        setLoading(false);
        Iniciar();
    }, 3000);
    

    return () => clearTimeout(timer);
  }, [ip, filtros]);

  const formatarNumero = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
      

 const inputRef = useRef<HTMLInputElement>(null);
 const [medidaSelecionada, setMedidaSelecionada] = useState<string>(filtros.medida ?? "")

 const totalSaldo = info.reduce(
          (acc, item) => acc + item.valor,
          0
        )

        const totalValor = info.reduce(
          (acc, item) => acc + item.valor,
          0
        )
  
  if (!autorizado) return null;
  return (  
   <main className="sm:ml-14 p-2 bg-slate-100 h-screen md:h-auto">
    <div className=" w-full h-auto flex items-center flex-row mt-14 sm:mt-2">
          <div className='w-full h-auto flex items-left flex-col '>
            <h1 className=" w-auto h-auto text-2xl pl-3 pt-2">Boletos Vencidos</h1>           
          </div>         
   </div>

        <section className="sm:w-140">
          <Card className='bg-slate-150 shadow-none border-0'>
                  <CardHeader className="mb-0">
                    <div className="flex items-center justify-center">
                      <CardTitle className="text-lg sm:text-lg font-normal text-gray-600">                       
                       Loja: {filtros.lojaCidade}<br></br>
                       Período: {filtros.periodo}
                      </CardTitle>
                      <SquareKanban className="ml-auto w-6 h-6"></SquareKanban>
                    </div>
                    <CardDescription >
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-2 pt-0 bg-slate-100'>
                    <div className='h-12 hidden justify-between font-semibold items-center bg-amber-300 text-black'>
                              <div className='w-44 pl-3'>Loja</div>
                              <div className='w-16 pl-3'>Saldo</div>
                              <div className='w-36 flex justify-center'>Valor</div>
                    </div>
                {loading && (
                    <div className="text-sm text-muted-foreground">
                      <div className="pt-2 flex animate-pulse items-center justify-center">
                        Carregando Dados...
                      </div>

                      <div className="w-auto flex flex-row gap-2 p-4">
                        <div className="h-5 w-full bg-gray-300 rounded animate-pulse" />
                      </div>
                    </div>
                  )}

                {!loading && info.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum produto encontrado para esta medida
                  </p>
                )}
          
                {!loading && info.length > 0 && (
                  <ul className="space-y-2">
                    {info.map((vencidos) => (                      
                          
                          <li key={`${vencidos.loja}-${vencidos.titulo}`}
                            className="border  p-3 bg-white text-gray-600  shadow-sm cursor-pointer hover:bg-slate-50 transition">  
                            
                             <div className="text-2x1 w-full text-red-600 font-semibold">{vencidos.codCliente} - {vencidos.nome}</div>                       
                             
                             <div className="flex justify-between items-start">
                            
                             <div className='w-20 h-auto text-sm   '>
                               <p>Titulo: </p>{vencidos.titulo}
                             </div>

                             <div className='w-30 h-auto text-sm   '>
                               <p>Vencimento:</p> {vencidos.vencimento.split("T")[0].split("-").reverse().join("/")}
                             </div>

                             

                            <div className='w-15 h-auto text-sm   '>
                               <p>Parcela:</p> {vencidos.parcela}
                             </div>
                               

                                <div className="text-sm w-24 ">
                                  <p> 
                                    Valor:<br></br>
                                    {vencidos.valor.toLocaleString("pt-BR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                  </p>

                                  
                                </div>
                              </div>
                            </li>               
                            
                    ))}
                  </ul>
                )}
               
              </CardContent>
           </Card>
        </section>
    </main>
  );
}