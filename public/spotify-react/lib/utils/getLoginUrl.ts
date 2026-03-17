import { generateCodeChallenge, generateCodeVerifier } from "./pkce";

export const getLoginUrl = async () => {
  const client_id = "617264d9e7f44e389f34b1f8880c794c";
  const redirect_uri = "http://127.0.0.1:3000/callback";
  const scope = "user-read-private user-read-email";

  const codeVerifier = generateCodeVerifier();
  localStorage.setItem("code_verifier", codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};
