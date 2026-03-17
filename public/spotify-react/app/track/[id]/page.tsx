"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getData } from "@/lib/utils/getData";
import { SpotifyTrack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import SpotifyLogo from "@/components/SpotifyLogo";
import TrackDetails from "./_components/TrackDetails";

export default function TrackPage() {
  const params = useParams();
  const [track, setTrack] = useState<SpotifyTrack | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      const data = await getData(
        `https://api.spotify.com/v1/tracks/${params.id}`,
      );
      setTrack(data);
    };

    fetchTrack();
  }, [params.id]);

  if (!track) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#1db954]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a1a3e] to-[#121212] p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex items-center justify-between">
          <SpotifyLogo />
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              ← Back to search
            </Button>
          </Link>
        </header>

        <TrackDetails track={track} />
      </div>
    </div>
  );
}
