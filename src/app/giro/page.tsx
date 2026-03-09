"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat2, TableColumnsSplit} from "lucide-react";
import { useFiltro } from "@/components/contexts/FiltroContext";
import { useEffect, useState } from "react";
import { GiroSet } from "@/components/buscadores";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation"; 


export default function Giro() {  

  //COMEÇAR COMO PADRAO SEMPRE QUE CARREGAR A PAGINA
   const { filtros, setFiltros } = useFiltro();
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
        periodo: filtros.periodo,
        medida: "Todas",
        pagina: "Giro",
      }));
    }, []);

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
          comportamento: 2,
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


  const [giroDados, setGiroDados] = useState<GiroSet[]>([]) 
  useEffect(() => {
  if (!ip || !filtros.medida) return;

  setLoading(true);
  const baseUrl = getApiBaseUrl(ip);

  const timer = setTimeout(() => { 

    async function Read() {
      try {
        setLoading(true);
        const baseUrl = getApiBaseUrl(ip);
        const response = await fetch(`${baseUrl}/Giro`);
        const data = await response.json();
        setGiroDados(data);
        console.log("Giro:", data);
      } catch (error) {
        console.error("Erro ao conectar com o banco", error);
      } finally {
        setLoading(false);
      }
    }

      Promise.all([Read()]).finally(() => {
      setLoading(false)
    })
  }, 3000)

  return () => clearTimeout(timer)
}, [filtros, ip])


        const formatarNumero = (valor: number): string =>
        new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(valor);

        const totalGiro = giroDados.reduce(
          (acc, item) => acc + item.giro,
          0
        )

        const totalValor = giroDados.reduce(
          (acc, item) => acc + item.valor,
          0
        )

 if (autorizado !== true) {
    return null;
      }
 return (
   <main className="sm:ml-14 p-2 bg-slate-100 h-screen md:h-auto">
    <div className=" w-full h-auto flex items-center flex-row mb-4 mt-14 sm:mt-2">
      <div className='w-full h-auto flex items-center flex-row gap-4'>
        <h1 className=" w-auto h-auto text-2xl pl-3 pt-2">Giro de Pneus</h1> 
      </div>
    </div>
    <section className="sm:w-130">
      <Card>
        <CardHeader className="">
          <div className="flex items-center justify-center">
            <CardTitle className="text-lg sm:text-2xl">
              
              Medida: {filtros.medida}
            </CardTitle>
            <Repeat2 className="ml-auto w-6 h-6"></Repeat2>
          </div>
          <CardDescription>Ordenado por giro de pneus</CardDescription>
        </CardHeader>
        <CardContent className="">
        <Table>
            <TableCaption></TableCaption>
            <TableHeader>
                <TableRow className="font-bold text-[18px]">
                <TableHead >Medida</TableHead>
                <TableHead>Qtd.Giro</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
          {loading ? (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <div className="h-5 w-full mb-2 bg-gray-300 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      giroDados.slice(0, 499).map((item) => (
                        <TableRow key={item.medida} className="text-lg">
                          <TableCell className="w-60 text-left">{item.medida}</TableCell>
                          <TableCell className="w-20 text-center ">{item.giro.toLocaleString()}</TableCell>
                          <TableCell className="w-30 text-right">{item.valor.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
          </TableBody>
             <TableFooter>
                <TableRow className="font-bold text-lg">
                  <TableCell colSpan={1}> Totais</TableCell>
                  <TableCell className="text-center">
                    {loading ? (
                      <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
                    ) : (
                      <>{totalGiro}</>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {loading ? (
                      <div className="h-4 w-32 bg-gray-300 rounded animate-pulse ml-auto" />
                    ) : (
                      <>{totalValor.toLocaleString("pt-BR")}</>
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
