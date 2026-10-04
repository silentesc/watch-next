import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { MovieHorizontalList } from "../../components/ui/lists/MovieHorizontalList";
import { useNavigate } from "react-router";
import { useDiscoverMovies } from "../../hooks/tmdb/use_discover_movies";
import { useTrendingMovies } from "../../hooks/tmdb/use_trending_movies";
import { useDiscoverTvSeries } from "../../hooks/tmdb/use_discover_tv_series";
import { TvSeriesHorizontalList } from "../../components/ui/lists/TvSeriesHorizontalList";
import { useTrendingTvSeries } from "../../hooks/tmdb/use_trending_tv_series";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

const DISCOVER_MOVIES_HREF = "/discover/movie";
const DISCOVER_SERIES_HREF = "/discover/tv";
const TRENDING_MOVIES_HREF = "/discover/trending/movie/day";
const TRENDING_SERIES_HREF = "/discover/trending/tv/day";

export function DiscoverPage() {
    const navigate = useNavigate();

    const discoverMovieQuery = useDiscoverMovies({ sort_by: "popularity.desc" });
    const discoverTvSeriesQuery = useDiscoverTvSeries({ sort_by: "popularity.desc" });
    const trendingMoviesQuery = useTrendingMovies("day");
    const trendingTvSeriesQuery = useTrendingTvSeries("day");

    const discoverMovies = () => {
        navigate(DISCOVER_MOVIES_HREF);
    }

    const discoverTvSeries = () => {
        navigate(DISCOVER_SERIES_HREF);
    }

    const trendingMovies = () => {
        navigate(TRENDING_MOVIES_HREF);
    }

    const trendingTvSeries = () => {
        navigate(TRENDING_SERIES_HREF);
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* Popular Movies */}
                <div>
                    <a href={DISCOVER_MOVIES_HREF} className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={e => { e.preventDefault(); discoverMovies() }}>
                        <span className="text-2xl font-bold">Popular Movies</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </a>

                    {
                        discoverMovieQuery.error
                            ? <Error message={discoverMovieQuery.error.message} />
                            : discoverMovieQuery.isLoading
                                ? <Loading />
                                : !discoverMovieQuery.data
                                    ? <Error message="No data returned" />
                                    : <MovieHorizontalList movies={discoverMovieQuery.data.pages[0].results} seeMoreLinkHint="/discover/movie" onSeeMoreClick={discoverMovies} />
                    }
                </div>
                {/* Popular TV Series */}
                <div>
                    <a href={DISCOVER_SERIES_HREF} className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={e => { e.preventDefault(); discoverTvSeries() }}>
                        <span className="text-2xl font-bold">Popular TV Series</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </a>

                    {
                        discoverTvSeriesQuery.error
                            ? <Error message={discoverTvSeriesQuery.error.message} />
                            : discoverTvSeriesQuery.isLoading
                                ? <Loading />
                                : !discoverTvSeriesQuery.data
                                    ? <Error message="No data returned" />
                                    : <TvSeriesHorizontalList tvSeries={discoverTvSeriesQuery.data.pages[0].results} seeMoreLinkHint="/discover/tv" onSeeMoreClick={discoverTvSeries} />
                    }
                </div>
                {/* Trending Movies */}
                <div>
                    <a href={TRENDING_MOVIES_HREF} className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={e => { e.preventDefault(); trendingMovies() }}>
                        <span className="text-2xl font-bold">Trending Movies</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </a>

                    {/* Check for stuff */}
                    {
                        trendingMoviesQuery.error
                            ? <Error message={trendingMoviesQuery.error.message} />
                            : trendingMoviesQuery.isLoading
                                ? <Loading />
                                : !trendingMoviesQuery.data
                                    ? <Error message="No data returned" />
                                    : <MovieHorizontalList movies={trendingMoviesQuery.data.pages[0].results} seeMoreLinkHint="/discover/trending/movie/day" onSeeMoreClick={trendingMovies} />
                    }
                </div>
                {/* Trending TV Series */}
                <div>
                    <a href={TRENDING_SERIES_HREF} className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={e => { e.preventDefault(); trendingTvSeries() }}>
                        <span className="text-2xl font-bold">Trending TV Series</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </a>

                    {/* Check for stuff */}
                    {
                        trendingTvSeriesQuery.error
                            ? <Error message={trendingTvSeriesQuery.error.message} />
                            : trendingTvSeriesQuery.isLoading
                                ? <Loading />
                                : !trendingTvSeriesQuery.data
                                    ? <Error message="No data returned" />
                                    : <TvSeriesHorizontalList tvSeries={trendingTvSeriesQuery.data.pages[0].results} seeMoreLinkHint="/discover/trending/tv/day" onSeeMoreClick={trendingTvSeries} />
                    }
                </div>
            </div>
        </>
    );
}
