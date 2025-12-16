import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home"; // Importação corrigida com H maiúsculo
import Dashboard from "./pages/Dashboard"; // Se tiver dashboard

function Router() {
  return (
    <Switch>
      {/* Rota principal apontando para o Home que criamos */}
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} /> 
      <Route component={NotFound} />
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
