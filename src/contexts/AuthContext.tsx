import { User, signInAnonymously } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  requireAuth: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthProvider = ({
  children,
  requireAuth = false,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user && requireAuth) {
        // Automatically sign in anonymously if auth is required
        try {
          await signInAnonymously(auth);
          // Don't need to setUser here as onAuthStateChanged will fire again
        } catch (error) {
          console.error("Error signing in anonymously:", error);
          setLoading(false);
        }
      } else {
        if (user) {
          setUser(user);
          const token = await user.getIdToken();
          console.log(token);
        }
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [requireAuth]);

  const signIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  };

  if (loading && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, requireAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
