import { Mail, MapPin, GraduationCap, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Participant } from "@/types/participants";

// Helper function to generate initials from name
function getInitials(name: string): string {
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  
  return parts[0].charAt(0).toUpperCase();
}

// Helper function to generate avatar background color based on name
function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Column definitions for the table
export interface TableColumn {
  key: keyof Participant;
  label: string;
  width?: string;
  sortable?: boolean;
  hideOnMobile?: boolean;
  align?: 'left' | 'center' | 'right';
  render: (participant: Participant, index: number) => React.ReactNode;
}

export const participantsColumns: TableColumn[] = [
  {
    key: "student_name",
    label: "Name",
    width: "250px",
    sortable: true,
    align: 'left',
    render: (participant) => (
      <div className="flex items-center gap-3 px-1">
        <Avatar className="h-8 w-8">
          <AvatarFallback className={`${getAvatarColor(participant.student_name)} text-white text-xs font-semibold`}>
            {getInitials(participant.student_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium min-w-[250px] truncate">{participant.student_name}</span>
          {participant.team_name && (
            <span className="text-xs text-muted-foreground">
              Team: {participant.team_name}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "college",
    label: "College",
    width: "250px",
    sortable: true,
    align: 'center',
    render: (participant) => (
      <div className="flex items-center justify-center gap-2">
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
        <span className="max-w-[250px] truncate" title={participant.college}>
          {participant.college}
        </span>
      </div>
    ),
  },
  {
    key: "city",
    label: "City", 
    width: "250px",
    sortable: true,
    align: 'center',
    render: (participant) => (
      <div className="flex items-center justify-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="max-w-[250px] truncate" title={participant.city}>
          {participant.city}
        </span>
      </div>
    ),
  },
  {
    key: "phone_number",
    label: "Phone",
    width: "150px",
    sortable: true,
    align: "center",  
    render: (participant) => (
      <div className="flex items-center justify-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <a href={`tel:${participant.phone_number}`} className="hover:underline">
          {participant.phone_number}
        </a>
      </div>
    ),
  },
  {
    key: "email",
    label: "Email",
    width: "250px",
    sortable: true,
    align: 'right',
    render: (participant) => (
      <div className="flex justify-end items-center gap-2 px-1">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <a 
          href={`mailto:${participant.email}`}
          className="text-blue-600 hover:text-blue-800 underline max-w-[250px] truncate"
          title={participant.email}
        >
          {participant.email}
        </a>
      </div>
    ),
  },


];