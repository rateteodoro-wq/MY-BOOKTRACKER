import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/sonner";

// --- PÁGINAS CRIADAS AQUI MESMO (Para não dar erro de arquivo faltando) ---

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900 p-6 font-sans">
      <div className="max-w-xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-black">
          BookTrack Online! 🚀
        </h1>
        <p className="text-xl text-zinc-500">
          Seu sistema está no ar. O erro de importação foi resolvido.
        </p>
        
        <div className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <a href="/dashboard" className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-bold text-white transition-all bg-black rounded-lg hover:bg-zinc-800">
            Acessar Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Painel do Escritor</h1>
      <p className="mt-4">O sistema está funcionando. Agora podemos organizar os arquivos com calma.</p>
      <a href="/" className="text-blue-600 hover:underline mt-4 block">Voltar para Home</a>
    </div>
  );
}

// --- FIM DAS PÁGINAS ---

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      {/* Rota coringa para qualquer outra página */}
      <Route component={() => <div className="p-10 text-center">404 - Página não encontrada</div>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
