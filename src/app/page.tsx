"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFiltro } from "@/components/contexts/FiltroContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Splash() {
  const { setFiltros } = useFiltro();
  const router = useRouter();

  const [id, setId] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [ip, setIp] = useState("");

  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [dots, setDots] = useState("");
  const [empresaValida, setEmpresaValida] = useState<boolean | null>(null);
  const [licencaVencida, setLicencaVencida] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [iniciarApp, setIniciarApp] = useState(false);
  const { filtros } = useFiltro();
  const isSplash = filtros.pagina === "Intro";

  useEffect(() => {
  const timer = setTimeout(() => {
    setIniciarApp(true);
  }, 3000);

  return () => clearTimeout(timer);
}, []);

  // 🔹 Define página atual
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      pagina: "Intro",
    }));
  }, []);

  // 🔵 Animação dos pontinhos
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Busca IP externo
  useEffect(() => {
  if (!iniciarApp) return;

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
}, [iniciarApp]);

  // 🔹 URL base da API
 // function getApiBaseUrl(ip: string) {
  //  if (ip.startsWith("177.54.239.199")) {
   //   return "http://10.1.1.135:4143/api/SqlApp";
   // }
   // return "http://177.54.239.199:4143/api/SqlApp";
  //}

  function getApiBaseUrl() {
  return "/api/SqlApp";
}

  // 🔹 Valida empresa salva automaticamente
  async function validarEmpresaSalva() {
    const empresaId = localStorage.getItem("empresaId");
    const empresaCnpj = localStorage.getItem("empresaCnpj");
    

    if (!empresaId || !empresaCnpj) {
      setEmpresaValida(false);
      return;
    }

    //const baseUrl = getApiBaseUrl(ip);
    const baseUrl = getApiBaseUrl();

    try {
      const response = await fetch(
        `${baseUrl}/ConfirmarEmpresa?id=${empresaId}&cnpj=${empresaCnpj}`
      );

      if (!response.ok) {
        setMensagemErro("Erro ao conectar com servidor.");
        setEmpresaValida(false);
        return;
      }

      const dados = await response.json();
      const empresa = dados[0];

      // 🔎 Verifica validade APÓS receber dados da API
      const dataValidade = new Date(empresa.validade);
      const agora = new Date();

      if (dataValidade < agora) {
        const dataFormatada = dataValidade.toLocaleString("pt-BR");
        setLicencaVencida(true);
        setMensagemErro(`Sua licença expirou em ${dataFormatada}`);
        setEmpresaValida(false);
        return;
      }

      // ✅ Licença válida
      setEmpresaValida(true);
      setFiltros((prev) => ({
        ...prev,
        dev: "start",
      }));

      localStorage.setItem("empresa", JSON.stringify(empresa));

    } catch (error) {
      console.error(error);
      setMensagemErro("Erro ao conectar com servidor.");
      setEmpresaValida(false);
    }
  }

  // 🔹 Executa validação automática assim que IP estiver carregado
  //useEffect(() => {
  //  if (ip) validarEmpresaSalva();
  //}, [ip]);

  useEffect(() => {
  validarEmpresaSalva();
  }, []);

  // 🔹 Redireciona automático se empresa válida
  useEffect(() => {
    if (empresaValida) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 4500);
      const redirectTimer = setTimeout(() => router.push("/main"), 5500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [empresaValida, router]);

  // 🔹 Valida empresa ao clicar no botão
  async function validarEmpresa() {
    if (!id || !cnpj) {
      alert("Informe o código DEV da empresa e o CNPJ");
      return;
    }

    try {
      setLoading(true);
      setMensagemErro("");

     // const baseUrl = getApiBaseUrl(ip);
     const baseUrl = getApiBaseUrl();

      const cnpjNumeros = cnpj.replace(/\D/g, "");
      const idNumeros = id.replace(/\D/g, ""); // caso queira limpar o id também

      const response = await fetch(
        `${baseUrl}/ConfirmarEmpresa?id=${idNumeros}&cnpj=${cnpjNumeros}`
      );

      if (response.status === 404) {
        setMensagemErro("Empresa não cadastrada.");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro na API");
      }

      const dados = await response.json();
      const empresa = dados[0];

      // 🔎 Verifica validade antes de continuar
      const dataValidade = new Date(empresa.validade);
      const agora = new Date();
      if (dataValidade < agora) {
        setLicencaVencida(true);
        setMensagemErro("Licença expirou");
        return;
      }

      // 🪟 Mostra confirm com dados da empresa
      const confirmar = window.confirm(
        `Confirme os dados da empresa:\n\n` +
        `Nome: ${empresa.razao}\n` +
        `CNPJ: ${empresa.cnpj}\n` +
        `Validade: ${dataValidade.toLocaleString("pt-BR")}\n\n` +
        `Deseja continuar?`
      );

      if (!confirmar) return;

      // ✅ Salva dados
      localStorage.setItem("empresaId", id);
      localStorage.setItem("empresaCnpj", cnpj.replace(/\D/g, ""));
      localStorage.setItem("empresa", JSON.stringify(empresa));

      router.push("/main");

    } catch (error) {
      console.error(error);
      setMensagemErro("Erro ao conectar com servidor.");
    } finally {
      setLoading(false);
    }
  }

  function formatCNPJ(value: string) {
  let v = value.replace(/\D/g, ""); // remove tudo que não é número

  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");

  return v.slice(0, 18); // limita a 18 caracteres
  
}

  return (
    <main className="bg-black h-dvh flex items-center justify-center overflow-hidden">
    <div
      className="w-full h-full flex flex-col justify-center items-center px-6"
      style={{
        color: "white",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.9s ease",
      }}
    >

        <div
          className="w-40 mb-6 h-16  bg-[url('/REDWAREMOB.png')]
          bg-contain bg-center bg-no-repeat"
        ></div>

        {/* ✅ Se empresa já existe e é válida */}
        {empresaValida && (
        <div className="mt-12 flex flex-col gap-3 items-center w-60">
          <p></p>

          <div className="h-1 w-2/3 rounded bg-gray-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
          </div>
        </div>
        )}

        {/* ❌ Se não existe empresa ou licença expirada */}
        {empresaValida === false && (
          <div className="mt-0 w-50 max-w-xs flex flex-col gap-4">
            <Input
              placeholder="Código Dev"
              value={id}
              onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
            />
            <Input
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
            />
            <Button className="bg-red-700" type="button" onClick={validarEmpresa}>
              Continuar
            </Button>

            {/* 🔴 Mensagem só após verificação com API */}
            {mensagemErro && (              
              <div >
              <p className="text-red-500 text-sm text-center">{mensagemErro}</p><br /> 
              <a
                href="https://wa.me/5598981897562?text=Olá,%20preciso%20de%20suporte."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-8 text-white bg-green-700 text-sm rounded-3xl p-1 gap-2 flex flex-row justify-center items-center"
              >
                <span>Suporte</span>           
              <div className="w-6 h-6 bg-[url('/whats.png')] bg-contain bg-center bg-no-repeat"></div>                
              </a>        

              <p className="text-sm text-center hidden">Toque para renovação.</p>
              </div>              
            )}
          </div>
        )}
    
            <p className="fixed bottom-0 left-0 w-full text-center font-light text-xs tracking-wide text-gray-200 pb-5 opacity-70">
               ©2026 Redware Informática. <br /> Todos os direitos reservados.</p>

      </div>
      
    </main>
  );
}