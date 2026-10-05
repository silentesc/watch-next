import { Link } from "@tanstack/react-router";
import { Person, type PersonProps } from "../Person";
import { ArrowCircleRightIcon } from "../icons/Icons";
import type { SeeMoreLinkOptions } from "./SeeMoreHorizontalList";

interface PersonHorizontalListProps {
    people: Array<PersonProps>;
    maxPeopleDisplayed: number;
    seeMoreLinkOptions: SeeMoreLinkOptions;
}

export function PersonHorizontalList({ people, maxPeopleDisplayed, seeMoreLinkOptions }: PersonHorizontalListProps) {
    if (!people || people.length < 1) {
        return null;
    }

    const shown = people.slice(0, maxPeopleDisplayed);
    const last = people.length > maxPeopleDisplayed ? people.at(maxPeopleDisplayed) : undefined;

    return (
        <div className="flex flex-col gap-3 bg-background-secondary rounded-lg">
            <div className="flex gap-3 flex-wrap sm:flex-nowrap sm:overflow-x-auto">
                {shown.map((p) => (
                    <div key={`${p.name}-${p.description}`} className="min-w-full sm:min-w-55">
                        <Person id={p.id} name={p.name} imgPath={p.imgPath} description={p.description} />
                    </div>
                ))}
                {
                    last ? (
                        <div className="relative min-w-full sm:min-w-55">
                            <div className="blur-sm select-none pointer-events-none">
                                <Person key={`${last.name}-${last.description}`} id={last.id} name={last.name} imgPath={last.imgPath} description={last.description} />
                            </div>
                            <Link {...seeMoreLinkOptions} className="absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer flex gap-1 items-center">
                                <span className="font-semibold">See more</span>
                                <ArrowCircleRightIcon className="w-5" />
                            </Link>
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}
