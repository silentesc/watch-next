import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Error } from "../../components/ui/Error";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/Loading";
import { Popup } from "../../components/ui/Popup";
import { useCreateTag } from "../../hooks/tags/use_create_tag";
import { useTags } from "../../hooks/tags/use_tags";
import { TagCard } from "../../components/ui/cards/TagCard";

export function TagsOverviewPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const createTag = useCreateTag();
    const tagsQuery = useTags();

    if (tagsQuery.error) {
        return <Error message={tagsQuery.error.message} />
    }
    if (tagsQuery.isLoading) {
        return <Loading />
    }
    if (!tagsQuery.data) {
        return <Error message="No data returned" />
    }

    const tags = tagsQuery.data;

    const submitNewTag = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        createTag.mutate(trimmedName, {
            onSuccess: ({ }) => {
                setIsCreating(false);
                setName("");
            },
        });
    };

    return (
        <>
            <div className="mb-8 border-b border-background-tertiary p-2 pb-6">
                <div className="flex flex-wrap justify-between">
                    <h1 className="text-3xl font-semibold">Tags</h1>
                    <Button value={"New tag"} fullWidth={false} onClick={() => setIsCreating(true)} />
                </div>
                <p className="mt-2 text-foreground-secondary">
                    {tags.length} {tags.length === 1 ? "tag" : "tags"}
                </p>
            </div>

            {
                tags.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {tags.map(tag => <TagCard key={tag.id} tag={tag} />)}
                    </div>
                ) : (
                    <p className="text-foreground-secondary">No tags yet</p>
                )
            }

            {isCreating ? (
                <Popup onClose={() => setIsCreating(false)} value={
                    <form className="flex flex-col gap-4" onSubmit={submitNewTag}>
                        {createTag.isPending ? <Loading /> : null}
                        <h2 className="text-2xl font-semibold">New tag</h2>
                        <Input
                            autoFocus
                            aria-label="Tag name"
                            placeholder="Tag name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                        {createTag.error ? <Error message={createTag.error.message} /> : null}
                        <div className="flex justify-end gap-2">
                            <Button value="Cancel" fullWidth={false} disabled={createTag.isPending} onClick={() => setIsCreating(false)} />
                            <Button value="Create" type="submit" fullWidth={false} variant="primary" disabled={!name.trim() || createTag.isPending} />
                        </div>
                    </form>
                } />
            ) : null}
        </>
    );
}
