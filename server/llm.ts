import { invokeLLM } from "./_core/llm";

export async function generateTextSuggestion(context: string, chapterContent: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um assistente de escrita criativa que ajuda autores a continuar suas histórias. Forneça sugestões de continuação que mantêm o tom, estilo e narrativa do texto original. Seja conciso e inspirador.",
        },
        {
          role: "user",
          content: `Contexto do capítulo: ${context}\n\nÚltimo parágrafo escrito:\n${chapterContent}\n\nForneça uma sugestão de continuação para o próximo parágrafo:`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Não foi possível gerar sugestão.";
  } catch (error) {
    console.error("Erro ao gerar sugestão:", error);
    throw new Error("Falha ao gerar sugestão de texto");
  }
}

export async function reviewParagraph(paragraph: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um editor literário experiente. Analise o parágrafo fornecido e forneça feedback construtivo sobre clareza, fluxo, impacto emocional e sugestões de melhoria. Seja encorajador mas honesto.",
        },
        {
          role: "user",
          content: `Por favor, revise este parágrafo:\n\n${paragraph}\n\nForneça feedback detalhado:`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Não foi possível revisar o parágrafo.";
  } catch (error) {
    console.error("Erro ao revisar parágrafo:", error);
    throw new Error("Falha ao revisar parágrafo");
  }
}

export async function generateIdeasFromNotes(notes: string[]): Promise<string> {
  try {
    const notesText = notes.join("\n- ");
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um brainstorming criativo que ajuda autores a expandir ideias. Com base nas notas atômicas fornecidas, gere ideias criativas e conexões que podem enriquecer a narrativa.",
        },
        {
          role: "user",
          content: `Aqui estão minhas notas atômicas:\n- ${notesText}\n\nGere ideias criativas e conexões baseadas nessas notas:`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Não foi possível gerar ideias.";
  } catch (error) {
    console.error("Erro ao gerar ideias:", error);
    throw new Error("Falha ao gerar ideias");
  }
}
