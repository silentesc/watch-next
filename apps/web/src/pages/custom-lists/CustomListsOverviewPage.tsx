import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { CustomListCard } from "../../components/ui/CustomListCard";
import { Error } from "../../components/ui/Error";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/Loading";
import { Popup } from "../../components/ui/Popup";
import { useCreateCustomList } from "../../hooks/customLists/use_create_custom_list";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";

export function CustomListsOverviewPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const createCustomList = useCreateCustomList();
    const customListsQuery = useCustomLists();

    if (customListsQuery.error) {
        return <Error message={customListsQuery.error.message} />
    }
    if (customListsQuery.isLoading) {
        return <Loading />
    }
    if (!customListsQuery.data) {
        return <Error message="No data returned" />
    }

    const lists = customListsQuery.data;

    const submitNewList = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        createCustomList.mutate(trimmedName, {
            onSuccess: ({ }) => setIsCreating(false),
        });
    };

    return (
        <>
            <div className="mb-8 border-b border-background-tertiary p-2 pb-6">
                <div className="flex flex-wrap justify-between">
                    <h1 className="text-3xl font-semibold">Custom Lists</h1>
                    <Button value={"New list"} fullWidth={false} onClick={() => setIsCreating(true)} />
                </div>
                <p className="mt-2 text-foreground-secondary">
                    {lists.length} {lists.length === 1 ? "list" : "lists"}
                </p>
            </div>

            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] justify-items-center">
                {lists.map(list => <CustomListCard key={list.id} customList={list} />)}
            </div>

            {isCreating ? (
                <Popup onClose={() => setIsCreating(false)} value={
                    <form className="flex flex-col gap-4" onSubmit={submitNewList}>
                        <h2 className="text-2xl font-semibold">New list</h2>
                        <Input
                            autoFocus
                            aria-label="List name"
                            placeholder="List name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                        {createCustomList.error ? <Error message={createCustomList.error.message} /> : null}
                        <div className="flex justify-end gap-2">
                            <Button value="Cancel" fullWidth={false} disabled={createCustomList.isPending} onClick={() => setIsCreating(false)} />
                            <Button value="Create" type="submit" fullWidth={false} variant="primary" disabled={!name.trim() || createCustomList.isPending} />
                        </div>
                    </form>
                } />
            ) : null}
        </>
    );
}
