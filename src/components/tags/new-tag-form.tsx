import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { axiosClient } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TagSchema } from "@/schemas/tags";
import { set } from 'zod';

interface NewTagFormProps {
  onSuccess: () => void;
}

export function NewTagForm({ onSuccess }: NewTagFormProps) {
    const [tagName, setTagName] = useState("");
    const [tagAbbrevation, setTagAbbrevation] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: async (newTag: { name: string; abbreviation: string }) => {
            const validatedTag = TagSchema.safeParse(newTag);
            if (!validatedTag.success) {
                    const messages = validatedTag.error.issues
                        .map(issue => issue.message)
                        .join(", ");
                    throw new Error(messages);
                }
            const response = await axiosClient.post(api.CREATE_TAG, validatedTag.data);
            return response.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError: (err: any) => {
            if (err.response?.status === 400) {
                setError("Invalid input. Please check your fields.");
            } else {
                setError(err.message || "Failed to create tag.");
            }
        }
    });

    const handleAddNewTag = () => {
        setError(null);
        if (!tagName || !tagAbbrevation) {
            setError("Please fill out both fields.");
            return;
        }
        mutate({
            name: tagName,
            abbreviation: tagAbbrevation
        });
    };

    return (
        <form className="grid gap-6 pt-4" onSubmit={(e) => { e.preventDefault(); handleAddNewTag(); }}>
            <div className="grid gap-2">
                <Label htmlFor="tagAbbrevation">Tag Abbreviation</Label>
                <p className="text-sm font-extralight text-muted-foreground">
                    A short, unique identifier for the tag (e.g., "TECH").
                </p>
                <Input
                    type="text"
                    id="tagAbbrevation"
                    value={tagAbbrevation}
                    placeholder="TECH"
                    onChange={(e) => setTagAbbrevation(e.target.value.toUpperCase())}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tagName">Tag Name</Label>
                <p className="text-sm font-extralight text-muted-foreground">
                    The full, descriptive name of the tag.
                </p>
                <Input
                    type="text"
                    id="tagName"
                    value={tagName}
                    placeholder="Technology"
                    onChange={(e) => setTagName(e.target.value)}
                    required
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}
            
           <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Tag"}
                {!isPending && <PlusCircle className="ml-2 h-4 w-4" />}
            </Button>
        </form>
    );
}
