"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";
import secureLocalStorage from "react-secure-storage";
import { hashPassword } from "@/lib/hash";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email && password) {
                const DUMMY_TOKEN = "dummy-auth-token";
                const DUMMY_USER = {
                    userName: email.split('@')[0],
                    userEmail: email,
                };

                secureLocalStorage.clear();
                secureLocalStorage.setItem("t", DUMMY_TOKEN);
                secureLocalStorage.setItem("u", JSON.stringify(DUMMY_USER));

                router.navigate({ to: "/dashboard", replace: true });
            } else {
                alert("Please enter email and password.");
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Welcome to Admin Console
                    </CardTitle>
                    <CardDescription>
                        Login with your college official email. Contact the dev
                        team for password if you don't have one.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                    >
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your Amrita Email Address"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <a
                                            href="https://amritotsavam.cb.amrita.edu/resetPassword"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Login
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Visit Amritotsavam 2025?{" "}
                                <a
                                    href="https://amritotsavam.cb.amrita.edu"
                                    className="underline underline-offset-4"
                                >
                                    Click here
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
