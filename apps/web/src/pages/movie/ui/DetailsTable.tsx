import { useQuery } from "@tanstack/react-query";
import type { MovieDetails, ReleaseDate } from "../../../api/tmdb/models";
import { getMovieReleaseDates } from "../../../api/tmdb/movie/release_dates";
import { Loading } from "../../../components/ui/Loading";
import { Error } from "../../../components/ui/Error";
import { useLanguages } from "../../../hooks/tmdb/use_languages";
import { formatDate } from "../../../shared/dateFormatter";
import { formatCurrency } from "../../../shared/currencyFormatter";
import { BoxIcon, DownloadIcon, FilmIcon, StarIcon, TicketIcon, TvIcon } from "../../../components/ui/icons/Icons";

interface DetailsTableProps {
    movieDetails: MovieDetails;
}

export function DetailsTable({ movieDetails }: DetailsTableProps) {
    const movieReleaseDatesQuery = useQuery({
        queryKey: ["movieReleaseDatesQuery", movieDetails.id],
        queryFn: () => getMovieReleaseDates(movieDetails.id),
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
    const releaseDates: Array<ReleaseDate> = (movieReleaseDatesQuery.data?.results
        .find(releaseDateResult => releaseDateResult.iso_3166_1 === "US")?.release_dates || [])
        .filter((releaseDate, index, releaseDates) => releaseDates.findIndex(date => date.type === releaseDate.type) === index);

    const languagesQuery = useLanguages();
    const languagesValues: Map<string, string> = new Map([...(languagesQuery.data?.map(language => [language.iso_639_1, language.english_name] as const) ?? [])]);

    const formatReleaseType = (t: number) => {
        switch (t) {
            case 1: return "Premiere";
            case 2: return "Theatrical (limited)";
            case 3: return "Theatrical";
            case 4: return "Digital";
            case 5: return "Physical";
            case 6: return "TV";
        }
    }

    const releaseTypeSvg = (t: number) => {
        switch (t) {
            case 1: return <StarIcon width="16" height="16" />;
            case 2: return <FilmIcon width="16" height="16" />;
            case 3: return <TvIcon width="16" height="16" />;
            case 4: return <DownloadIcon width="16" height="16" />;
            case 5: return <BoxIcon width="16" height="16" />;
            case 6: return <TicketIcon width="16" height="16" />;
        }
    }

    return (
        <div className="bg-background-secondary/50 border-2 border-background-tertiary rounded-md divide-y-2 divide-background-tertiary">
            <div className="flex gap-6 px-6 py-2">
                {movieDetails.imdb_id ? (
                    <a
                        href={`https://www.imdb.com/title/${movieDetails.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img className="w-10" src="/imdb_logo.png" />
                    </a>
                ) : null}
                <a
                    href={`https://www.themoviedb.org/movie/${movieDetails.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img className="w-10" src="/tmdb_logo.svg" />
                </a>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Status</span>
                <span>{movieDetails.status}</span>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Release Dates</span>
                <div>
                    {movieReleaseDatesQuery.isLoading ? <Loading /> : null}
                    {movieReleaseDatesQuery.error ? <Error message={movieReleaseDatesQuery.error.message} /> : null}
                    {
                        releaseDates ? (
                            releaseDates.map(releaseDate => {
                                return (
                                    <p key={`${formatDate(releaseDate.release_date)}-${releaseDate.type}-${releaseDate.note}`} className="flex items-center gap-2 justify-end">
                                        <span title={`${formatReleaseType(releaseDate.type)} ${releaseDate.note ? `(${releaseDate.note})` : ""}`} className="flex items-center">
                                            {releaseTypeSvg(releaseDate.type)}
                                        </span>
                                        <span className="whitespace-nowrap">
                                            {formatDate(releaseDate.release_date)}
                                        </span>
                                    </p>
                                )
                            })
                        ) : (
                            "-"
                        )
                    }
                </div>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Budget</span>
                <span>{movieDetails.budget ? formatCurrency(movieDetails.budget, { currency: "USD", maximumFractionDigits: 0 }) : "-"}</span>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Revenue</span>
                <span>{movieDetails.revenue ? formatCurrency(movieDetails.revenue, { currency: "USD", maximumFractionDigits: 0 }) : "-"}</span>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Original Language</span>
                <span>
                    {
                        movieDetails.original_language ? (
                            languagesValues.get(movieDetails.original_language) || movieDetails.original_language.toUpperCase()
                        ) : (
                            "-"
                        )
                    }
                </span>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Spoken Languages</span>
                <div className="text-right">
                    {
                        movieDetails.spoken_languages ? (
                            movieDetails.spoken_languages.map(language => <p key={language.iso_639_1}>{language.english_name}</p>)
                        ) : (
                            <span>-</span>
                        )
                    }
                </div>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Production Countries</span>
                <div className="text-right">
                    {
                        movieDetails.production_countries ? (
                            movieDetails.production_countries.map(country => <p key={country.iso_3166_1}>{country.name}</p>)
                        ) : (
                            <span>-</span>
                        )
                    }
                </div>
            </div>
            <div className="flex gap-4 justify-between px-4 py-2">
                <span className="font-semibold">Studios</span>
                <div className="text-right">
                    {
                        movieDetails.production_companies ? (
                            movieDetails.production_companies.map(company => <p key={company.id}>{company.name}</p>)
                        ) : (
                            <span>-</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
