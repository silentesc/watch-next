import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import { useAddCustomListItem } from "../../hooks/customLists/use_add_custom_list_item";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useDeleteCustomListItem } from "../../hooks/customLists/use_delete_custom_list_item";
import { useMediaItemCustomLists } from "../../hooks/mediaItems/use_media_item_custom_lists";
import { Dropdown } from "./Dropdown";
import { Error } from "./Error";
import { Loading } from "./Loading";

interface CustomListPickerProps {
    item: AddCustomListItemRequest;
}

export function CustomListPicker({ item }: CustomListPickerProps) {
    const customListsQuery = useCustomLists();
    const mediaItemCustomListsQuery = useMediaItemCustomLists(item.kind, item.external_source, item.external_id);
    const addCustomListItem = useAddCustomListItem();
    const deleteCustomListItem = useDeleteCustomListItem();
    const queryError = customListsQuery.error || mediaItemCustomListsQuery.error;

    if (queryError) {
        return <Error message={queryError.message} />;
    }

    if (customListsQuery.isLoading || mediaItemCustomListsQuery.isLoading) {
        return <Loading />;
    }
    if (!customListsQuery.data?.length) {
        return null;
    }

    const mediaItemCustomListIds = new Set((mediaItemCustomListsQuery.data ?? []).map((customList) => customList.id));
    const values = new Map(customListsQuery.data.map((customList) => {
        const isInList = mediaItemCustomListIds.has(customList.id);

        return [String(customList.id), `${isInList ? "✓ " : ""}${customList.name}`];
    }));

    const toggleList = (listIdString: string) => {
        const listId = Number(listIdString);
        const isInList = mediaItemCustomListIds.has(listId);

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
