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

const loadingKeys: Set<string> = new Set();

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

    const selectedKeys = new Set(Array.from(mediaItemCustomListIds, (id) => String(id)));
    const values = new Map(customListsQuery.data.map((customList) => [String(customList.id), customList.name]));

    const toggleList = async (listIdString: string) => {
        const listId = Number(listIdString);
        const isInList = mediaItemCustomListIds.has(listId);

        loadingKeys.add(listIdString);

        if (isInList) {
            await deleteCustomListItem.mutateAsync({ listId, item });
        } else {
            await addCustomListItem.mutateAsync({ listId, item });
        }

        loadingKeys.delete(listIdString);
    };

    const mutationError = addCustomListItem.error || deleteCustomListItem.error;

    return (
        <div className="w-fit flex flex-col gap-2 items-start">
            <MultiSelectDropdown
                placeholder="Lists"
                selectedKeys={selectedKeys}
                loadingKeys={loadingKeys}
                values={values}
                onSelect={toggleList}
                onDeselect={toggleList}
            />
            {mutationError ? <Error message={mutationError.message} /> : null}
        </div>
    );
}
