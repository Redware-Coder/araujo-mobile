"use client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Package, Home, BoxIcon, LayoutDashboard, Menu, Funnel, Repeat2, BanknoteArrowUp, UserRound, SquareKanban, Box, Factory, Scale, ShoppingCart, ServerCog, Settings } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react"
import { Filtro } from "../Filtro";
import { useFiltro } from "../contexts/FiltroContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export function Sidebar() {
  

  const [lojaSelecionada, setLojaSelecionada] = useState<string>("")
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>("")
  const [openFiltro, setOpenFiltro] = useState(false)
  const { filtros, setFiltros } = useFiltro()

  const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) return null


  const lojaCidade = [
    "Todas as Lojas", "Tocantins", "Pará", "Araguaína", "Matriz & T. de A",
    "Matriz", "Michelin-TO", "T. de A", "Novo Repartimento", "Palmas",
    "Parauapebas", "Canaã", "Michelin-PA", "Borracharia",
    "Augustinópolis", "Paraíso", "Xinguara"
  ]

  const periodo = [
    "Hoje", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro",
    "Novembro", "Dezembro"
  ]

  
 
 return (
  
   <div className="flex w-full flex-col top-0">
    {mounted && filtros.pagina !== "Intro" && (
    <aside className="fixed inset-y-0 left-0 z-10 hidden lg:w-auto lg:items-start border-r bg-black lg:flex flex-col">
      <div className="hidden lg:block w-full pl-6 h-38 pt-4 bg-[url('/wall_1.jpg')] bg-cover bg-center items-center justify-center">
        <div className="w-36 h-28 bg-[url('/LogoFHD-BRANCO_SOMBRA.png')] bg-contain bg-center bg-no-repeat"></div>
      </div>
      <nav className="font-light flex flex-col items-center lg:items-start gap-4 px-2 lg:px-5 py-5 pt-20 lg:pt-2">      

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/main" className="flex w-auto h-9 shrink-0 items-center justify-center
                rounded-lg text-white transition-colors hover:text-amber-400">                  
                    <LayoutDashboard className="w-6 h-6"/>
                    <p className="ml-2 hidden lg:block">Dashboard</p>
              </Link> 
            </TooltipTrigger>
          </Tooltip>
          

           <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/consultaProd" className="flex w-auto h-9 shrink-0 items-center justify-center 
                rounded-lg text-white transition-colors hover:text-amber-400" 
                onClick={() => setFiltros({...filtros, pagina: "Produtos"})}>
                <Box className="w-6 h-6"/>
                <p className="ml-2 hidden lg:block">Consultar Produtos</p>
                
              </Link> 
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/estoque" className="flex w-auto h-9 shrink-0 items-center justify-center 
                rounded-lg text-white transition-colors hover:text-amber-400" 
                onClick={() => setFiltros({...filtros, pagina: "Estoque"})}>
                <Factory className="w-6 h-6"/>
                <p className="ml-2 hidden lg:block">Estoque</p>
              </Link> 
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/compras" className="flex w-auto h-9 shrink-0 items-center justify-center 
                rounded-lg text-white transition-colors hover:text-amber-400" 
                onClick={() => setFiltros({...filtros, pagina: "Compras"})}>
                <ShoppingCart className="w-6 h-6"/>
                <p className="ml-2 hidden lg:block">Compras</p>
              </Link> 
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/giro" className="flex w-auto h-9 shrink-0 items-center justify-center 
                rounded-lg text-white transition-colors hover:text-amber-400" 
                onClick={() => setFiltros({...filtros, pagina: "Estoque"})}>
                <Repeat2 className="w-6 h-6"/>
                <p className="ml-2 hidden lg:block">Giro de Pneus</p>
              </Link> 
            </TooltipTrigger>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/balancete" className="flex w-auto h-9 shrink-0 items-center justify-center 
                rounded-lg text-white transition-colors hover:text-amber-400" 
                onClick={() => setFiltros({...filtros, pagina: "Estoque"})}>
                <Scale className="w-6 h-6"/>
                <p className="ml-2 hidden lg:block">DRE - Balantece</p>
              </Link> 
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/boletosVencidos" className="flex w-auto h-9 shrink-0 items-center justify-center 
                rounded-lg text-white transition-colors hover:text-amber-400" 
                onClick={() => setFiltros({...filtros, pagina: "Estoque"})}>
                <SquareKanban className="w-6 h-6"/>
                <p className="ml-2 hidden lg:block">Boletos em atraso</p>
              </Link> 
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/contas" className="flex w-auto h-9 shrink-0 items-center justify-center 
                rounded-lg text-white transition-colors hover:text-amber-400" 
                onClick={() => setFiltros({...filtros, pagina: "Estoque"})}>
                <BanknoteArrowUp className="w-6 h-6"/>
                 <p className="ml-2 hidden lg:block">Contas</p>
              </Link> 
            </TooltipTrigger>
          </Tooltip>

        </TooltipProvider>        
      </nav>
    </aside>)}
    
    {mounted && filtros.pagina !== "Intro" && (
    <div className="lg:hidden flex flex-col sm:gap-4 sm:py-4 lg:pl-14">
      <header className="fixed bg-black w-full top-0 z-30 flex h-14 items-center px-4 gap-4 
       lg:static lg:h-auto lg:border-0 lg:bg-transparent sm:px-6">
        <Sheet>
          <div className="w-full flex flex-row items-center justify-between">
              <SheetTrigger asChild>
                <Menu className="w-10 h-6 pr-4 transition-all text-yellow-400 "/>
              </SheetTrigger>
              <div className=" w-28 h-10 mt-2 ml-28 bg-contain bg-center bg-no-repeat bg-[url('/LogoFHD-BRANCO.png')]"></div>
              <span className="sr-only">Logo</span>  
              <div className="w-36 sm:w-42 flex flex-row pr-2 text-white items-center justify-end">
                <div className="w-26">
                  {filtros.pagina !== "teste" && (
                    <div  style={{textAlign: 'right', fontSize: '11px',  }}>Loja: {filtros.lojaCidade}
                    </div>)}
                  
                  {(filtros.pagina !== "Produtos" && filtros.pagina !== "Estoque") && (
                    <div  style={{textAlign: 'right', fontSize: '11px',  }}>               
                     Período: {filtros.periodo}</div>
                    )}

                   
                </div>
                  <>
                    {openFiltro && (
                      <div className="fixed inset-0 bg-black/70 z-40" />
                    )}

                    <Dialog
                      modal={false}
                      open={openFiltro}
                      onOpenChange={setOpenFiltro}
                    >
                      <DialogTrigger asChild>
                        <Funnel className="w-12 h-6 pl-3 transition-all text-yellow-400 cursor-pointer" />
                      </DialogTrigger>

                      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}
                        className="w-auto h-auto border-0 overflow-visible z-50 [&>button]:hidden"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-lg" >Filtro de Buscas
                          </DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                      
                        <Filtro fecharPopover={() => setOpenFiltro(false)} />
                      </DialogContent>
                    </Dialog>
                  </></div>
              </div>

          <SheetContent side="left" className="sm:max-w-x [&>button]:hidden">
            <div className="w-full h-38 flex pt-4 bg-[url('/wall_1.jpg')] bg-cover bg-center items-center justify-center">
              <div className="w-44 h-28 bg-[url('/LogoFHD-BRANCO_SOMBRA.png')] bg-contain bg-center bg-no-repeat">
              </div>
            </div>
            <nav className="grid gap-3.5 text-lg  pl-5 pr-3  text-foreground">
              <Link 
                href="#"
                className=" w-10 h-10 bg-primary rounded-full text-lg gap-2
                items-center justify-center text-primary-foreground md:text-base hidden"              
              >
              <Package className="w-5 h-5 transition-all"/> 
              <span className="sr-only">Logo</span>
              </Link>              

              <SheetClose asChild>
                <Link 
                  href="/main"
                  className="flex items-center gap-4  px-2.5 foreground hover:text-foreground"              
                  prefetch={false}
                  onClick={() => setFiltros({...filtros, pagina: "Dashboard"})}
                >
                <LayoutDashboard className="w-5 h-5 transition-all"/>Dashboard
                </Link>
              </SheetClose>

              <SheetClose asChild>
              <Link 
                href="/consultaProd"
                className="flex items-center gap-4 px-2.5 "              
                prefetch={false}
                onClick={() => setFiltros({...filtros, pagina: "Produtos"})}
              >
              <BoxIcon className="w-5 h-5 transition-all"/>Consultar Produtos
              </Link>
              </SheetClose>

              <SheetClose asChild>
              <Link 
                href="/estoque"
                className="flex items-center gap-4  px-2.5 "              
                prefetch={false}
                onClick={() => setFiltros({...filtros, pagina: "Estoque"})}
              >
              <Home className="w-5 h-5 transition-all"/>Estoque
              </Link>
              </SheetClose>

            <hr></hr>

            <h1>Análise</h1>  
             <SheetClose asChild>
              <Link 
                href="#"
                className="flex items-center gap-4  px-2.5 "              
                prefetch={false}
                onClick={() => setFiltros({...filtros, pagina: "LT4"})}
              >
              <UserRound className="w-5 h-5 transition-all"/>Clientes
              </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  href="/compras"                  
                  className="flex items-center gap-4 px-2.5 "              
                  prefetch={false}
                  onClick={() => setFiltros({...filtros, pagina: "Compras"})
                  }
                >
                <ShoppingCart className="w-5 h-5 transition-all"/>Compras
                </Link>
              </SheetClose>
               <SheetClose asChild>
                <Link 
                  href="/giro"                  
                  className="flex items-center gap-4  px-2.5 "              
                  prefetch={false}
                  onClick={() => setFiltros({...filtros, pagina: "Giro"})
                  }
                >
                <Repeat2 className="w-5 h-5 transition-all"/>Giro de Pneus
                </Link>
              </SheetClose>

              <hr></hr>

              <h1>Financeiro</h1>     
               
              <SheetClose asChild>
                <Link 
                  href="/boletosVencidos"                  
                  className="flex items-center gap-4  px-2.5 "              
                  prefetch={false}
                  onClick={() => setFiltros({...filtros, pagina: "Boletos"})
                  }
                >
                <SquareKanban className="w-5 h-5 transition-all"/>Boletos Vencidos
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  href="/balancete"                  
                  className="flex items-center gap-4  px-2.5 "              
                  prefetch={false}
                  onClick={() => setFiltros({...filtros, pagina: "Balancete"})
                  }
                >
                <Scale className="w-5 h-5 transition-all"/>DRE - Balantece
                </Link>
              </SheetClose>
              <SheetClose asChild>
               <Link 
                  href="/contas"                  
                  className="flex items-center gap-4  px-2.5 "              
                  prefetch={false}
                  onClick={() => setFiltros({...filtros, pagina: "Contas"})
                  }
                >
                <BanknoteArrowUp className="w-5 h-5 transition-all"/>Contas a Receber / Pagar
                
                </Link>
                </SheetClose>

                <hr></hr>
                <SheetClose asChild>
                <Link 
                    href="/config"                  
                    className="flex items-center gap-4  px-2.5 "              
                    prefetch={false}
                    onClick={() => setFiltros({...filtros, pagina: "Contas"})
                    }
                  >
                  <Settings className="w-5 h-5 transition-all"/>Configurações
                  
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                <Link 
                    href="https://wa.me/5598981897562?text=Olá,%20preciso%20de%20suporte."
                    target="_blank"
                    rel="noopener noreferrer"                
                    className="flex items-center gap-4  px-2.5 "              
                    prefetch={false}
                    onClick={() => setFiltros({...filtros, pagina: "Contas"})
                    }
                  >
                  <div className="w-6 h-6 bg-[url('/whats.png')] bg-contain bg-center bg-no-repeat"></div>   
                   Suporte
                  
                  </Link>
                </SheetClose>

            </nav>
          </SheetContent>
        </Sheet>

        
      </header>
    </div>
    )}
   </div>
   
 )
}