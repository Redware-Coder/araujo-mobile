export interface DadosMobile {
  venda: string;
  recebido: string;
  areceber: string;
  dtAtualizacao: string;
}

export interface Props{
  pneu: string;
  servico: string;
  outros: string;
  qtdPneu: string;
  areceberFinanceiro: number;
  apagarFinanceiro: number;
  boletovencido: number;
}

export interface Lojas{
  loja: string;
  nome: string;
  produto: number;
  servico: number;
  total: number;
  dtAtualizacao: string;
}

export interface ContasSet{
  loja: string;
  nomeLoja: string;
  areceber: number;
  apagar: number;
  saldo: number;
}

export interface Com{
  comportamento: string;
  loja: string;
  periodo: string;
  mes: string;
  ano: string;
  dataini: string;
  datafin: string;
  pagina: string;  
}

export interface MedidasSet{
  Medida: string;
}

export interface GiroSet{
  medida: string;
  giro: number;
  valor: number;
}

export interface ProdutosSet{
  loja: string;
  codigo: number;
  nome: string;
  precoCompra: number;
  precoCusto: number;
  precoVenda: number;
  referencia: string;
  saldo: number;
}

export interface EstoqueSet{
  codigo: number;
  loja: string;
  saldo: number;
  valor: number;
}

export interface BoletosVencidosSet{
  loja: string;
  codCliente: number;
  nome: string;
  titulo: string;
  parcela: string;
  emissao: string;
  vencimento: string;
  valor: number;
}

export interface BalanceteSet{
  faturamento: number;
  vendaProd: number;
  custoMateria: number;
  lucroBruto: number;
  vendaServ: number;
  receitaFixa: number;
  boniEntrada: number;
  totalReceitas: number;
  despesasFixas: number;
  despesasVariaveis: number;
  totalDespesas: number;
  boletosAtraso: number;
  boniSaida: number;
  tAvarias: number;
  tComodatos: number;
  tDescFin: number;
  tPerdido: number;
  tOutros: number;
  descontoC: number;
  lucroBrutoGeral: number;
  investimentos: number;
  lucroLiquido: number;
}

export interface ComprasSet{
  loja: string;
  fornecedor: number;
  nome: string;
  nf: number;
  entrada: string;
  vnota: number;
}

export interface NFProdutoSet{
  loja: string;
  nf: number;
  codProd: number;
  qtde: number;
  nome: string;
  precoCompra: number;
  precoCusto: number;
  precoVenda: number;
  ipi: number;
  st: number;
}

export interface EmpresaSet{
   id: number;
   tipo: number;
   razao: string;
   fantasia: string;
   cnpj: number;
   ie: number;
   responsavel: string;
   endereco: string;
   bairro: string;
   cidade: string;
   cep: string;
   fon1: number;
   fon2: number;
   whatsapp: number;
   email: string;
   chave: string;
   validade: string;
   criadoEm: string;
   atualizado: string;   
}
