import { Suspense } from "react";
import { LoginCard } from "@/components/auth/LoginCard";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "Sign in - Dynova",
  description: "Sign in to access your Dynova management panel",
};

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <Spinner size="lg" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginCard />
    </Suspense>
  );
}
