import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface NewPersonFormProps {
  onSuccess: () => void;
}

export function NewPersonForm({ onSuccess }: NewPersonFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profession, setProfession] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddNewPerson = () => {
        if (!name || !email || !phoneNumber) {
            alert("Please fill out Name, Email, and Phone Number.");
            return;
        }
        setIsSubmitting(true);
        console.log("Simulating new person creation:", { name, email, phoneNumber, profession });
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`(Simulated) Successfully created person: ${name}`);
            onSuccess();
        }, 1000);
    };

    return (
        <form className="grid gap-4 pt-4" onSubmit={(e) => { e.preventDefault(); handleAddNewPerson(); }}>
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Dr. Arjun Rao" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., arjun@univ.edu" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g., 9000011111" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="profession">Profession / Title</Label>
                <Input id="profession" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="e.g., Professor, Industry Expert" />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Person"}
                {!isSubmitting && <PlusCircle className="ml-2 h-4 w-4" />}
            </Button>
        </form>
    );
}
