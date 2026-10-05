import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { Link } from "@tanstack/react-router";
import { MovieHorizontalList } from "../../components/ui/lists/MovieHorizontalList";
import { useDiscoverMovies } from "../../hooks/tmdb/use_discover_movies";
import { useTrendingMovies } from "../../hooks/tmdb/use_trending_movies";
import { useDiscoverTvSeries } from "../../hooks/tmdb/use_discover_tv_series";
import { TvSeriesHorizontalList } from "../../components/ui/lists/TvSeriesHorizontalList";
import { useTrendingTvSeries } from "../../hooks/tmdb/use_trending_tv_series";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

export function DiscoverPage() {
    const discoverMovieQuery = useDiscoverMovies({ sort_by: "popularity.desc" });
    const discoverTvSeriesQuery = useDiscoverTvSeries({ sort_by: "popularity.desc" });
    const trendingMoviesQuery = useTrendingMovies("day");
    const trendingTvSeriesQuery = useTrendingTvSeries("day");

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* Popular Movies */}
                <div>
                    <Link to="/discover/movie" className="my-3 flex gap-1 items-center cursor-pointer w-max">
                        <span className="text-2xl font-bold">Popular Movies</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </Link>

                    {
                        discoverMovieQuery.error
                            ? <Error message={discoverMovieQuery.error.message} />
                            : discoverMovieQuery.isLoading
                                ? <Loading />
                                : !discoverMovieQuery.data
                                    ? <Error message="No data returned" />
                                    : <MovieHorizontalList movies={discoverMovieQuery.data.pages[0].results} seeMoreLinkOptions={{ to: "/discover/movie" }} />
                    }
                </div>
                {/* Popular TV Series */}
                <div>
                    <Link to="/discover/tv" className="my-3 flex gap-1 items-center cursor-pointer w-max">
                        <span className="text-2xl font-bold">Popular TV Series</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </Link>

                    {
                        discoverTvSeriesQuery.error
                            ? <Error message={discoverTvSeriesQuery.error.message} />
                            : discoverTvSeriesQuery.isLoading
                                ? <Loading />
                                : !discoverTvSeriesQuery.data
                                    ? <Error message="No data returned" />
                                    : <TvSeriesHorizontalList tvSeries={discoverTvSeriesQuery.data.pages[0].results} seeMoreLinkOptions={{ to: "/discover/tv" }} />
                    }
                </div>
                {/* Trending Movies */}
                <div>
                    <Link to="/discover/trending/movie/$timeWindow" params={{ timeWindow: "day" }} className="my-3 flex gap-1 items-center cursor-pointer w-max">
                        <span className="text-2xl font-bold">Trending Movies</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </Link>

                    {/* Check for stuff */}
                    {
                        trendingMoviesQuery.error
                            ? <Error message={trendingMoviesQuery.error.message} />
                            : trendingMoviesQuery.isLoading
                                ? <Loading />
                                : !trendingMoviesQuery.data
                                    ? <Error message="No data returned" />
                                    : <MovieHorizontalList movies={trendingMoviesQuery.data.pages[0].results} seeMoreLinkOptions={{ to: "/discover/trending/movie/$timeWindow", params: { timeWindow: "day" } }} />
                    }
                </div>
                {/* Trending TV Series */}
                <div>
                    <Link to="/discover/trending/tv/$timeWindow" params={{ timeWindow: "day" }} className="my-3 flex gap-1 items-center cursor-pointer w-max">
                        <span className="text-2xl font-bold">Trending TV Series</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </Link>

                    {/* Check for stuff */}
                    {
                        trendingTvSeriesQuery.error
                            ? <Error message={trendingTvSeriesQuery.error.message} />
                            : trendingTvSeriesQuery.isLoading
                                ? <Loading />
                                : !trendingTvSeriesQuery.data
                                    ? <Error message="No data returned" />
                                    : <TvSeriesHorizontalList tvSeries={trendingTvSeriesQuery.data.pages[0].results} seeMoreLinkOptions={{ to: "/discover/trending/tv/$timeWindow", params: { timeWindow: "day" } }} />
                    }
                </div>
            </div>
        </>
    );
}
