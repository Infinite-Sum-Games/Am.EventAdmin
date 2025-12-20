import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    User,
    School,
    Phone,
    Mail,
    CheckCircle2,
    XCircle,
    MapPin,
    Loader2
} from "lucide-react";
import type { Transaction } from "@/types/transactions";

interface TransactionCardProps {
    transaction: Transaction;
    onVerify?: (id: string) => void;
    isVerifying?: boolean;
}

export function TransactionCard({ transaction, onVerify, isVerifying }: TransactionCardProps) {
    // Logic to render the Right-Side Action or Status Label
    const renderStatusAction = () => {
        switch (transaction.txn_status) {
            case "PENDING":
                return (
                    <Button
                        variant="default"
                        className="w-full"
                        onClick={() => onVerify && onVerify(transaction.transaction_id)}
                    >
                        {isVerifying ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            "Verify Payment"
                        )}
                    </Button>
                );
            case "SUCCESS":
                return (
                    <div className="flex items-center justify-center w-full px-4 h-9 rounded-md text-green-100 border-2 border-dashed border-green-500/80 bg-green-500/10 font-medium text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        SUCCESS
                    </div>
                );
            case "FAILED":
                return (
                    <div className="flex items-center justify-center w-full px-4 py-2 h-9 rounded-md text-red-100 border-2 border-dashed border-red-500/80 bg-red-500/10 font-medium text-sm">
                        <XCircle className="w-4 h-4 mr-2" />
                        FAILED
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 border-muted p-0">
            <CardContent className="py-2 px-4 flex flex-row gap-2 items-center justify-between">

                {/* Left: Event Name, ID & PRICE */}
                <div className="flex flex-col space-y-1 w-[350px]">
                    
                    {/* Transaction ID with Copy */}
                    <span className="font-mono text-muted-foreground text-xs">
                        {transaction.transaction_id}
                    </span>

                    {/* Event Name */}
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">
                        {transaction.event_name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-1 font-semibold">
                        <span>₹{transaction.registration_fee}</span>
                    </div>


                </div>

                {/* Middle: Student Details */}
                <div className="flex-1 flex-col gap-2 border-l px-6 py-2 border-r font-medium">
                    {/* Student Name */}
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {transaction.student_name}
                    </div>

                    <div className="flex flex-row items-center gap-2 text-sm mt-1">
                        <div className="flex items-center gap-2">
                            {/* Email */}
                            <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" /> {transaction.email}
                            </span>
                            {/* Phone */}
                            <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" /> {transaction.student_phone_number}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm mt-1">
                        {/* College Name */}
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <School className="w-4 h-4" />
                            <span className="truncate max-w-[180px]" title={transaction.college_name}>
                                {transaction.college_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{transaction.college_city}</span>
                        </div>
                    </div>

                </div>

                {/* Right: Action/Status Area */}
                <div className="pl-2 flex-[0.2] items-center justify-center w-full">
                    {renderStatusAction()}
                </div>

            </CardContent>
        </Card>
    );
}