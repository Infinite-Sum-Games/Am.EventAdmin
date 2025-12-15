import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, AlertCircle } from 'lucide-react';
import {  useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { axiosClient } from '@/lib/axios';
import { PeopleSchema } from '@/schemas/people';
import type { People } from '@/types/people';

interface EditPersonFormProps {
    personId: string;
    initialData: People;
    onSuccess: () => void;
}

export function EditPersonForm({ personId, initialData, onSuccess }: EditPersonFormProps) {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phone_number || "",
        profession: initialData.profession || "",
    });
    
    const [formError, setFormError] = useState<string | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: typeof formData) => {
            const payload = {
                name: data.name,
                email: data.email,
                phone_number: data.phoneNumber,
                profession: data.profession,
            };


            // Validate before sending
            const validated = PeopleSchema.safeParse(payload);
            if (!validated.success) {
                const messages = validated.error.issues
                    .map(issue => issue.message)
                    .join("; ");
                console.log("Validation failed:", messages);
                throw new Error(messages);
            }
            const response = await axiosClient.put(api.UPDATE_PEOPLE(personId), validated.data);
            return response.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError: (error: any) => {
            setFormError(error.message || "Failed to update person. Please try again.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        mutate(formData);
    };

    const updateField = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form className="grid gap-4 pt-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => updateField('name', e.target.value)} 
                    placeholder="e.g., Dr. Arjun Rao" 
                    required 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => updateField('email', e.target.value)} 
                    placeholder="e.g., arjun@univ.edu" 
                    required 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                    id="phoneNumber" 
                    type="tel" 
                    value={formData.phoneNumber} 
                    onChange={(e) => updateField('phoneNumber', e.target.value)} 
                    placeholder="e.g., 9000011111" 
                    required 
                />
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="profession">Profession / Title</Label>
                <Input 
                    id="profession" 
                    value={formData.profession} 
                    onChange={(e) => updateField('profession', e.target.value)} 
                    placeholder="e.g., Professor" 
                />
            </div>

            {formError && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {formError}
                </div>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
                {isPending ? "Updating..." : "Update Person"}
                {!isPending && <Save className="ml-2 h-4 w-4" />}
            </Button>
        </form>
    );
}