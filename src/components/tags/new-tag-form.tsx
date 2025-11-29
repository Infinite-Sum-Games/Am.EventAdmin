import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface NewTagFormProps {
  onSuccess: () => void; // Callback to be called on successful submission
}

export function NewTagForm({ onSuccess }: NewTagFormProps) {
    const [tagName, setTagName] = useState("");
    const [tagAbbrevation, setTagAbbrevation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddNewTag = () => {
        if (!tagName || !tagAbbrevation) {
            alert("Please fill out both fields.");
            return;
        }
        setIsSubmitting(true);
        console.log("Simulating new tag creation:", { tagName, tagAbbrevation });
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`(Simulated) Successfully created tag: ${tagName}`);
            onSuccess(); // Call the parent's success callback
        }, 1000);
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Tag"}
                {!isSubmitting && <PlusCircle className="ml-2 h-4 w-4" />}
            </Button>
        </form>
    );
}
