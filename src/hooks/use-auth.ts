"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  image?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Usar fetch para chamar a API de sessão
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const session = await response.json();
          if (session?.user && typeof session.user === "object") {
            // Validar se todos os campos obrigatórios existem
            const userData = session.user as Record<string, unknown>;
            if (userData.id && userData.name && userData.email) {
              setUser({
                id: String(userData.id),
                name: String(userData.name),
                email: String(userData.email),
                role:
                  (userData.role as "ADMIN" | "INSTRUCTOR" | "STUDENT") ||
                  "STUDENT",
                image: (userData.image as string | null) || null,
              });
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, isLoading };
}
