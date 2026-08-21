export type ShowFormat = "podcast" | "video_series" | "audio_drama" | "book_club" | "newsroom";
export type ShowState = "draft" | "review" | "published" | "paused" | "archived";

export interface ChildShow {
  id: string;
  title: string;
  format: ShowFormat;
  ownerProfileId: string;
  schoolId?: string;
  state: ShowState;
  seasonNumber: number;
  episodeCount: number;
  publicPublisherLabel: string;
}

export interface ShowEpisodeSummary {
  id: string;
  showId: string;
  title: string;
  episodeNumber: number;
  state: "draft" | "approval_pending" | "moderation_pending" | "published";
}

export function safePublicPublisherLabel(input: {
  childDisplayName?: string;
  approvedCreatorAlias?: string;
  schoolOrProgrammeLabel?: string;
}): string {
  if (input.approvedCreatorAlias?.trim()) return input.approvedCreatorAlias.trim();
  if (input.schoolOrProgrammeLabel?.trim()) return input.schoolOrProgrammeLabel.trim();
  return "Young Creator";
}

export function canShowExposeOwnerProfileIdToPublic(): boolean {
  return false;
}

export function nextEpisodeNumber(episodes: ShowEpisodeSummary[]): number {
  if (episodes.length === 0) return 1;
  return Math.max(...episodes.map((episode) => episode.episodeNumber)) + 1;
}
