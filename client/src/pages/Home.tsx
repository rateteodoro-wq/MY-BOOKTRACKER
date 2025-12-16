import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Only redirect to dashboard if user is authenticated AND on the home page
    if (isAuthenticated && user && location === "/") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate, location]);

  // If user is authenticated but not on home page, don't redirect
  if (isAuthenticated && user && location === "/") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-foreground">
        <div className="container py-6 md:py-8">
          <h1 className="text-4xl md:text-5xl font-bold">Book Writing Tracker</h1>
          <p className="text-lg text-muted-foreground mt-2">Protocolo IMPACT para Escrita Consistente</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Transforme Sua Escrita em Hábito</h2>
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                Rastreie o progresso de seu livro com rituais estruturados. Modo Manutenção para captura de ideias, 
                Modo Construção para escrita profunda. Celebre cada vitória no caminho.
              </p>
              <div className="flex gap-4">
                <a href={getLoginUrl()}>
                  <Button className="btn-primary">Começar Agora</Button>
                </a>
                <Button className="btn-outline">Saiba Mais</Button>
              </div>
            </div>
            <div className="bg-muted p-8 md:p-12 border-2 border-foreground">
              <div className="space-y-4">
                <div className="border-b-2 border-foreground pb-4">
                  <h3 className="font-bold text-lg mb-2">🟢 Modo Manutenção</h3>
                  <p className="text-sm">Seg-Qua: 50 min de leitura e captura de notas</p>
                </div>
                <div className="border-b-2 border-foreground pb-4">
                  <h3 className="font-bold text-lg mb-2">🟡 Modo Construção</h3>
                  <p className="text-sm">Sábado-Domingo: 2x 90 min de escrita profunda</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">🎯 Shutdown Ritual</h3>
                  <p className="text-sm">Encerre cada sessão com checklists estruturados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing border-t-2 border-foreground">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12">Funcionalidades Principais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-2 border-foreground p-8">
              <div className="w-12 h-12 bg-accent mb-6"></div>
              <h3 className="text-xl font-bold mb-3">Dashboard Inteligente</h3>
              <p className="text-foreground">Visão completa do progresso de seus capítulos em tempo real</p>
            </div>
            <div className="border-2 border-foreground p-8">
              <div className="w-12 h-12 bg-accent mb-6"></div>
              <h3 className="text-xl font-bold mb-3">Timers Estruturados</h3>
              <p className="text-foreground">50 min (Manutenção) e 90 min (Construção) com pausas regenerativas</p>
            </div>
            <div className="border-2 border-foreground p-8">
              <div className="w-12 h-12 bg-accent mb-6"></div>
              <h3 className="text-xl font-bold mb-3">Histórico Completo</h3>
              <p className="text-foreground">Rastreie todas as sessões, notas e marcos alcançados</p>
            </div>
            <div className="border-2 border-foreground p-8">
              <div className="w-12 h-12 bg-accent mb-6"></div>
              <h3 className="text-xl font-bold mb-3">Rituais Automáticos</h3>
              <p className="text-foreground">Checklists de entrada e saída para cada modo de trabalho</p>
            </div>
            <div className="border-2 border-foreground p-8">
              <div className="w-12 h-12 bg-accent mb-6"></div>
              <h3 className="text-xl font-bold mb-3">Celebração de Vitórias</h3>
              <p className="text-foreground">Registre marcos e celebre cada capítulo concluído</p>
            </div>
            <div className="border-2 border-foreground p-8">
              <div className="w-12 h-12 bg-accent mb-6"></div>
              <h3 className="text-xl font-bold mb-3">Integração com IA</h3>
              <p className="text-foreground">Sugestões de continuação e revisão de parágrafos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-accent text-accent-foreground border-t-4 border-accent">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a escritores que transformaram suas ideias em livros completos usando o Protocolo IMPACT
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-accent-foreground text-accent px-8 py-4 font-bold text-lg hover:opacity-90">
              Iniciar Agora
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2025 Book Writing Tracker. Protocolo IMPACT para Escrita Consistente.</p>
        </div>
      </footer>
    </div>
  );
}
