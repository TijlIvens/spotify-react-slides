---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://images.unsplash.com/photo-1643208589889-4f02359645c7?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# some information about your slides (markdown enabled)
title: Spotify in React
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
---

# Spotify in React

---

# Introduction

- Basic setup of a React app that connects to the Spotify API.
- These slides will guide you through the setup and a basic search app.
- Expand on this app to create your own Spotify client.       

<br></br>


- The Spotify API allows you to access a wide range of music data, including artists, albums, tracks, and playlists. You can use this data to create your own music applications, such as a music player, a playlist manager, or a music discovery app.
- We need to setup a developer account to access the Spotify API and create a React app to interact with it.

---

# Create a developer account

- Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

- Log in with your Spotify account or create a new one if you don't have one.

- Accept the terms and conditions to access the dashboard.

- Press the "Create App" button to create a new application.

- Fill in the following fields:
  - App name: Choose a name for your application (e.g., "Spotify React App").
  - App description: Provide a brief description of your application.
  - Redirect URI: `http://127.0.0.1:3000/callback`
  - Select Web API
  - Agree to the terms and conditions.
  - Click save
  - Copy your Client ID

---

# Create a React app

- `npx create-next-app@latest spotify-react --yes`
- `cd spotify-react`
- `npx shadcn@latest init -t next`
- `npx shadcn@latest add button`
- `npx shadcn@latest add input`

<br></br>
- Create the following pages:
  - `/`
  - `/track/[id]`
  - `/login`
  - `/callback`

--- 

# Authentication 

- Spotify requires users to login before they can access the API.
- We will use the Authorization Code Flow with PKCE to authenticate users.
- This means the user will be redirected to the Spotify login page.
- After logging in, the user will be redirected back to our app with an authorization code.
- We will exchange this code for an access token.
- The access token will be stored in local storage.
- This is a complicated process to get the token, all info is provided in the slides to get a token.

---

# PKCE Utilities

- Create `lib/utils/pkce.ts` to handle the cryptographic heavy lifting.
- We need to generate a random `code_verifier` and a hashed `code_challenge`.

```typescript
export const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return b64urlEncode(array);
};

export const generateCodeChallenge = async (codeVerifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return b64urlEncode(new Uint8Array(digest));
};

const b64urlEncode = (array: Uint8Array) => {
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
```

---

# Generating the Login URL

- Create `lib/utils/getLoginUrl.ts` to generate the login URL.
- This function will generate a random `code_verifier` and a hashed `code_challenge`.
- Store the `code_verifier` in `localStorage` for the next step.

```typescript
import { generateCodeChallenge, generateCodeVerifier } from "./pkce";

export const getLoginUrl = async () => {
  const client_id = "<YOUR_CLIENT_ID>";
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
```

---

# Handling the Callback (1/2)

- After login, Spotify redirects to `/callback?code=...`.
- In `app/callback/page.tsx`, we extract the `code` and retrieve our stored `code_verifier`.
- To make sure the login works, you must open your app on `http://127.0.0.1:3000` and not `http://localhost:3000`.

```typescript
const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const codeVerifier = localStorage.getItem("code_verifier");

    if (code && codeVerifier) {
      exchangeCodeForToken(code, codeVerifier);
    }
  }, [searchParams]);

  // ... (exchange function on next slide)
};
```

---

# Handling the Callback (2/2)

- We POST the `code` and `code_verifier` to Spotify's API to get an `access_token`.

```typescript
const exchangeCodeForToken = async (code: string, codeVerifier: string) => {
  const payload = new URLSearchParams({
    client_id: "<YOUR_CLIENT_ID>",
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "http://127.0.0.1:3000/callback",
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });

  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
    router.replace("/");
  }
};
```

---

# Making requests to the Spotify API

- Now that we have the access token, we can use it to make requests to the Spotify API.
- Create a function in `lib/utils/spotifyApi.ts` that makes a request to a url and includes the access token in the headers:

```typescript
export const getData = async (url: string, method: string = "GET") => {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  return data;
};
```

--- 

# Search for tracks

- On the home page create a search input and a button that allows the user to search for tracks.
- When the user clicks the search button, make a request to the Spotify API to search for tracks.
- Use this URL to search for tracks: `https://api.spotify.com/v1/search?q=${search}&type=track`
- Make sure to create the types for the response data to have type safety in your app.
- Display the search results on the page, make sure each track is clickable and redirects to the track page.

---

# Track page

- On the track page, make a request to the Spotify API to get the details of the track using this URL: `https://api.spotify.com/v1/tracks/${trackId}`
- Display the track details on the page, including the track name, artist, album, and cover art.
- To fetch the data we need to token. This token is stored in local storage. local storage is only available on the client side. 
- We can't make async calls in the constructor of a component, so we need to use useEffect to make the call.

```typescript
 const [track, setTrack] = useState<SpotifyTrack | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      const data = await getData(
        `https://api.spotify.com/v1/tracks/${params.id}`
      );
      setTrack(data);
    };

    fetchTrack();
  }, [params.id]);
```

---

# Continue

- You can find the solution of this part [here](./SpotifySolution.zip)
- Read the [Spotify API documentation](https://developer.spotify.com/documentation/web-api) to learn more about the API.
- Here you can find all API requists you can do to the Spotify API.
- Upgrade your app by adding more features, such as:
  - Search for artists and albums
  - Display the top tracks of an artist
  - Display the albums of an artist
  - Display the tracks of an album
  - Display the related artists of an artist
  - Display the top tracks of an artist
  - Display the albums of an artist
  - Display the tracks of an album
  - Display the related artists of an artist