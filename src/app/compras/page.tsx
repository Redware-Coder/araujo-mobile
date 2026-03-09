"use client"
import { useFiltro } from '@/components/contexts/FiltroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart,  Truck } from 'lucide-react';
import { useEffect,  useState } from 'react';
import { ComprasSet } from '@/components/buscadores';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProdutosNota from '@/components/NFprodutos/indx';
import { useRouter } from 'next/navigation';

export default function Compras() {
    const [open, setOpen] = useState(false);

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
        pagina: "Compras",
        lojaCidade: "Todas",
        periodo: filtros.periodo
      }));
    }, []);
  
  
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<ComprasSet[]>([]) 
 
      
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
           comportamento: 7,
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
         const [dadosRes] = await Promise.all([
           fetch(`${baseUrl}/NFEntradas`, { signal })
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
   }, [
  ip,
  filtros.lojaCidade,
  filtros.periodo,
  filtros.dataInicial,
  filtros.dataFinal,
  filtros.medida
]);
   

  const formatarNumero = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
      

  const selecionarItem = (compra: any) => {
  setFiltros(prev => ({
    ...prev,
    loja: String(compra.loja),
    nf: String(compra.nf)
  }));
};
  
if (!autorizado) return null;
 return (  
   <main className="sm:ml-14 p-2 bg-slate-100 h-screen md:h-auto">
    <div className=" w-full h-auto flex items-center flex-row mt-14 sm:mt-2">
          <div className='w-full h-auto flex items-left flex-col '>
            <h1 className=" w-auto h-auto text-2xl pl-3 pt-2">Compras</h1>           
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
                      <ShoppingCart className="ml-auto w-6 h-6"></ShoppingCart>
                    </div>
                    <CardDescription >Todas as compras ordenadas da última para primeira
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-2 pt-0 bg-slate-100'>
                    <div className='h-auto hidden justify-between mb-2 font-semibold items-center text-black'>
                  
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
                    Nenhuma Nota Fiscal encontrada
                  </p>
                )}
          
                {!loading && info.length > 0 && (
                  <ul className="space-y-2">
                    {info.map((compra) => (                      
                     <Dialog key={`${compra.loja}-${compra.fornecedor}`}>
                        <DialogTrigger asChild>
                            <div onClick={() => selecionarItem(compra)}
                            >
                          <li 
                            className="border  p-3 bg-slate-200 text-gray-800 shadow-sm cursor-pointer hover:bg-slate-100 transition">  
                            
                             <div className="text-[16px] md:text-lg w-full text-blue-800 flex flex-row items-center font-semibold">
                                <Truck className="w-5 h-5 mr-2"></Truck>
                                {compra.fornecedor} - {compra.nome}                              
                              
                                </div>                       
                             
                             <div className="flex justify-between items-start">
                            
                             <div className='w-20 h-auto text-sm   '>
                               <p>Nota Fiscal: </p>{compra.nf}                            
                             </div>

                             <div className='w-20 h-auto text-sm   '>
                               <p>Dt Entrada:</p> {compra.entrada.split("T")[0].split("-").reverse().join("/")}
                             </div>

                             

                            <div className='w-15 h-auto text-sm hidden  '>
                               <p>Parcelas:</p> {compra.vnota}
                             </div>
                               

                                <div className="text-sm w-24 ">
                                  <p> 
                                    Valor:<br></br>
                                    {compra.vnota.toLocaleString("pt-BR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                  </p>

                                  
                                </div>
                              </div>
                            </li>    </div>
                           
                             </DialogTrigger>

                                <DialogContent className="w-full max-h-180 overflow-y-auto gap-1 [&>button]:hidden">
                                  <DialogHeader>
                                    <DialogTitle className='h-10 mb-2 bg-black text-white flex items-center justify-center rounded-lg'>Detalhes da Nota Fiscal</DialogTitle>
                                  </DialogHeader>
                                    <div>Loja: {compra.loja}</div>
                                    <div>Número: {compra.nf}</div>
                                    <div className='mb-4'>Fornecedor: {compra.fornecedor} - {compra.nome}</div>
                                    <div className='w-full flex items-center justify-between'>
                                      <div>Data Entrada: {compra.entrada.split("T")[0].split("-").reverse().join("/")}</div>
                                      <div className='text-blue-800'>Valor: {formatarNumero(compra.vnota)}</div>

                                    </div>
                                    <hr />
                                    <div className='mt-4 text-lg'>Produtos da NF:</div>
                                    <ProdutosNota/>
                                  </DialogContent>
                        </Dialog>      
                            
                    ))}
                  </ul>
                )}
               
              </CardContent>
           </Card>
        </section>
    </main>
  );
}