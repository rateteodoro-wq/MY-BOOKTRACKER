import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function AIAssistant() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  const [activeTab, setActiveTab] = useState<"suggestion" | "review" | "ideas">("suggestion");
  const [context, setContext] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSuggestionMutation = trpc.ai.generateSuggestion.useMutation();
  const reviewParagraphMutation = trpc.ai.reviewParagraph.useMutation();
  const generateIdeasMutation = trpc.ai.generateIdeas.useMutation();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleGenerateSuggestion = async () => {
    if (!context.trim() || !chapterContent.trim()) return;
    
    setLoading(true);
    try {
      const suggestion = await generateSuggestionMutation.mutateAsync({
        context,
        chapterContent,
      });
      setResult(suggestion);
    } catch (error) {
      setResult("Erro ao gerar sugestão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewParagraph = async () => {
    if (!paragraph.trim()) return;
    
    setLoading(true);
    try {
      const review = await reviewParagraphMutation.mutateAsync({
        paragraph,
      });
      setResult(review);
    } catch (error) {
      setResult("Erro ao revisar parágrafo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!notes.trim()) return;
    
    setLoading(true);
    try {
      const notesList = notes.split("\n").filter(n => n.trim());
      const ideas = await generateIdeasMutation.mutateAsync({
        notes: notesList,
      });
      setResult(ideas);
    } catch (error) {
      setResult("Erro ao gerar ideias. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-foreground">
        <div className="container py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold">🤖 Assistente de IA</h1>
          <Button className="btn-outline" onClick={() => navigate("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="section-spacing">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Input Section */}
            <section className="border-2 border-foreground p-8">
              {/* Tabs */}
              <div className="flex gap-2 mb-8 border-b-2 border-foreground pb-4">
                <button
                  onClick={() => setActiveTab("suggestion")}
                  className={`px-4 py-2 font-bold ${activeTab === "suggestion" ? "bg-accent text-accent-foreground" : "border-b-2 border-transparent"}`}
                >
                  Sugestão
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`px-4 py-2 font-bold ${activeTab === "review" ? "bg-accent text-accent-foreground" : "border-b-2 border-transparent"}`}
                >
                  Revisão
                </button>
                <button
                  onClick={() => setActiveTab("ideas")}
                  className={`px-4 py-2 font-bold ${activeTab === "ideas" ? "bg-accent text-accent-foreground" : "border-b-2 border-transparent"}`}
                >
                  Ideias
                </button>
              </div>

              {/* Suggestion Tab */}
              {activeTab === "suggestion" && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2">Contexto do Capítulo</label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Descreva o contexto, personagens e trama do capítulo..."
                      className="w-full border-2 border-foreground p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Último Parágrafo Escrito</label>
                    <textarea
                      value={chapterContent}
                      onChange={(e) => setChapterContent(e.target.value)}
                      placeholder="Cole o último parágrafo que escreveu..."
                      className="w-full border-2 border-foreground p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      rows={4}
                    />
                  </div>
                  <Button 
                    className="btn-primary w-full"
                    onClick={handleGenerateSuggestion}
                    disabled={loading || !context.trim() || !chapterContent.trim()}
                  >
                    {loading ? "Gerando..." : "Gerar Sugestão"}
                  </Button>
                </div>
              )}

              {/* Review Tab */}
              {activeTab === "review" && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2">Parágrafo para Revisar</label>
                    <textarea
                      value={paragraph}
                      onChange={(e) => setParagraph(e.target.value)}
                      placeholder="Cole o parágrafo que deseja revisar..."
                      className="w-full border-2 border-foreground p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      rows={6}
                    />
                  </div>
                  <Button 
                    className="btn-primary w-full"
                    onClick={handleReviewParagraph}
                    disabled={loading || !paragraph.trim()}
                  >
                    {loading ? "Revisando..." : "Revisar Parágrafo"}
                  </Button>
                </div>
              )}

              {/* Ideas Tab */}
              {activeTab === "ideas" && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2">Notas Atômicas</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Digite suas notas, uma por linha..."
                      className="w-full border-2 border-foreground p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      rows={6}
                    />
                  </div>
                  <Button 
                    className="btn-primary w-full"
                    onClick={handleGenerateIdeas}
                    disabled={loading || !notes.trim()}
                  >
                    {loading ? "Gerando..." : "Gerar Ideias"}
                  </Button>
                </div>
              )}
            </section>

            {/* Result Section */}
            <section className="border-2 border-foreground p-8">
              <h2 className="text-2xl font-bold mb-6">Resultado</h2>
              
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin w-8 h-8" />
                </div>
              ) : result ? (
                <div className="bg-muted p-6 border border-foreground rounded">
                  <p className="text-foreground whitespace-pre-wrap">{result}</p>
                  <Button 
                    className="btn-outline w-full mt-6"
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      alert("Copiado para a área de transferência!");
                    }}
                  >
                    Copiar Resultado
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Os resultados aparecerão aqui</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
