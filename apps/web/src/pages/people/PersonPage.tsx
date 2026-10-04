import { useParams } from "react-router";
import { usePersonDetails } from "../../hooks/tmdb/use_person_details";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { usePersonCombinedCredits } from "../../hooks/tmdb/use_person_combined_credits";
import { Poster } from "../../components/ui/Poster";
import { PosterCard } from "../../components/ui/cards/PosterCard";
import type { PersonCombinedCredit } from "../../api/tmdb/models";
import { formatDate } from "../../shared/dateFormatter";
import { useState } from "react";

function creditDate(credit: PersonCombinedCredit) {
    return credit.media_type === "movie" ? credit.release_date : credit.first_air_date;
}

function creditTitle(credit: PersonCombinedCredit) {
    return credit.media_type === "movie" ? credit.title : credit.name;
}

function creditRole(credit: PersonCombinedCredit) {
    if (credit.character) return credit.character;
    return credit.job || credit.department;
}

function CreditGrid({ credits }: { credits: PersonCombinedCredit[] }) {
    return (
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(9rem,2fr))] justify-items-center">
            {credits.map((credit, index) => {
                const title = creditTitle(credit) || "Unknown title";
                const date = creditDate(credit);
                const role = creditRole(credit);
                const description = [date?.split("-")[0], role].filter(Boolean).join("\n");
                const href = credit.id ? `/${credit.media_type}/${credit.id}` : undefined;

                return (
                    <PosterCard
                        key={`${credit.media_type}-${credit.credit_id || index}`}
                        title={title}
                        description={description}
                        posterPath={credit.poster_path}
                        href={href}
                        label={credit.media_type === "movie" ? "MOVIE" : "SERIES"}
                        labelClassName={credit.media_type === "movie" ? "bg-blue-600/80" : "bg-purple-600/80"}
                    />
                );
            })}
        </div>
    );
}

export function PersonPage() {
    const { id } = useParams();

    const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);

    const personId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;
    const personDetailsQuery = usePersonDetails(personId);
    const personCombinedCreditsQuery = usePersonCombinedCredits(personId);

    if (personId === null) {
        return <Error message="Unknown person" />
    }

    if (personDetailsQuery.isLoading) return <Loading />;
    if (personDetailsQuery.error) return <Error message={personDetailsQuery.error.message} />;
    if (!personDetailsQuery.data) return <Error message="No data returned" />;

    const person = personDetailsQuery.data;
    const cast = (personCombinedCreditsQuery.data?.cast || []).sort((a, b) => (creditDate(b) || "").localeCompare(creditDate(a) || ""));
    const crew = (personCombinedCreditsQuery.data?.crew || []).sort((a, b) => (creditDate(b) || "").localeCompare(creditDate(a) || ""));

    return (
        <div>
            <div className="flex flex-wrap gap-8 justify-center md:flex-nowrap">
                <Poster src={person.profile_path} alt={person.name} />
                <div className="w-full">
                    <h1 className="text-3xl font-bold">{person.name || "Unknown person"}</h1>
                    {person.known_for_department ? <p className="mt-1 text-foreground-secondary">{person.known_for_department}</p> : null}

                    <div className="mt-2 flex flex-col gap-1 text-foreground-secondary">
                        {person.birthday ? <p>Born {formatDate(person.birthday, "long")}{person.place_of_birth ? <span> | {person.place_of_birth}</span> : null}</p> : null}
                        {person.deathday ? <p>Died {formatDate(person.deathday, "long")}</p> : null}
                    </div>

                    {person.also_known_as?.length ? <p className="mt-2 text-foreground-secondary">Also known as: {person.also_known_as.join(", ")}</p> : null}

                    {person.biography ? (
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold mb-3">Biography</h2>
                            {isDescriptionCollapsed ? (
                                <div>
                                    <span className="text-foreground-secondary leading-relaxed">{person.biography.substring(0, 300)}... </span>
                                    <span className="cursor-pointer" onClick={() => setIsDescriptionCollapsed(false)}>See more</span>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-foreground-secondary leading-relaxed whitespace-pre-line">{person.biography}</p>
                                    <span className="cursor-pointer" onClick={() => setIsDescriptionCollapsed(true)}>See less</span>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            {personCombinedCreditsQuery.isLoading ? <Loading /> : null}
            {personCombinedCreditsQuery.error ? <Error message={personCombinedCreditsQuery.error.message} /> : null}
            {!personCombinedCreditsQuery.isLoading && !personCombinedCreditsQuery.error ? (
                <div className="mt-10 flex flex-col gap-10">
                    {cast.length ? (
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Cast ({cast.length})</h2>
                            <CreditGrid credits={cast} />
                        </section>
                    ) : null}
                    {crew.length ? (
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Crew ({crew.length})</h2>
                            <CreditGrid credits={crew} />
                        </section>
                    ) : null}
                    {!cast.length && !crew.length ? <p className="text-foreground-secondary">No cast found.</p> : null}
                </div>
            ) : null}
        </div>
    );
}
