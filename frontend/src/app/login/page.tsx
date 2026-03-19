//frontend/src/app/login/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  const from = searchParams.get("from");
  const destination = from && from.startsWith("/") ? from : "/";

  // Already authenticated — send them where they were going.
  useEffect(() => {
    if (isLoading) return;
    if (user) {
      console.log("[LoginPage] already authenticated, redirecting to", destination);
      router.replace(destination);
    }
  }, [isLoading, user, router, destination]);

  function handleClose() {
    router.push(destination);
  }

  // Show nothing while we determine auth state, to avoid modal flash.
  if (isLoading) return null;

  // Authenticated — render nothing while the redirect effect fires.
  if (user) return null;

  return <LoginModal isOpen={true} onClose={handleClose} />;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
