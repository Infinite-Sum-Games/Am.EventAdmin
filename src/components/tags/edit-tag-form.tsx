import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { api } from '@/lib/api';
import { TagSchema } from '@/schemas/tags';

interface Tag {
    id: string;
    name: string;
    abbreviation: string;
}

interface EditTagFormProps {
    tag: Tag;
    onSuccess: () => void;
}

export function EditTagForm({ tag, onSuccess }: EditTagFormProps) {
    const [tagName, setTagName] = useState("");
    const [tagAbbreviation, setTagAbbreviation] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTagName(tag.name);
        setTagAbbreviation(tag.abbreviation);
        setError(null);
    }, [tag]);

const { mutate, isPending } = useMutation({
        mutationFn: async (values: { name: string; abbreviation: string }) => {
                const validatedData = TagSchema.safeParse(values);
                if (!validatedData.success) {
                    const messages = validatedData.error.issues
                        .map(issue => issue.message)
                        .join(", ");
                    throw new Error(messages);
                }
                const response = await axiosClient.put(api.UPDATE_TAG(tag.id), validatedData.data);
                return response.data;
        },
        onSuccess: () => {
                onSuccess(); 
        },
        onError: (err: any) => {
                const status = err.response?.status;
                if (status === 404) {
                        setError("Tag no longer exists.");
                } else if (status === 400) {
                        setError("Invalid input. Please check your fields.");
                } else {
                        setError(err.message || "Failed to update tag.");
                }
        }
});

    const handleEditTag = () => {
        setError(null);
        if (!tagName || !tagAbbreviation) {
            setError("Please fill out both fields.");
            return;
        }
        
        mutate({
            name: tagName,
            abbreviation: tagAbbreviation
        });
    };

    return (
        <form className="grid gap-6 pt-4" onSubmit={(e) => { e.preventDefault(); handleEditTag(); }}>
            <div className="grid gap-2">
                <Label htmlFor="tagAbbreviation">Tag Abbreviation</Label>
                <p className="text-sm font-extralight text-muted-foreground">
                    A short, unique identifier for the tag (e.g., "TECH").
                </p>
                <Input
                    type="text"
                    id="tagAbbreviation"
                    value={tagAbbreviation}
                    maxLength={10}
                    minLength={3}
                    onChange={(e) => setTagAbbreviation(e.target.value.toUpperCase())}
                    disabled={isPending}
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
                    maxLength={50}
                    minLength={3}
                    onChange={(e) => setTagName(e.target.value)}
                    disabled={isPending}
                    required
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Updating..." : "Update Tag"}
                {!isPending && <Check className="ml-2 h-4 w-4" />}
            </Button>
        </form>
    );
}