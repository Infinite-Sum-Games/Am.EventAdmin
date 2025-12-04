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
import { axiosClient } from "@/lib/axios"; 
import secureLocalStorage from "react-secure-storage";
import { hashPassword } from "@/lib/hash"; 

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
        setErrorMsg("Please enter both email and password.");
        return;
    }

    setLoading(true);
    setErrorMsg("");

    const hashedPassword = await hashPassword(password);

    try {
      const response = await axiosClient.post(api.LOGIN, {
        email: email,
        password: hashedPassword,
      });

      const data = response.data;

      secureLocalStorage.clear();

      const userInfo = {
        userName: data.name,
        userEmail: data.email,
      };
      secureLocalStorage.setItem("u", JSON.stringify(userInfo));

      router.navigate({ to: "/dashboard", replace: true });

    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Admin Console</CardTitle>
          <CardDescription>
            Login with your college official email. Contact the dev team for
            password if you don't have one.
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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                {errorMsg && (
                    <div className="text-sm text-red-500 font-medium text-center">
                        {errorMsg}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
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
    </div>
  );
}