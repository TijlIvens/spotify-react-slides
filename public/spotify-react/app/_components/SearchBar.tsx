"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="What do you want to listen to?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="h-12 rounded-full border-none bg-white/10 px-5 text-white placeholder:text-white/40 focus-visible:ring-[#1db954] focus-visible:ring-offset-0"
      />
      <Button
        onClick={handleSubmit}
        className="h-12 rounded-full bg-[#1db954] px-6 font-semibold text-black hover:bg-[#1ed760] hover:scale-105 transition-all duration-200"
      >
        Search
      </Button>
    </div>
  );
}
