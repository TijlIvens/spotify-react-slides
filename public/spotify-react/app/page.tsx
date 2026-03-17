"use client";

import { useState } from "react";
import Link from "next/link";
import { getData } from "@/lib/utils/getData";
import { SpotifySearchResponse, SpotifyTrack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import SpotifyLogo from "@/components/SpotifyLogo";
import SearchBar from "./_components/SearchBar";
import TrackList from "./_components/TrackList";

export default function Home() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    const data: SpotifySearchResponse = await getData(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
    );
    setTracks(data.tracks.items);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#121212] p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex items-center justify-between">
          <SpotifyLogo />
          <Link href="/login">
            <Button className="rounded-full bg-white px-5 font-semibold text-black hover:bg-white/90 hover:scale-105 transition-all duration-200">
              Login
            </Button>
          </Link>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Search for tracks
          </h2>
          <SearchBar onSearch={handleSearch} />
        </section>

        {hasSearched && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-white/80">
              {tracks.length > 0
                ? `Found ${tracks.length} tracks`
                : "No tracks found"}
            </h2>
            <TrackList tracks={tracks} />
          </section>
        )}
      </div>
    </div>
  );
}
