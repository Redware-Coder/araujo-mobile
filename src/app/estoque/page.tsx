"use client"
import { useFiltro } from '@/components/contexts/FiltroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { House } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EstoqueSet } from '@/components/buscadores';
import { useRouter } from "next/navigation"; 
import { FiltroW } from '@/components/buscarWindow';

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
        medida: "Todas",
        pagina: "Estoque",
        lojaCidade: "Todas"
      }));
    }, []);
  
  
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<EstoqueSet[]>([]) 
 
      
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
          comportamento: 3,
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
        const response = await fetch(`${baseUrl}/EstoqueLojas`);
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
          (acc, item) => acc + item.saldo,
          0
        )

        const totalValor = info.reduce(
          (acc, item) => acc + item.valor,
          0
        )
  
if (!autorizado) return null;
 return (  
   <main className="flex flex-col items-center lg:items-start lg:ml-56 p-2 bg-slate-100 h-screen">
    <div className=" w-full h-auto flex items-center flex-row mt-14 sm:mt-2">
      <div className='w-full h-auto flex items-center flex-row gap-4'>
            <h1 className=" w-auto h-auto text-2xl pl-3 pt-2 sm:pt-7">Estoque Geral</h1>
            <div className='w-auto h-auto hidden sm:block'><FiltroW></FiltroW></div>             
          </div>         
   </div>

        <section className="lg:w-140 w-full">
          <Card className='bg-slate-150 shadow-none border-0'>
                  <CardHeader className="mb-0">
                    <div className="flex items-center justify-center">
                      <CardTitle className="text-lg sm:textlg font-normal text-gray-600">                       
                       Medida: {filtros.medida}
                      </CardTitle>
                      <House className="ml-auto w-6 h-6"></House>
                    </div>
                    <CardDescription >
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-2 pt-0 bg-slate-100'>
                    <div className='h-12 flex justify-between font-semibold items-center bg-amber-300 text-black'>
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
                  <ul className="space-y-0">
                    {info.map((estoque) => (
                            <li
                              key={`${estoque.codigo}-${estoque.loja}`}
                              className="border p-3 bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition"
                            >                            
                              <div className="flex justify-between items-start">
                                <div className="text-2x1 w-44 text-gray-800 font-semibold">{estoque.codigo} - {estoque.loja}</div>
                                  
                                  <div className={`text-2x1 text-right w-14 font-semibold ${
                                      estoque.saldo > 150
                                        ? "text-gray-800"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {estoque.saldo}
                                  </div>
                               

                                <div className="text-2x1 w-36  text-right text-gray-800">
                                  <p className="font-semibold">
                                    {estoque.valor.toLocaleString("pt-BR", {
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
                <div className='h-12 flex justify-between p-3 bg-black shadow-sm font-semibold items-center text-white'>
                        <div className='w-44 pl-3'>Total</div>
                        {loading ? (
                        <>
                          <div className="w-16 flex justify-end pr-1">
                            <div className="h-4 w-12 bg-gray-300 rounded animate-pulse" />
                          </div>

                          <div className="w-36 flex justify-end">
                            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='w-16 text-right pr-1'>{totalSaldo}</div>
                          <div className='w-36 text-right'>{formatarNumero(totalValor)}</div>
                        </>
                      )}
                              
                              
                </div>
              </CardContent>
           </Card>
        </section>
    </main>
  );
}