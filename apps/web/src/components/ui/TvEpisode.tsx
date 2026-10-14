import type { TvEpisodeDetails } from "../../api/tmdb/models";
import { formatDate } from "../../shared/dateFormatter";
import { getRatingColor, getRatingString } from "../../shared/ratingUtils";
import { TagPicker } from "./TagPicker";

interface TvEpisodeProps {
    episode: TvEpisodeDetails,
}

export function TvEpisode({ episode }: TvEpisodeProps) {
    const canTagEpisode = episode.show_id != null
        && episode.season_number != null
        && episode.episode_number != null;

    return (
        <li className="relative flex flex-col gap-3 py-4 first:pt-3 last:pb-3 sm:flex-row">
            <div className="aspect-video w-35">
                {episode.still_path ? (
                    <div className="flex w-full h-full items-center justify-center">
                        <img
                            className="w-full h-full object-contain sm:w-28"
                            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                            alt={episode.name}
                        />
                    </div>
                ) : (
                    <div className="flex w-full h-full items-center justify-center">
                        <img className="w-full h-full rounded-l-md object-contain  grayscale opacity-30" src="/logo_sad.png" alt={episode.name} />
                    </div>
                )
                }
            </div>
            <div className="min-w-0 flex-1">
                <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${canTagEpisode ? "pr-10" : ""}`}>
                    <span className="text-lg">
                        {episode.episode_number + ". "}
                        {episode.name}
                    </span>
                    {episode.air_date ? (
                        <span className="opacity-75">
                            {`(${formatDate(episode.air_date, "medium")})`}
                        </span>
                    ) : null}
                </div>

                {(episode.runtime || episode.vote_average) ? (
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 opacity-75">
                        {episode.runtime ? (
                            <span>{episode.runtime} min</span>
                        ) : null}
                        {episode.runtime && episode.vote_average ? <span aria-hidden="true">•</span> : null}
                        {episode.vote_average ? (
                            <span>
                                <span className={getRatingColor(episode.vote_average)}>
                                    {getRatingString(episode.vote_average)}
                                </span>
                                <span> / 10</span>
                            </span>
                        ) : null}
                    </div>
                ) : null}

                {episode.overview ? (
                    <p className="mt-3 opacity-75">{episode.overview}</p>
                ) : null}
            </div>

            {canTagEpisode ? (
                <div
                    className="absolute right-1 top-3"
                    onClick={e => e.stopPropagation()}
                >
                    <TagPicker
                        item={{
                            kind: "tv_episode",
                            external_source: "tmdb",
                            external_id: episode.show_id!,
                            season_number: episode.season_number!,
                            episode_number: episode.episode_number!,
                        }}
                        mode="popup"
                    />
                </div>
            ) : null}
        </li>
    );
}
