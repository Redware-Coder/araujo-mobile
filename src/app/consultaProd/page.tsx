"use client"
import { useFiltro } from '@/components/contexts/FiltroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ProdutosSet } from '@/components/buscadores';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

export default function ConsultarProd() {

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
        pagina: "Produtos",
        lojaCidade: "Matriz"
      }));
    }, []);
  
  
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<ProdutosSet[]>([]) 
 
      
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
   
  

  let lojas = ""
  if (filtros.lojaCidade === "Matriz") lojas = "1"
  if (filtros.lojaCidade === "Michelin-TO") lojas = "2"
  if (filtros.lojaCidade === "T. de A") lojas = "4"
  if (filtros.lojaCidade === "Novo Repartimento") lojas = "5"
  if (filtros.lojaCidade === "Palmas") lojas = "6"
  if (filtros.lojaCidade === "Parauapebas") lojas = "8"
  if (filtros.lojaCidade === "Canaã") lojas = "9"
  if (filtros.lojaCidade === "Michelin-PA") lojas = "10"
  if (filtros.lojaCidade === "Borracharia") lojas = "11"
  if (filtros.lojaCidade === "Augustinópolis") lojas = "12"
  if (filtros.lojaCidade === "Paraíso") lojas = "14"
  if (filtros.lojaCidade === "Xinguara") lojas = "16"
  
  useEffect(() => {
    if (!ip) return;

    setLoading(true);
    const baseUrl = getApiBaseUrl(ip);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.append('loja', lojas);

        // envia referencia só se não for "Todas"
        params.append('referencia', filtros.medida);
        
        if(filtros.medida != "Todas"){
        const response = await fetch(`${baseUrl}/Pneus?${params.toString()}`);
        const data = await response.json();
        setInfo(data);}
        else{
          const response = await fetch(`${baseUrl}/Pneus2?${params.toString()}`);
        const data = await response.json();
        setInfo(data);
        }
      } catch (error) {
        console.error('Erro ao Conectar com Banco de dados', error);
      } finally {
        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [ip, lojas, filtros.medida]);
  



  const formatarNumero = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
      

 const inputRef = useRef<HTMLInputElement>(null);
 const [medidaSelecionada, setMedidaSelecionada] = useState<string>(filtros.medida ?? "")
  
if (!autorizado) return null;
 return (  
   <main className="sm:ml-14 sm:w-full p-2 bg-slate-100 h-screen md:h-auto">
    <div className=" w-full h-auto flex items-center flex-row mt-14 sm:mt-2">
          <div className='w-full h-auto flex items-left flex-col '>
            <h1 className=" w-auto h-auto text-2xl pl-3 pt-2">Consultar Produtos</h1>           
          </div>         
   </div>

        <section className="sm:w-140">
          <Card className='bg-slate-150 shadow-none border-0'>
                  <CardHeader className="mb-0">
                    <div className="flex items-center justify-center">
                      <CardTitle className="text-lg font-normal text-gray-600">                        
                        Loja: {filtros.lojaCidade}<br></br>
                        Medida: {filtros.medida}
                      </CardTitle>
                      <Box className="ml-auto w-6 h-6"></Box>
                    </div>
                    <CardDescription >
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-2 pt-0 bg-slate-100'>
                {loading && (
                  <p className="text-sm text-muted-foreground">
                    Carregando produtos...
                  </p>
                )}

                {!loading && info.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum produto encontrado para esta medida
                  </p>
                )}
          
                {!loading && info.length > 0 && (
                  <ul className="space-y-3">
                    {info.map((produto) => (
                      <Dialog key={`${produto.loja}-${produto.codigo}`}>
                        <DialogTrigger asChild>
                          <li
                            className="border rounded-md p-3 bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition"
                          >

                              <div className=" text-[16px] font-semibold">{produto.codigo} - {produto.nome}</div>
                              <div className="flex justify-between items-start">
                                <div>                          
                                                        

                                  <div className={`text-[16px] ${
                                      produto.saldo > 0
                                        ? "text-blue-700"
                                        : "text-red-500"
                                    }`}
                                  >
                                    Saldo: {produto.saldo}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="font-bold text-green-600">
                                    R$ {formatarNumero(produto.precoVenda)}
                                  </p>

                                  
                                </div>
                              </div>
                            </li>                            
                            </DialogTrigger>

                                <DialogContent className="w-full [&>button]:hidden">
                                  <DialogHeader>
                                    <DialogTitle className='h-10 bg-black text-yellow-400 flex items-center justify-center rounded-lg'>Detalhes do Produto</DialogTitle>
                                  </DialogHeader>

                                  <div className="space-y-2 text-lg">
                                    <p><strong>Código:</strong> {produto.codigo}</p>
                                    <p><strong>Nome:</strong> {produto.nome}</p>
                                    <p><strong>Referencia:</strong> {produto.referencia}</p>
                                    <p><strong>Saldo:</strong> {produto.saldo}</p>
                                    <div className='flex justify-start'>
                                        <div className='w-40 h-auto'>
                                            <p><strong>Preço Compra:</strong></p>
                                            <p><strong>Preço Custo:</strong></p>
                                        </div>
                                        <div className='w-40 h-auto'>
                                          <p>R$ {formatarNumero(produto.precoCompra)}</p>
                                          <p>R$ {formatarNumero(produto.precoCusto)}</p>
                                        </div>
                                    </div>   
                                    <div className='w-full h-auto font-semibold  flex items-center 
                                      justify-center text-green-600 mt-3 mb-5'>
                                      Preço de Venda: R$ {formatarNumero(produto.precoVenda)}
                                      </div> 

                                      <hr></hr>                                                                

                                    <div className='w-full h-auto  flex flex-col items-start justify-center'>                                      
                                      <div className='font-semibold '>Preço Recalculado:</div>
                                      <div className='text-[15px]'>((Preço de Compra + 13%) + 40%) + 12% = 
                                        <div className='text-lg'>R$ {formatarNumero(((produto.precoCompra * 1.13) * 1.40) * 1.12)}</div>
                                      </div>
                                      
                                      
                                    </div>
                                  

                                    {/* adiciona tudo que existir no objeto */}
                                    {/* ex: */}
                                    {/* <p><strong>Marca:</strong> {produto.marca}</p> */}
                                  </div>
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