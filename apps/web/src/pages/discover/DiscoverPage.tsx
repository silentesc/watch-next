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

export function DiscoverPage() {
    const navigate = useNavigate();

    const discoverMovieQuery = useDiscoverMovies({ sort_by: "popularity.desc" });
    const discoverTvSeriesQuery = useDiscoverTvSeries({ sort_by: "popularity.desc" });
    const trendingMoviesQuery = useTrendingMovies("day");
    const trendingTvSeriesQuery = useTrendingTvSeries("day");

    const discoverMovies = () => {
        navigate("/discover/movie");
    }

    const discoverTvSeries = () => {
        navigate("/discover/tv");
    }

    const trendingMovies = () => {
        navigate("/discover/trending/movie/day");
    }

    const trendingTvSeries = () => {
        navigate("/discover/trending/tv/day");
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* Popular Movies */}
                <div>
                    <div className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={discoverMovies}>
                        <span className="text-2xl font-bold">Popular Movies</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </div>

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
                    <div className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={discoverTvSeries}>
                        <span className="text-2xl font-bold">Popular TV Series</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </div>

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
                    <div className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={trendingMovies}>
                        <span className="text-2xl font-bold">Trending Movies</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </div>

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
                    <div className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={trendingTvSeries}>
                        <span className="text-2xl font-bold">Trending TV Series</span>
                        <ArrowCircleRightIcon className="w-7" />
                    </div>

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
