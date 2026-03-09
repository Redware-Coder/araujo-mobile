"use client";
import {  Combobox,  ComboboxContent,  ComboboxEmpty,  ComboboxInput,  ComboboxItem,  ComboboxList} from "@/components/ui/combobox";
import {  Popover,  PopoverContent,  PopoverTrigger,} from "@/components/ui/popover";
import { format, } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../ui/button";
import { MedidasSet } from "@/components/buscadores";
import { useEffect, useState } from "react";
import { useFiltro } from '@/components/contexts/FiltroContext';
import { useRef } from "react";
import { useRouter } from "next/navigation";
  

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

type FiltroProps = {
  fecharPopover: () => void
}

export function Filtro({ fecharPopover }: FiltroProps) {  

  const { filtros, setFiltros } = useFiltro()  
  const inputRef = useRef<HTMLInputElement>(null);

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

  const lojaCidade = [
    "Todas", "Tocantins", "Pará", "Araguaína",  "Matriz", "Matriz & T. de A",
    "Michelin-TO", "T. de A", "Novo Repartimento", "Palmas",
    "Parauapebas", "Canaã", "Michelin-PA", "Borracharia",
    "Augustinópolis", "Paraíso", "Xinguara"
  ]

  const loja = [
    "Matriz", "Michelin-TO", "T. de A", "Novo Repartimento", "Palmas",
    "Parauapebas", "Canaã", "Michelin-PA", "Borracharia",
    "Augustinópolis", "Paraíso", "Xinguara"
  ]

  const loja2 = [
    "Todas", "Matriz +", "Matriz", "Michelin-TO", "Rovanny", "T. de A", "Novo Repartimento", "Palmas",
    "Parauapebas", "Canaã", "Michelin-PA", "Borracharia",
    "Augustinópolis", "Paraíso", "Xinguara"
  ]

  const periodo = [
    "Hoje", "Manual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro",
    "Novembro", "Dezembro"
  ]  

  const medidasLocal = [
    "Todas","10 00 20","10 16.5","10 5 65","10 5 80 18","100 100 18","100 80 17","100 80 18","100 90 17","100 90 18","11 00 22",
"11 15","11 2 28","110 100 18","110 70 17","110 80 14","110 80 18","110 80 19","110 90 17","11L 15","12 00 20","12 00 24","12 16 5",
"12 4 24","12 4 28","12 4 36","12 4 38","12 5 80 18","12.00 20","120 70 17","120 80 18 34","120 90 17","13 00 24","13 6 38","130 70 17",
"14 00 24","14 9 13 28","14 9 24","14 9 26","14 9 28","140 70 17","15 5 5 38","15 5 80 18","155 12","16 70 20","16 9 24","16 9 28",
"16 9 30","165 40 18","165 60 14","165 70 13","165 70 14","165 80 13","17 5 25","17 5-25 16","175 13","175 55 16","175 60 13",
"175 65 14","175 65 15","175 70 13","175 70 14","175 75 13","175 75 14","175 80 14","18 4 26","18 4 30","18 4 34","18 4 38",
"180 55","185 14","185 35 17","185 35 18","185 55 15","185 55 16","185 60 14","185 60 15","185 65 14","185 65 15","185 70 13",
"185 70 14","185 R14","19 5 24","195 14","195 40 17","195 50 15","195 50 16","195 55 15","195 55 16","195 60 14","195 60 15",
"195 60 16","195 65 15","195 70 14","195 70 15","195 75 16","195 R14","195 R14C","2 50 17","2 75 17","2 75 18","2 75 21","20 1 3/4",
"20 5 25","20 8 38","20.5 25","205 40 17","205 45 17","205 45 18","205 50 17","205 55 15","205 55 16","205 55 17","205 60 15",
"205 60 16","205 65 15","205 65 16","205 70 15","205 70 16","205 75 14","205 75 16","215 14","215 35 18","215 35 19","215 45 17",
"215 45 18","215 50 17","215 55 16","215 55 17","215 55 173","215 55 18","215 60 16","215 60 17","215 65 16","215 70 15","215 70 16",
"215 75 15","215 75 16","215 75 17.5","215 80 16","215 85 16","225 30 20","225 35 19","225 35 20","225 40 18","225 40 19","225 45 17",
"225 45 17 Z","225 45 18","225 45 18 Z","225 45 19","225 50 17","225 50 18","225 55 16","225 55 17","225 55 18","225 55 19",
"225 60 17","225 60 18","225 65 16","225 65 16C","225 65 17","225 70 15","225 70 16","225 70 17","225 75 16","23 1 26","23 1 30",
"23 5 25","235 35 19","235 40 18","235 40 19","235 45 17","235 45 18","235 45 19","235 50 17","235 50 18","235 50 19","235 50 20",
"235 55 17","235 55 18","235 55 19","235 60 16","235 60 17","235 60 18","235 65 17","235 65 18","235 70 16","235 75 15","235 75 17.5",
"24 08 12","24 10 00 11","24 10 11","24 5 32","24 8 00 12","24 8 12","245 35 19","245 35 20","245 40 17","245 40 18","245 40 19",
"245 45 18","245 45 19","245 45 20","245 50 18","245 60 18","245 65 17","245 70 16","245 70 17","245 75 16","25 10 00 12","25 10 12",
"25 8 12","255 35 18","255 35 19","255 40 18","255 40 19","255 40 20","255 45 19","255 45 20","255 50 19","255 50 20","255 55 18",
"255 55 19","255 55 20","255 60 18","255 65 17","255 65 18","255 70 16","255 70 17","255 75 15","26 1 1 2 2","26 1.90","26 1.95",
"265 35 22","265 40 22","265 50 20","265 55 17","265 60 18","265 60 20","265 65 17","265 65 18","265 70 15","265 70 16","265 70 17",
"265 70 18","265 75 16","275 40 19","275 40 20","275 45 20","275 45 21","275 55 20","275 60 20","275 65 17","275 65 18","275 65 20",
"275 70 17","275 70 18","275 75 18","275 80 22.5","285 40 20","285 50 20","285 60 18","285 65 18","285 70 17","285 70 19 5",
"285 75 16","29 2 20","295 40 22","295 80 22 5","3 50 10","3.25 8","30.5 32","300 21","305 40 22","305 70 16","31 10 50 15",
"31 10.5 15","315 35 20","315 70 17","315 75 16","32 12.5 17","325 300 8","325 35 22","325 8","35 12 5 18","35 12 5 20","35 12 50",
"35 12 50 15","35 12 50 17","35 12 50 18","35 12.5 18","365 80 20","380 80 38","380 90 46","385 95 25","4 00 8","4 50 21",
"4 80 4 00 8","400 17","400 18","400 55 22.5","400 60 15.5","450 21","450 21 04","480 70 34","5 60 15","500 45 22.5","6 00 9",
"6.00 9","60 100 14","60 100 17","600 16","600 50 22 5","600 65 28","7 00 12","7 00 16","7.00 12","7.00 18","70 100 19","70 90 16",
"700 12","700 16","710 70 38","750 16","750 18","8 5 17 5","8.25 15","8.25 15 6.50","8.3 20","80 100 14","80 100 18","80 90 21",
"800 18","9 00 20","9.17-5","9.5 24","90 90 14","90 90 18","90 90 19","90 90 21","900 16","900 20"
]

const medidasLocal2 = [
    "10 00 20","10 16.5","10 5 65","10 5 80 18","100 100 18","100 80 17","100 80 18","100 90 17","100 90 18","11 00 22",
"11 15","11 2 28","110 100 18","110 70 17","110 80 14","110 80 18","110 80 19","110 90 17","11L 15","12 00 20","12 00 24","12 16 5",
"12 4 24","12 4 28","12 4 36","12 4 38","12 5 80 18","12.00 20","120 70 17","120 80 18 34","120 90 17","13 00 24","13 6 38","130 70 17",
"14 00 24","14 9 13 28","14 9 24","14 9 26","14 9 28","140 70 17","15 5 5 38","15 5 80 18","155 12","16 70 20","16 9 24","16 9 28",
"16 9 30","165 40 18","165 60 14","165 70 13","165 70 14","165 80 13","17 5 25","17 5-25 16","175 13","175 55 16","175 60 13",
"175 65 14","175 65 15","175 70 13","175 70 14","175 75 13","175 75 14","175 80 14","18 4 26","18 4 30","18 4 34","18 4 38",
"180 55","185 14","185 35 17","185 35 18","185 55 15","185 55 16","185 60 14","185 60 15","185 65 14","185 65 15","185 70 13",
"185 70 14","185 R14","19 5 24","195 14","195 40 17","195 50 15","195 50 16","195 55 15","195 55 16","195 60 14","195 60 15",
"195 60 16","195 65 15","195 70 14","195 70 15","195 75 16","195 R14","195 R14C","2 50 17","2 75 17","2 75 18","2 75 21","20 1 3/4",
"20 5 25","20 8 38","20.5 25","205 40 17","205 45 17","205 45 18","205 50 17","205 55 15","205 55 16","205 55 17","205 60 15",
"205 60 16","205 65 15","205 65 16","205 70 15","205 70 16","205 75 14","205 75 16","215 14","215 35 18","215 35 19","215 45 17",
"215 45 18","215 50 17","215 55 16","215 55 17","215 55 173","215 55 18","215 60 16","215 60 17","215 65 16","215 70 15","215 70 16",
"215 75 15","215 75 16","215 75 17.5","215 80 16","215 85 16","225 30 20","225 35 19","225 35 20","225 40 18","225 40 19","225 45 17",
"225 45 17 Z","225 45 18","225 45 18 Z","225 45 19","225 50 17","225 50 18","225 55 16","225 55 17","225 55 18","225 55 19",
"225 60 17","225 60 18","225 65 16","225 65 16C","225 65 17","225 70 15","225 70 16","225 70 17","225 75 16","23 1 26","23 1 30",
"23 5 25","235 35 19","235 40 18","235 40 19","235 45 17","235 45 18","235 45 19","235 50 17","235 50 18","235 50 19","235 50 20",
"235 55 17","235 55 18","235 55 19","235 60 16","235 60 17","235 60 18","235 65 17","235 65 18","235 70 16","235 75 15","235 75 17.5",
"24 08 12","24 10 00 11","24 10 11","24 5 32","24 8 00 12","24 8 12","245 35 19","245 35 20","245 40 17","245 40 18","245 40 19",
"245 45 18","245 45 19","245 45 20","245 50 18","245 60 18","245 65 17","245 70 16","245 70 17","245 75 16","25 10 00 12","25 10 12",
"25 8 12","255 35 18","255 35 19","255 40 18","255 40 19","255 40 20","255 45 19","255 45 20","255 50 19","255 50 20","255 55 18",
"255 55 19","255 55 20","255 60 18","255 65 17","255 65 18","255 70 16","255 70 17","255 75 15","26 1 1 2 2","26 1.90","26 1.95",
"265 35 22","265 40 22","265 50 20","265 55 17","265 60 18","265 60 20","265 65 17","265 65 18","265 70 15","265 70 16","265 70 17",
"265 70 18","265 75 16","275 40 19","275 40 20","275 45 20","275 45 21","275 55 20","275 60 20","275 65 17","275 65 18","275 65 20",
"275 70 17","275 70 18","275 75 18","275 80 22.5","285 40 20","285 50 20","285 60 18","285 65 18","285 70 17","285 70 19 5",
"285 75 16","29 2 20","295 40 22","295 80 22 5","3 50 10","3.25 8","30.5 32","300 21","305 40 22","305 70 16","31 10 50 15",
"31 10.5 15","315 35 20","315 70 17","315 75 16","32 12.5 17","325 300 8","325 35 22","325 8","35 12 5 18","35 12 5 20","35 12 50",
"35 12 50 15","35 12 50 17","35 12 50 18","35 12.5 18","365 80 20","380 80 38","380 90 46","385 95 25","4 00 8","4 50 21",
"4 80 4 00 8","400 17","400 18","400 55 22.5","400 60 15.5","450 21","450 21 04","480 70 34","5 60 15","500 45 22.5","6 00 9",
"6.00 9","60 100 14","60 100 17","600 16","600 50 22 5","600 65 28","7 00 12","7 00 16","7.00 12","7.00 18","70 100 19","70 90 16",
"700 12","700 16","710 70 38","750 16","750 18","8 5 17 5","8.25 15","8.25 15 6.50","8.3 20","80 100 14","80 100 18","80 90 21",
"800 18","9 00 20","9.17-5","9.5 24","90 90 14","90 90 18","90 90 19","90 90 21","900 16","900 20"
]

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date>(new Date())

    const [openFin, setOpenFin] = useState(false)
    const [dateFin, setDateFin] = useState<Date>(new Date())  
    
   
   const [lojaSelecionada, setLojaSelecionada] = useState(lojaCidade[0])  
   const [periodoSelecionado, setPeriodoSelecionado] = useState(periodo[0])
   const [medidaSelecionada, setMedidaSelecionada] = useState<string>(filtros.medida ?? "")
   

   //const [medidaDados, setMedidas] = useState() 
   
    useEffect(() => {
      setLojaSelecionada(filtros.lojaCidade)
      setPeriodoSelecionado(filtros.periodo)
      setDate(filtros.dataInicial ?? new Date())
      setDateFin(filtros.dataFinal ?? new Date())
      setMedidaSelecionada(filtros.medida)
      
    }, [filtros])

    const [ip, setIp] = useState("");
    
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
    
      function getApiBaseUrl(ip: string) {
      if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("127.")) {
        return "http://10.1.1.135:4143/api/SqlApp";
      }
    
      return "http://177.54.239.199:4143/api/SqlApp";
      }

    async function aplicarFiltro() {

  if (!ip) return;

  setFiltros((prev) => ({
    ...prev,
    comp: "1",
    lojaCidade: lojaSelecionada,
    periodo: periodoSelecionado,
    dataInicial: periodoSelecionado === "Manual" ? date : new Date(),
    dataFinal: periodoSelecionado === "Manual" ? dateFin : new Date(),
    medida: medidaSelecionada,
  }));

  const baseUrl = getApiBaseUrl(ip);

  const dados = {
    comportamento: 1,
    loja: lojaSelecionada,
    periodo: periodoSelecionado,
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    dataIni: date?.toISOString().split("T")[0],
    dataFin: dateFin?.toISOString().split("T")[0]
  };

  await fetch(`${baseUrl}/Comunicacao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}
    

    const [medidaDados, setMedidaDados] = useState<MedidasSet[]>([]) 
    const [loading, setLoading] = useState(false)
    
     useEffect(() => {
       if (!ip) return; // ⛔ espera o IP carregar
       setLoading(true)
       const baseUrl = getApiBaseUrl(ip);
       const timer = setTimeout(() => {
         async function ReadMedidas() {
           try {
             const response = await fetch(`${baseUrl}/Medidas`);
             const data = await response.json()
             setMedidaDados(data);      
             console.log(data);
           } catch (error) {
             console.error("Erro ao Conectar com Banco de dados")
           }         
         }
        Promise.all([ReadMedidas()]).finally(() => {
           setLoading(false)
         })

       }, 100)

       return () => clearTimeout(timer)
       }, [filtros, ip])

if (!autorizado) return null;
 
 return (
   <div className="flex text-left w-[35vh] h-auto flex-col top-0 text-black rounded-2xl px-5">
   
    
    {/** COMOBOBOX LOJAS CIDADES ESTADOS ------------------------------------------------------------- */}
     {(filtros.pagina === "Giro" || filtros.pagina === "Dashboard" || filtros.pagina === "Boletos" || filtros.pagina === "Compras") && (
            <div className='w-fit mb-6 bg'>
              <h2 className='mb-1 text-gray-700'>Selecione Loja, Cidade ou Estado:</h2>
              <Combobox
                  defaultValue={filtros.periodo}
                  items={lojaCidade}
                  value={lojaSelecionada}
                  onValueChange={(value) => {
                    if (!value) return
                    setLojaSelecionada(value)
                  }}
                >
                  <ComboboxInput readOnly autoFocus={false} />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
      </div>)}

      {/** COMOBOBOX SOMENTE LOJAS ------------------------------------------------------------- */}
      {filtros.pagina === "Produtos"  && (
            <div className='w-fit mb-6'>
              <h2 className='mt-5 mb-1 text-gray-700'>Selecione uma Loja:</h2>
              <Combobox defaultValue={"Matriz"} items={loja} value={lojaSelecionada} onValueChange={(value) => {
                    if (!value) return
                    setLojaSelecionada(value)
                  }}>
                <ComboboxInput readOnly autoFocus={false} />
                <ComboboxContent >
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                          {item}
                  </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
      </div>)}

      {/** COMOBOBOX Matriz + ------------------------------------------------------------- */}
      {filtros.pagina === "Balancete"  && (
            <div className='w-fit mb-6'>
              <h2 className='mt-5 mb-1 text-gray-700'>Selecione uma Loja:</h2>
              <Combobox defaultValue={filtros.periodo} items={loja2} value={lojaSelecionada} onValueChange={(value) => {
                    if (!value) return
                    setLojaSelecionada(value)
                  }}>
                <ComboboxInput readOnly autoFocus={false} />
                <ComboboxContent >
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                          {item}
                  </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
      </div>)}
      
      {/** COMOBOBOX TODOS OS PERIODOS ------------------------------------------------------------- */}      
      {(filtros.pagina === "Giro" || filtros.pagina === "Dashboard" || filtros.pagina === "Compras" || filtros.pagina === "Contas" || filtros.pagina === "Boletos" || filtros.pagina === "Balancete") && (
            <div className='w-fit'>
              <h2 className='mb-1 text-gray-700'>Período:</h2>
              <Combobox items={periodo} defaultValue={periodo[0]} value={periodoSelecionado} onValueChange={(value) => {
                  if (!value) return
                  setPeriodoSelecionado(value)
                }}>
                <ComboboxInput readOnly autoFocus={false} />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>)}
            {periodoSelecionado === 'Manual' && (
            <div className="w-full flex items-center justify-center flex-row gap-7">
                <div>
                    <h3 className='mt-7 mb-1 ml-1 text-gray-700'>Data Inicial</h3>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger>
                                    <Button variant="outline" id="date-picker-simple" className="justify-start font-normal">
                                        {date ? format(date, "dd/MM/yyyy") : 
                                        <span>Data Inicial</span>}
                                    </Button>
                                </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar className=""
                                        mode="single"
                                        selected={date}
                                        defaultMonth={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                        if (!date) return
                                        setDate(date)
                                        setOpen(false)
                                      }}
                                    />
                                </PopoverContent>
                            </Popover>
                </div>
                <div>
                    <h3 className='mt-7 mb-1 ml-1 text-gray-700'>Data Final</h3>
                            <Popover open={openFin} onOpenChange={setOpenFin}>
                                <PopoverTrigger>
                                    <Button variant="outline" id="date-picker-simple" className="justify-start font-normal">
                                        {dateFin ? format(dateFin, "dd/MM/yyyy") : 
                                        <span>Data Final</span>}
                                    </Button>
                                </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dateFin}
                                                defaultMonth={dateFin}
                                                captionLayout="dropdown"
                                                onSelect={(dateFin) => {
                                                if (!dateFin) return
                                                setDateFin(dateFin)
                                                setOpenFin(false)
                                              }}
                                            />
                                        </PopoverContent>
                                </Popover>
                </div>
               
            </div>
            )}

          {(filtros.pagina === "Giro" || filtros.pagina === "Estoque") && (
            <div className='w-fit mt-6'>
              <h2 className='mb-1 text-gray-700'>Medida:</h2>
              <Combobox  items={medidasLocal} value={medidaSelecionada}
                onValueChange={(value) => {
                            if (!value) return
                            setMedidaSelecionada(value); inputRef.current?.blur();}}
                            // items={medidaDados.map(m => m.Medida)} value={medidaSelecionada} 
              >
                <ComboboxInput inputMode="numeric" ref={inputRef}  onFocus={(e) => e.target.select()} />                  
                <ComboboxContent>
                  <ComboboxEmpty>Nenhuma medida encontrada</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item || ""} value={item}>
                      {item || "(Todas)"}  {/* Mostra algo amigável para a opção em branco */}
                    </ComboboxItem>
                    )}
                  </ComboboxList>                  
                </ComboboxContent>                
              </Combobox>
              <p className="text-gray-500 text-[1.4vh] mt-2">[Toque na Medida e digite apenas os 3 primeiros números]</p>

              
            </div>
          )}

          {(filtros.pagina === "Produtos") && (
            <div className='w-fit'>
              <h2 className='mb-1 text-gray-700'>Medida:</h2>
              <Combobox  items={medidasLocal} value={medidaSelecionada}
                onValueChange={(value) => {
                            if (!value) return
                            setMedidaSelecionada(value); inputRef.current?.blur();}}
                            // items={medidaDados.map(m => m.Medida)} value={medidaSelecionada} 
              >
                <ComboboxInput inputMode="numeric" ref={inputRef}  onFocus={(e) => e.target.select()} // seleciona tudo quando clicar
                   />
                <ComboboxContent>
                  <ComboboxEmpty>Nenhuma medida encontrada</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item || ""} value={item}>
                      {item || "(Todas)"}  {/* Mostra algo amigável para a opção em branco */}
                    </ComboboxItem>
                    )}
                  </ComboboxList>
                  
                </ComboboxContent>
              </Combobox>
              <p className="text-gray-500 text-[1.4vh] mt-2">[Toque na Medida e digite apenas os 3 primeiros números]</p>

              
            </div>
          )}


        <Button className="h-12 mt-10 mb-5" onClick={() => {   
            aplicarFiltro()
            fecharPopover()
          }}
        >
          Filtrar
        </Button>

    
   </div>
 )
}