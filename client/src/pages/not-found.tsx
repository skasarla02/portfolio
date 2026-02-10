import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h1 className="mb-2 font-display text-4xl font-bold tracking-tight">404 Page Not Found</h1>
      <p className="mb-8 text-muted-foreground">The page you are looking for does not exist.</p>
      
      <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        Return Home
      </Link>
    </div>
  );
}
