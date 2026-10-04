import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import { useAddCustomListItem } from "../../hooks/customLists/use_add_custom_list_item";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useDeleteCustomListItem } from "../../hooks/customLists/use_delete_custom_list_item";
import { useMediaItemCustomLists } from "../../hooks/mediaItems/use_media_item_custom_lists";
import { Error } from "./Error";
import { Loading } from "./Loading";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

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

    const selectedKeys = Array.from(mediaItemCustomListIds, (id) => String(id));
    const values = new Map(customListsQuery.data.map((customList) => [String(customList.id), customList.name]));

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
        <div className="mt-1 w-fit flex flex-col gap-2 items-start">
            <span className="text-lg font-medium">Custom lists</span>
            <MultiSelectDropdown
                placeholder="Add to custom list"
                selectedKeys={selectedKeys}
                values={values}
                onSelect={toggleList}
                onDeselect={toggleList}
            />
            {mutationError ? <Error message={mutationError.message} /> : null}
        </div>
    );
}
