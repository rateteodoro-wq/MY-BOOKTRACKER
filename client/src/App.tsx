import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/sonner";

// --- PÁGINAS INTEGRADAS (Para garantir que o site suba) ---

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white text-black font-sans">
      <h1 className="text-4xl font-extrabold mb-4">BookTrack Online! 🚀</h1>
      <p className="text-xl text-gray-600 mb-8">
        Sistema recuperado com sucesso.
      </p>
      <a href="/dashboard" className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition">
        Entrar no Sistema
      </a>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-10 font-sans">
      <h1 className="text-3xl font-bold">Painel Principal</h1>
      <p className="mt-4 text-gray-600">O sistema está funcional.</p>
      <a href="/" className="text-blue-600 hover:underline mt-6 block">← Voltar para Home</a>
    </div>
  );
}

// --- ROTEADOR ---

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
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
