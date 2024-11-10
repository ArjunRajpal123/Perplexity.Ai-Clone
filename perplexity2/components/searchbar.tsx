"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SearchResults from "./sources";

export default function SearchBar({ action }: { action: string }) {
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState();
  const [summary, setSummary] = useState();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (action) {
      setIsPending(true);
      const formData = new FormData(e.currentTarget);
      const searchResults = await fetch(action, {
        method: "POST",
        body: formData,
      });

      if (searchResults.ok) {
        const { summary, results } = await searchResults.json();
        setSources(results);
        setSummary(summary);
      }
      router.refresh();
      setIsPending(false);
    }
  };

  return (
    <div className="grow flex flex-col gap-8">
      <Card className="w-full m-auto p-6">
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
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </>
            )}
          </Button>
        </form>
      </Card>
      <div className="w-full overflow-x-scroll">
        {sources && <SearchResults results={sources} />}
        <div> </div>
        {sources && summary && (
          <div>
            <div>Summary</div>

            {summary}
          </div>
        )}
      </div>
    </div>
  );
}
