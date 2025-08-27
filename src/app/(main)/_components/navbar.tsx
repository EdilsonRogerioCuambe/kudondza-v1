"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import UserDropdown from "./user-dropdown";

interface NavigationItem {
  name: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "Cursos", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Comunidade", href: "/community" },
  { name: "Sobre", href: "/about" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image
            src="/Kudondza.svg"
            alt="Kudondza"
            className="size-9 rounded"
            width={36}
            height={36}
            priority
          />
          <span className="font-bold">Kudondza</span>
        </Link>

        <nav className="hidden md:flex md:flex-1 md:justify-between md:items-center">
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? (
              <span className="text-sm text-muted-foreground">
                <Loader className="inline size-4 animate-spin" />
              </span>
            ) : session ? (
              <UserDropdown
                name={
                  session.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session.user.email.split("@")[0]
                }
                email={session.user.email}
                image={
                  session.user.image ??
                  `https://avatar.vercel.sh/${session.user.email}`
                }
              />
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className={buttonVariants({
                    variant: "outline",
                  })}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/signin"
                  className={buttonVariants({
                    variant: "default",
                  })}
                >
                  Começar
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
