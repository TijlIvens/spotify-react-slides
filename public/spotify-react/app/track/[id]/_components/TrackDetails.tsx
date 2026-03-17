import Image from "next/image";
import { SpotifyTrack } from "@/lib/types";

interface TrackDetailsProps {
  track: SpotifyTrack;
}

export default function TrackDetails({ track }: TrackDetailsProps) {
  const albumImage = track.album.images[0];

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:gap-10">
      {albumImage ? (
        <Image
          src={albumImage.url}
          alt={track.album.name}
          width={280}
          height={280}
          className="rounded-lg shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-[280px] w-[280px] items-center justify-center rounded-lg bg-white/5 text-6xl text-white/20">
          ♪
        </div>
      )}

      <div className="flex flex-col gap-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Track
        </span>
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          {track.name}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-white/70 sm:justify-start">
          <span className="font-semibold text-white">
            {track.artists.map((a) => a.name).join(", ")}
          </span>
          <span>•</span>
          <span>{track.album.name}</span>
          <span>•</span>
          <span>{track.album.release_date?.split("-")[0]}</span>
        </div>
      </div>
    </div>
  );
}
