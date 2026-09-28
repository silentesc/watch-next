import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { CustomListCard } from "../../components/ui/cards/CustomListCard";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { MovieHorizontalList } from "../../components/ui/lists/MovieHorizontalList";
import { TvSeriesHorizontalList } from "../../components/ui/lists/TvSeriesHorizontalList";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useTrendingMovies } from "../../hooks/tmdb/use_trending_movies";
import { useTrendingTvSeries } from "../../hooks/tmdb/use_trending_tv_series";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

export function HomePage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const trendingMoviesQuery = useTrendingMovies("day");
    const trendingTvSeriesQuery = useTrendingTvSeries("day");

    const customListsQuery = useCustomLists();

    const submitSearch = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = search.trim();
        if (query) navigate(`/search?query=${encodeURIComponent(query)}`);
        else navigate("/search");
    };

    return (
        <div className="flex flex-col gap-10 pb-10">
            <section className="relative overflow-hidden border border-background-tertiary bg-background-primary px-6 py-10 sm:px-10 sm:py-14">
                <div className="relative max-w-2xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground-secondary">Watch Next</p>
                    <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Find your next watch.</h1>
                    <p className="mt-4 max-w-lg text-lg text-foreground-secondary">A place to organize your media, or just search around for something new.</p>
                    <form className="mt-7 flex flex-col gap-2 sm:flex-row" onSubmit={submitSearch}>
                        <Input placeholder="Search movies and TV series" value={search} onChange={event => setSearch(event.target.value)} />
                        <Button type="submit" value="Search" fullWidth={false} variant="primary" />
                    </form>
                </div>
            </section>

            <section>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-foreground-secondary">A little inspiration</p>
                        <a href="/discover" className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={e => { e.preventDefault(); navigate("/discover") }}>
                            <span className="text-2xl font-bold">Trending today</span>
                            <ArrowCircleRightIcon className="w-7" />
                        </a>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">Movies</h2>
                        {trendingMoviesQuery.error ? (
                            <Error message={trendingMoviesQuery.error.message} />
                        ) : trendingMoviesQuery.isLoading ? (
                            <Loading />
                        ) : trendingMoviesQuery.data ? (
                            <MovieHorizontalList movies={trendingMoviesQuery.data.pages[0].results} seeMoreLinkHint="/discover/trending/movie/day" onSeeMoreClick={() => navigate("/discover/trending/movie/day")} />
                        ) : <Error message="No data returned" />}
                    </div>
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">TV series</h2>
                        {trendingTvSeriesQuery.error ? (
                            <Error message={trendingTvSeriesQuery.error.message} />
                        ) : trendingTvSeriesQuery.isLoading ? (
                            <Loading />
                        ) : trendingTvSeriesQuery.data ? (
                            <TvSeriesHorizontalList tvSeries={trendingTvSeriesQuery.data.pages[0].results} seeMoreLinkHint="/discover/trending/tv/day" onSeeMoreClick={() => navigate("/discover/trending/tv/day")} />
                        ) : <Error message="No data returned" />}
                    </div>
                </div>
            </section>

            <section className="border-background-tertiary pt-8">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-foreground-secondary">Your library</p>
                        <a href="/custom-lists" className="my-3 flex gap-1 items-center cursor-pointer w-max" onClick={e => { e.preventDefault(); navigate("/custom-lists") }}>
                            <span className="text-2xl font-bold">Your lists</span>
                            <ArrowCircleRightIcon className="w-7" />
                        </a>
                    </div>
                </div>
                {
                    customListsQuery.error ? (
                        <Error message={customListsQuery.error.message} />
                    ) : customListsQuery.isLoading ? (
                        <Loading />
                    ) : customListsQuery.data ? (
                        customListsQuery.data.length === 0 ? (
                            <p className="text-foreground-secondary">You haven't created any lists yet.</p>
                        ) : (
                            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] justify-items-center">
                                {customListsQuery.data.slice(0, 3).map(list => <CustomListCard key={list.id} customList={list} />)}
                                {customListsQuery.data.length >= 4 ? (
                                    <div className="relative">
                                        <div className="blur-sm pointer-events-none">
                                            <CustomListCard customList={customListsQuery.data[2]} />
                                        </div>
                                        <a href={"/custom-lists"} onClick={(e) => { e.preventDefault(); navigate("/custom-lists") }}>
                                            <div className="absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer flex flex-col gap-1 items-center">
                                                <span className="font-semibold text-nowrap">See more</span>
                                                <ArrowCircleRightIcon className="w-7" />
                                            </div>
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        )
                    ) : <Error message="No data returned" />
                }
            </section>
        </div>
    );
}
