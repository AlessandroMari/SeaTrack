
"use client";

import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, LogIn, Loader2 } from 'lucide-react';
import SeaTrackHeader from '@/app/(components)/sea-track-header';
import { useToast } from "@/hooks/use-toast";

// IMPORTANT: For development only. Replace with a robust auth system for production.
// You should set this in your .env.local file: NEXT_PUBLIC_ADMIN_PASSWORD=yoursecurepassword
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "seatrackadmindefault"; 

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordAttempt, setPasswordAttempt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check localStorage
  const [authError, setAuthError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for persisted auth state
    const storedAuth = localStorage.getItem('seatrackAdminAuthenticated_v1');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
       // Check if the password is the default one and show a warning
      if (ADMIN_PASSWORD === "seatrackadmindefault") {
        toast({
          title: "Security Warning",
          description: "You are using the default admin password. Please set NEXT_PUBLIC_ADMIN_PASSWORD in your .env.local file.",
          variant: "destructive",
          duration: 10000,
        });
      }
    }
    setIsLoading(false);
  }, [toast]);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
        setAuthError('Admin password is not configured. Please contact support.');
        toast({
            title: "Configuration Error",
            description: "Admin password environment variable is not set.",
            variant: "destructive",
        });
        return;
    }
    if (passwordAttempt === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('seatrackAdminAuthenticated_v1', 'true'); // Persist auth
      setAuthError('');
      toast({ title: "Success", description: "Logged in to admin area." });
       if (ADMIN_PASSWORD === "seatrackadmindefault") {
        toast({
          title: "Security Warning",
          description: "You are using the default admin password. Please set NEXT_PUBLIC_ADMIN_PASSWORD in your .env.local file for better security.",
          variant: "destructive",
          duration: 10000,
        });
      }
    } else {
      setAuthError('Incorrect password. Please try again.');
      setPasswordAttempt('');
      toast({ title: "Login Failed", description: "Incorrect password.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <SeaTrackHeader />
        <Loader2 className="h-12 w-12 animate-spin text-primary mt-8" />
        <p className="mt-4 text-muted-foreground">Loading admin area...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <SeaTrackHeader />
        <Card className="w-full max-w-md shadow-xl mt-8">
          <CardHeader className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-2xl">Admin Area Access</CardTitle>
            <CardDescription>Please enter the password to proceed.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={passwordAttempt}
                  onChange={(e) => setPasswordAttempt(e.target.value)}
                  className="w-full text-base"
                  aria-label="Admin password"
                />
              </div>
              {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
              <Button type="submit" className="w-full text-lg py-3">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
            </form>
            {ADMIN_PASSWORD === "seatrackadmindefault" && (
                <p className="text-xs text-destructive text-center mt-4">
                    Warning: Using default password. Set NEXT_PUBLIC_ADMIN_PASSWORD in .env.local.
                </p>
            )}
          </CardContent>
        </Card>
         <footer className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SeaTrack Project. Admin Panel.</p>
        </footer>
      </div>
    );
  }

  return <>{children}</>;
}
