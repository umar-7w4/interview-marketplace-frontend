import { useSession, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return {
    user: session?.user,
    loading,
    isAuthenticated: !!session,
    signOut,
  };
}
