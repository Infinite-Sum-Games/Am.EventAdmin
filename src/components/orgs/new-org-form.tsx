import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import type { OrganizerType } from '@/types/db';

interface NewOrgFormProps {
  onSuccess: () => void;
}

export function NewOrgForm({ onSuccess }: NewOrgFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [orgType, setOrgType] = useState<OrganizerType | "">("");
    const [studentHead, setStudentHead] = useState("");
    const [facultyHead, setFacultyHead] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddNewOrg = () => {
        if (!name || !email || !orgType || !studentHead || !facultyHead) {
            alert("Please fill out all required fields.");
            return;
        }
        setIsSubmitting(true);
        console.log("Simulating new organizer creation:", { name, email, orgType, studentHead, facultyHead });
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`(Simulated) Successfully created organizer: ${name}`);
            onSuccess();
        }, 1000);
    };

    return (
        <form className="grid gap-4 pt-4" onSubmit={(e) => { e.preventDefault(); handleAddNewOrg(); }}>
            <div className="grid gap-2">
                <Label htmlFor="name">Organizer Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Computer Science Department" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Official Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., cse@univ.edu" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="orgType">Organizer Type</Label>
                <Select value={orgType} onValueChange={(value) => setOrgType(value as OrganizerType)}>
                    <SelectTrigger id="orgType">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="DEPARTMENT">Department</SelectItem>
                        <SelectItem value="CLUB">Club</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="studentHead">Student Head Name</Label>
                <Input id="studentHead" value={studentHead} onChange={(e) => setStudentHead(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="facultyHead">Faculty Head Name</Label>
                <Input id="facultyHead" value={facultyHead} onChange={(e) => setFacultyHead(e.target.value)} placeholder="Dr. Smith" required />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Organizer"}
                {!isSubmitting && <PlusCircle className="ml-2 h-4 w-4" />}
            </Button>
        </form>
    );
}
