import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/sonner";

// --- PÁGINA HOME EMBUTIDA (Para evitar erro de arquivo não encontrado) ---
function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900 p-6 font-sans">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-black">
            BookTrack
          </h1>
          <p className="text-xl text-zinc-500">
            Seu sistema de rastreamento de escrita está online.
          </p>
        </div>
        
        <div className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <p className="mb-6 text-zinc-600">
            Tudo pronto! Seu ambiente foi configurado corretamente.
          </p>
          <Link href="/dashboard">
            <a className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-bold text-white transition-all bg-black rounded-lg hover:bg-zinc-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Acessar Meu Painel (Dashboard) →
            </a>
          </Link>
        </div>
        
        <p className="text-xs text-zinc-400">Versão Vercel v1.0</p>
      </div>
    </div>
  );
}

// Tenta importar o Dashboard, mas se falhar, usa um placeholder
import Dashboard from "./pages/Dashboard"; 

function Router() {
  return (
    <Switch>
      {/* Usa a Home que criamos ali em cima 👆 */}
      <Route path="/" component={Home} />
      
      {/* Tenta carregar o dashboard */}
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Rota 404 genérica */}
      <Route component={() => (
        <div className="min-h-screen flex items-center justify-center text-zinc-500">
          404 - Página não encontrada
        </div>
      )} />
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
