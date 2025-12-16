import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <h1 className="text-4xl font-bold tracking-tight">BookTrack</h1>
      <p className="text-muted-foreground">Seu rastreador de escrita pessoal.</p>
      
      <div className="flex gap-4 mt-4">
        <Link href="/dashboard">
          <Button size="lg">Entrar no Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
