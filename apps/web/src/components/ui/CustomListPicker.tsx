import { useQueries } from "@tanstack/react-query";
import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import { getCustomListItems } from "../../api/customLists/getCustomListItems";
import { useAddCustomListItem } from "../../hooks/customLists/use_add_custom_list_item";
import { customListItemsQueryKey } from "../../hooks/customLists/use_custom_list_items";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useDeleteCustomListItem } from "../../hooks/customLists/use_delete_custom_list_item";
import { Dropdown } from "./Dropdown";
import { Error } from "./Error";

interface CustomListPickerProps {
    item: AddCustomListItemRequest;
}

export function CustomListPicker({ item }: CustomListPickerProps) {
    const customListsQuery = useCustomLists();
    const addCustomListItem = useAddCustomListItem();
    const deleteCustomListItem = useDeleteCustomListItem();

    const customListItemsQueries = useQueries({
        queries: (customListsQuery.data ?? []).map((customList) => ({
            queryKey: customListItemsQueryKey(customList.id),
            queryFn: () => getCustomListItems(customList.id),
            staleTime: 60 * 1000,
            retry: false,
        })),
    });

    if (customListsQuery.error) {
        return <Error message={customListsQuery.error.message} />;
    }

    if (customListsQuery.isLoading || !customListsQuery.data?.length) {
        return null;
    }

    const values = new Map(customListsQuery.data.map((customList, index) => {
        const isInList = customListItemsQueries[index]?.data?.some((listItem) =>
            listItem.kind === item.kind &&
            listItem.external_source === item.external_source &&
            listItem.external_id === item.external_id
        ) ?? false;

        return [String(customList.id), `${isInList ? "✓ " : ""}${customList.name}`];
    }));

    const toggleList = (listIdString: string) => {
        const listId = Number(listIdString);
        const listIndex = customListsQuery.data.findIndex((customList) => customList.id === listId);
        const isInList = customListItemsQueries[listIndex]?.data?.some((listItem) =>
            listItem.kind === item.kind &&
            listItem.external_source === item.external_source &&
            listItem.external_id === item.external_id
        ) ?? false;

        if (isInList) {
            deleteCustomListItem.mutate({ listId, item });
        } else {
            addCustomListItem.mutate({ listId, item });
        }
    };

    const mutationError = addCustomListItem.error || deleteCustomListItem.error;

    return (
        <div className="mt-1 flex flex-col items-center gap-2 sm:items-start">
            <Dropdown
                title="Custom Lists"
                values={values}
                onSelect={toggleList}
                closeOnSelect={false}
            />
            {mutationError ? <Error message={mutationError.message} /> : null}
        </div>
    );
}
