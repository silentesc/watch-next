import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { App } from "./App";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DiscoverMoviePage } from "../pages/discover/DiscoverMoviePage";
import { SearchPage } from "../pages/search/SearchPage";
import { DiscoverPage } from "../pages/discover/DiscoverPage";
import { MovieDetailsPage } from "../pages/movie/MovieDetailsPage";
import { HomePage } from "../pages/home/HomePage";
import { CrewPage } from "../pages/movie/CrewPage";
import { CastPage } from "../pages/movie/CastPage";
import { RecommendationsPage } from "../pages/movie/RecommendationsPage";
import { SimilarPage } from "../pages/movie/SimilarPage";
import { CollectionDetailsPage } from "../pages/collection/CollectionDetailsPage";
import { TrendingMoviePage } from "../pages/discover/TrendingMoviePage";
import { DiscoverTvSeriesPage } from "../pages/discover/DiscoverTvSeriesPage";
import { TrendingTvSeriesPage } from "../pages/discover/TrendingTvSeriesPage";
import { TvSeriesDetailsPage } from "../pages/tv/TvSeriesDetailsPage";
import { TvSeriesRecommendationsPage } from "../pages/tv/TvSeriesRecommendationsPage";
import { TvSeriesSimilarPage } from "../pages/tv/TvSeriesSimilarPage";
import { AggregateCastPage } from "../pages/tv/AggregateCastPage";
import { AggregateCrewPage } from "../pages/tv/AggregateCrewPage";
import { CustomListsOverviewPage } from "../pages/custom-lists/CustomListsOverviewPage";
import { CustomListPage } from "../pages/custom-lists/CustomListPage";
import { PersonPage } from "../pages/people/PersonPage";
import { validateStringSearch, type DiscoverMovieSearch, type DiscoverTvSearch, type PersonPageSearch, type SearchPageSearch } from "./search";

const rootRoute = createRootRoute({ component: App });

const routes = [
    createRoute({ getParentRoute: () => rootRoute, path: "/", component: HomePage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/login", component: LoginPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/register", component: RegisterPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/custom-lists", component: CustomListsOverviewPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/custom-lists/$id", component: CustomListPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover", component: DiscoverPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/movie", validateSearch: (search) => validateStringSearch<DiscoverMovieSearch>(search), component: DiscoverMoviePage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/tv", validateSearch: (search) => validateStringSearch<DiscoverTvSearch>(search), component: DiscoverTvSeriesPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/trending/movie/$timeWindow", component: TrendingMoviePage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/trending/tv/$timeWindow", component: TrendingTvSeriesPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id", component: MovieDetailsPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/crew", component: CrewPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/cast", component: CastPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/recommendations", component: RecommendationsPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/similar", component: SimilarPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id", component: TvSeriesDetailsPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/aggregate_crew", component: AggregateCrewPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/aggregate_cast", component: AggregateCastPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/recommendations", component: TvSeriesRecommendationsPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/similar", component: TvSeriesSimilarPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/search", validateSearch: (search) => validateStringSearch<SearchPageSearch>(search), component: SearchPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/collection/$id", component: CollectionDetailsPage }),
    createRoute({ getParentRoute: () => rootRoute, path: "/person/$id", validateSearch: (search) => validateStringSearch<PersonPageSearch>(search), component: PersonPage }),
];

export const router = createRouter({ routeTree: rootRoute.addChildren(routes), defaultPreload: "intent", scrollRestoration: true });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
