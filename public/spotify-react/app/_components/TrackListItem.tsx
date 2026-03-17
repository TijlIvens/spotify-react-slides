import Image from "next/image";
import Link from "next/link";
import { SpotifyTrack } from "@/lib/types";

interface TrackListItemProps {
  track: SpotifyTrack;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TrackListItem({ track }: TrackListItemProps) {
  const thumbnail = track.album.images[2] ?? track.album.images[0];

  return (
    <Link href={`/track/${track.id}`}>
      <div className="group flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-white/10">
        {thumbnail ? (
          <Image
            src={thumbnail.url}
            alt={track.album.name}
            width={48}
            height={48}
            className="rounded shadow-md transition-shadow duration-200 group-hover:shadow-lg"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded bg-white/5 text-white/30">
            ♪
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white group-hover:text-[#1db954] transition-colors duration-200">
            {track.name}
          </p>
          <p className="truncate text-sm text-white/50">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>

        <span className="hidden text-sm text-white/30 sm:block">
          {track.album.name}
        </span>

        <span className="text-sm tabular-nums text-white/30">
          {formatDuration(track.duration_ms)}
        </span>
      </div>
    </Link>
  );
}
