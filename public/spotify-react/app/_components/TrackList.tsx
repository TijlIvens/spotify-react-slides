import { SpotifyTrack } from "@/lib/types";
import TrackListItem from "./TrackListItem";

interface TrackListProps {
  tracks: SpotifyTrack[];
}

export default function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center gap-4 border-b border-white/10 px-3 pb-2 text-xs font-medium uppercase tracking-wider text-white/30">
        <span className="w-12" />
        <span className="min-w-0 flex-1">Title</span>
        <span className="hidden sm:block">Album</span>
        <span>Duration</span>
      </div>
      {tracks.map((track) => (
        <TrackListItem key={track.id} track={track} />
      ))}
    </div>
  );
}
