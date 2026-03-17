"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const codeVerifier = localStorage.getItem("code_verifier");

    if (code && codeVerifier) {
      exchangeCodeForToken(code, codeVerifier);
    }
  }, [searchParams, router]);

  const exchangeCodeForToken = async (code: string, codeVerifier: string) => {
    const client_id = "617264d9e7f44e389f34b1f8880c794c";
    const redirect_uri = "http://127.0.0.1:3000/callback";

    const payload = new URLSearchParams({
      client_id: client_id,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
      code_verifier: codeVerifier,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      router.replace("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#1db954]" />
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#121212]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#1db954]" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
