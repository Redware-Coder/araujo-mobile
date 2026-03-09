"use client"
import { createContext, useContext, useState } from "react"

type FiltroState = {
  comp: string
  lojaCidade: string
  loja: string
  periodo: string
  ano: string
  mes: string
  dataInicial: Date | null
  dataFinal: Date | null  
  pagina: string
  medida: string
  nf: string
  for: string
  dev: string
}

type FiltroContextType = {
  filtros: FiltroState
  setFiltros: React.Dispatch<React.SetStateAction<FiltroState>>
}

const FiltroContext = createContext<FiltroContextType | null>(null)

const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" }).replace(/^./, (letra) => letra.toUpperCase())

export function FiltroProvider({ children }: { children: React.ReactNode }) {
  const [filtros, setFiltros] = useState<FiltroState>({
    comp: "1",
    lojaCidade: "Todas",
    loja: "",
    periodo: mesAtual,
    ano: "",
    mes: "",
    dataInicial: new Date(),
    dataFinal: new Date(),
    pagina: "",
    medida: "Todas",
    nf: "",
    for: "",
    dev: ""
    
  })

  return (
    <FiltroContext.Provider value={{ filtros, setFiltros }}>
      {children}
    </FiltroContext.Provider>
  )
}

export function useFiltro() {
  const context = useContext(FiltroContext)
  if (!context) {
    throw new Error("useFiltro must be used within FiltroProvider")
  }
  return context
}