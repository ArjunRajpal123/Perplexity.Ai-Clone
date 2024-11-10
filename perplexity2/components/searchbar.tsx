"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SearchBar({ action }: { action: string }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (action) {
      startTransition(async () => {
        const formData = new FormData(e.currentTarget);
        await fetch(action, {
          method: "POST",
          body: formData,
        });
        router.refresh();
      });
    } else {
      console.log("Client-side handling: Search query:", query);
      // Here you would typically handle the client-side search action
    }
  };

  return (
    <Card className="w-full max-w-3xl m-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-primary">Perplexity AI2</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Ask anything. Get instant answers and sources.
      </p>
      <form onSubmit={handleSubmit} className="flex items-center p-1 gap-2">
        <Input
          type="text"
          name="query"
          placeholder="Ask me anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow shadow-none text-lg placeholder:text-muted-foreground/60 focus:ring-0 border-black border"
        />
        <Button
          type="submit"
          size="icon"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          disabled={isPending}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </Card>
  );
}
