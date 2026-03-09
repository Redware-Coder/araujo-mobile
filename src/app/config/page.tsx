"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { EmpresaSet } from "@/components/buscadores"
import { Filtro } from "@/components/Filtro"
import { useFiltro } from "@/components/contexts/FiltroContext"
import { useRouter } from "next/navigation";


const onlyNumbers = /^[0-9]+$/
const onlyLetters = /^[A-Za-zÀ-ÿ\s]+$/
const cepRegex = /^[0-9]{5}-?[0-9]{3}$/

// 🔹 Remove tudo que não for número
const onlyDigits = (value: string) => value.replace(/\D/g, "")

// 🔹 Formata telefone fixo ou celular automaticamente
const formatPhone = (value: string) => {
  const digits = onlyDigits(value)

  if (digits.length <= 10) {
    // Fixo (10 dígitos)
    return digits
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14)
  } else {
    // Celular (11 dígitos)
    return digits
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15)
  }
}

const formSchema = z.object({
  id: z.any().optional().or(z.literal("")),
  tipo: z.any().optional().or(z.literal("")),
  razao: z.string().min(1, "Obrigatório"),
  fantasia: z.string().min(1, "Obrigatório"),
  cnpj: z.string().min(14, "Obrigatório"),
  ie: z.string().optional().or(z.literal("")),
  responsavel: z.string().optional().or(z.literal("")),
  endereco: z.string().min(1, "Obrigatório"),
  bairro: z.string().min(1, "Obrigatório"),
  cidade: z.string().min(1, "Obrigatório"),
  cep: z.string().regex(cepRegex, "Formato inválido (00000-000)"),
  fon1: z.string().min(14, "Telefone inválido"),
  fon2: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido"),
  chave: z.string().optional().or(z.literal("")),
  validade: z.string().optional().or(z.literal("")),
})

export default function CadastroEmpresaPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      tipo: "",
      razao: "",
      fantasia: "",
      cnpj: "",
      ie: "",
      responsavel: "",
      endereco: "",
      bairro: "",
      cidade: "",
      cep: "",
      fon1: "",
      fon2: "",
      whatsapp: "",
      email: "",
      chave: "",
      validade: "",
    },
  })

  useEffect(() => {
  const savedData = localStorage.getItem("empresa2");
  if (savedData) {
    form.reset(JSON.parse(savedData));
  }
}, [form]);

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

const baseUrl = getApiBaseUrl(ip);
const [loading, setLoading] = useState(false)
const [info, setInfo] = useState<EmpresaSet[]>([]) 

async function onSubmit(values: any) {
  const dataToSend = {
    ...values,
    id: values.id ? Number(values.id) : 0,
    cnpj: onlyDigits(values.cnpj),
    fon1: onlyDigits(values.fon1),
    fon2: values.fon2 ? onlyDigits(values.fon2) : "",
    whatsapp: values.whatsapp ? onlyDigits(values.whatsapp) : "",
  };

  localStorage.setItem("empresa", JSON.stringify(dataToSend));

  const baseUrl = getApiBaseUrl(ip);

    try {
        setLoading(true);

        await fetch(`${baseUrl}/UpEmpresa`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        });

    //localStorage.setItem("empresaId", result.id);
    //form.setValue("id", result.id.toString());

    alert(values.id ? "Empresa atualizada com sucesso!" : "Empresa criada com sucesso!");

  } catch (error) {
    console.error("Erro ao salvar empresa:", error);
  } finally {
    setLoading(false);
  }
}

function formatCNPJ(value: string) {
  if (!value) return "";
  // Remove tudo que não é número
  value = value.replace(/\D/g, "");
  return value.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

function formatDateBR(value: string) {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

//PUXAR DADOS DA EMPRESA
useEffect(() => {
  async function carregarEmpresaSalva() {
    const idSalvo = localStorage.getItem("empresaId");
    const cnpjSalvo = localStorage.getItem("empresaCnpj"); // ✅ pega o CNPJ salvo

    // 1️⃣ Se não tiver ID nem CNPJ → não faz nada
    if (!idSalvo && !cnpjSalvo) {
      console.log("Nenhuma empresa salva no celular");
      return;
    }

    console.log("Empresa encontrada no celular:", { idSalvo, cnpjSalvo });

    try {
      setLoading(true);

      const baseUrl = getApiBaseUrl(ip);

      // 2️⃣ Monta URL incluindo ID e/ou CNPJ
      const url = new URL(`${baseUrl}/EmpresaDados`);
      if (idSalvo) url.searchParams.append("id", idSalvo);
      if (cnpjSalvo) url.searchParams.append("cnpj", cnpjSalvo);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Erro ao buscar empresa");
      }

      const dados = await response.json();

        // 🔥 Se for array, pega o primeiro registro
        const empresa = Array.isArray(dados) ? dados[0] : dados;

        if (!empresa) return;

        form.reset({
        id: empresa.id?.toString() || "",
        tipo: empresa.tipo?.toString() || "",
        razao: empresa.razao || "",
        fantasia: empresa.fantasia || "",
        cnpj: formatCNPJ(empresa.cnpj?.toString() || ""),
        ie: empresa.ie?.toString() || "",
        responsavel: empresa.responsavel || "",
        endereco: empresa.endereco || "",
        bairro: empresa.bairro || "",
        cidade: empresa.cidade || "",
        cep: empresa.cep || "",
        fon1: formatPhone(empresa.fon1?.toString() || ""),
        fon2: formatPhone(empresa.fon2?.toString() || ""),
        whatsapp: formatPhone(empresa.whatsapp?.toString() || ""),
        email: empresa.email || "",
        chave: empresa.chave || "",
        validade: formatDateBR(empresa.validade),
        });

    } catch (error) {
      console.error("Erro ao carregar empresa:", error);
    } finally {
      setLoading(false);
    }
  }

  if (ip) {
    carregarEmpresaSalva();
  }

}, [ip]);

const [temEmpresaSalva, setTemEmpresaSalva] = useState<boolean | null>(null);
useEffect(() => {
  const idSalvo = localStorage.getItem("empresaId");

  if (idSalvo) {
    setTemEmpresaSalva(true);
  } else {
    setTemEmpresaSalva(false);
  }
}, []);


  // Função que será chamada ao clicar no botão
  const handleClick = () => {
    const idSalvo = localStorage.getItem("empresaId");
    const cnpjSalvo = localStorage.getItem("empresaCnpj");

    if (!idSalvo && !cnpjSalvo) {
      window.alert("Nenhuma empresa salva no celular");
      return;
    }

    // Mostra os valores em um window.confirm
    const mensagem = `Empresa salva:\nID: ${idSalvo || "Não definido"}\nCNPJ: ${cnpjSalvo || "Não definido"}`;
    window.confirm(mensagem);
}

const router = useRouter();
const { filtros, setFiltros } = useFiltro();  
  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-4xl text-2xl pl-3 sm:mt-0 mt-14 pt-9">
        <CardHeader>
          <CardTitle className="w-full h-auto flex flex-col items-center">Dados da Empresa</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
            <CardContent>
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >

      {/* ================= DADOS GERAIS ================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          Dados Gerais
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* ID + TIPO */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
               <FormItem>
                <FormLabel>Código da Empresa</FormLabel>
                <FormControl>
                    <Input
                    {...field}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                    <Input
                    {...field}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* RAZÃO */}
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="razao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* FANTASIA */}
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="fantasia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CNPJ + IE */}
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição Estadual</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* RESPONSÁVEL */}
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </div>
      </div>

      {/* ================= ENDEREÇO ================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          Endereço
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </div>
      </div>

      {/* ================= CONTATO ================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          Contato
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* FON1 + FON2 */}
          <FormField
            control={form.control}
            name="fon1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone 1</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatPhone(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fon2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone 2</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatPhone(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:col-span-2">
            <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatPhone(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="validade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade</FormLabel>
                  <FormControl>
                    <Input
                    {...field}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    />
                </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </div>
      </div>

    <div className="grid grid-cols-[80%_19%] gap-1">
      {/* BOTÃO */}
        <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Dados"}
        </Button>
            <button className="hidden" onClick={handleClick}>
                Mostrar empresa salva
                </button>

        <Button className=""
            type="button"
            variant="destructive"
            onClick={() => {
                const confirmar = window.confirm(
                    "Tem certeza que deseja remover a empresa deste aparelho?"
                );

                if (!confirmar) return;

                localStorage.removeItem("empresaId");
                localStorage.removeItem("empresa");

                setTemEmpresaSalva(false);

                form.reset({
                    id: "",
                    tipo: "",
                    razao: "",
                    fantasia: "",
                    cnpj: "",
                    ie: "",
                    responsavel: "",
                    endereco: "",
                    bairro: "",
                    cidade: "",
                    cep: "",
                    fon1: "",
                    fon2: "",
                    whatsapp: "",
                    email: "",
                    chave: "",
                    validade: "",                    
                });
                filtros.dev = ""
                alert("Empresa removida com sucesso!");
                router.push("/"); // redireciona para page.tsx
                }}
    >X
        </Button>
    </div>
        </form>
    </Form>
</CardContent>
        </CardContent>
      </Card>
    </div>
  )
}