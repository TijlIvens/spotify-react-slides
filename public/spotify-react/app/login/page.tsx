"use client";

import { getLoginUrl } from "@/lib/utils/getLoginUrl";
import { Button } from "@/components/ui/button";
import SpotifyLogo from "@/components/SpotifyLogo";

export default function LoginPage() {
  const handleLogin = async () => {
    const url = await getLoginUrl();
    window.location.href = url;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-[#1a1a2e] to-[#121212] p-6">
      <SpotifyLogo />
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-extrabold text-white">
          Connect to Spotify
        </h1>
        <p className="max-w-sm text-white/50">
          Log in with your Spotify account to search for tracks, view details,
          and explore music.
        </p>
      </div>
      <Button
        onClick={handleLogin}
        size="lg"
        className="rounded-full bg-[#1db954] px-10 py-6 text-lg font-bold text-black hover:bg-[#1ed760] hover:scale-105 transition-all duration-200"
      >
        Log in with Spotify
      </Button>
    </div>
  );
}
