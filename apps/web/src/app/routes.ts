import { createRootRoute, createRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";
import { App } from "./App";
import { validateStringSearch, type DiscoverMovieSearch, type DiscoverTvSearch, type PersonPageSearch, type SearchPageSearch } from "./search";

const rootRoute = createRootRoute({ component: App });

const routes = [
    createRoute({ getParentRoute: () => rootRoute, path: "/", component: lazyRouteComponent(() => import("../pages/home/HomePage"), "HomePage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/login", component: lazyRouteComponent(() => import("../pages/auth/LoginPage"), "LoginPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/register", component: lazyRouteComponent(() => import("../pages/auth/RegisterPage"), "RegisterPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/custom-lists", component: lazyRouteComponent(() => import("../pages/custom-lists/CustomListsOverviewPage"), "CustomListsOverviewPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/custom-lists/$id", component: lazyRouteComponent(() => import("../pages/custom-lists/CustomListPage"), "CustomListPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tags", component: lazyRouteComponent(() => import("../pages/tags/TagsOverviewPage"), "TagsOverviewPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tags/$id", component: lazyRouteComponent(() => import("../pages/tags/TagPage"), "TagPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover", component: lazyRouteComponent(() => import("../pages/discover/DiscoverPage"), "DiscoverPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/movie", validateSearch: (search) => validateStringSearch<DiscoverMovieSearch>(search), component: lazyRouteComponent(() => import("../pages/discover/DiscoverMoviePage"), "DiscoverMoviePage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/tv", validateSearch: (search) => validateStringSearch<DiscoverTvSearch>(search), component: lazyRouteComponent(() => import("../pages/discover/DiscoverTvSeriesPage"), "DiscoverTvSeriesPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/trending/movie/$timeWindow", component: lazyRouteComponent(() => import("../pages/discover/TrendingMoviePage"), "TrendingMoviePage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/discover/trending/tv/$timeWindow", component: lazyRouteComponent(() => import("../pages/discover/TrendingTvSeriesPage"), "TrendingTvSeriesPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id", component: lazyRouteComponent(() => import("../pages/movie/MovieDetailsPage"), "MovieDetailsPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/crew", component: lazyRouteComponent(() => import("../pages/movie/CrewPage"), "CrewPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/cast", component: lazyRouteComponent(() => import("../pages/movie/CastPage"), "CastPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/recommendations", component: lazyRouteComponent(() => import("../pages/movie/RecommendationsPage"), "RecommendationsPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/movie/$id/similar", component: lazyRouteComponent(() => import("../pages/movie/SimilarPage"), "SimilarPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id", component: lazyRouteComponent(() => import("../pages/tv/TvSeriesDetailsPage"), "TvSeriesDetailsPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/aggregate_crew", component: lazyRouteComponent(() => import("../pages/tv/AggregateCrewPage"), "AggregateCrewPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/aggregate_cast", component: lazyRouteComponent(() => import("../pages/tv/AggregateCastPage"), "AggregateCastPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/recommendations", component: lazyRouteComponent(() => import("../pages/tv/TvSeriesRecommendationsPage"), "TvSeriesRecommendationsPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/tv/$id/similar", component: lazyRouteComponent(() => import("../pages/tv/TvSeriesSimilarPage"), "TvSeriesSimilarPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/search", validateSearch: (search) => validateStringSearch<SearchPageSearch>(search), component: lazyRouteComponent(() => import("../pages/search/SearchPage"), "SearchPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/collection/$id", component: lazyRouteComponent(() => import("../pages/collection/CollectionDetailsPage"), "CollectionDetailsPage") }),
    createRoute({ getParentRoute: () => rootRoute, path: "/person/$id", validateSearch: (search) => validateStringSearch<PersonPageSearch>(search), component: lazyRouteComponent(() => import("../pages/people/PersonPage"), "PersonPage") }),
];

export const router = createRouter({ routeTree: rootRoute.addChildren(routes), defaultPreload: "intent", scrollRestoration: true });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
