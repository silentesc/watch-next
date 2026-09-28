import { Button } from "./Button";
import { Dropdown } from "./Dropdown";
import { ArrowDownIcon } from "./icons/Icons";

interface SortByProps {
    sortByKey: string;
    isAsc: boolean;
    sortByValues: Map<string, string>;
    onSortByChange: (sortBy: string) => void;
    onAscChange: (isAsc: boolean) => void;
    alignedRight?: boolean;
    descDefault?: boolean;
}

export function SortBy({ sortByKey, isAsc, sortByValues, onSortByChange, onAscChange, alignedRight = false }: SortByProps) {
    return (
        <div className="flex">
            <div className="flex space-x-4">
            </div>

            <Button onClick={() => onAscChange(!isAsc)} value={
                <ArrowDownIcon
                    className={`w-5 h-5 transition-colors duration-200 ${!isAsc ? "rotate-180" : null}`}
                />
            } />
            <Dropdown title={sortByValues.get(sortByKey) || sortByKey} values={sortByValues} onSelect={key => onSortByChange(key)} alignedRight={alignedRight} />
        </div>
    );
}
