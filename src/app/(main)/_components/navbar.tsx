"use client";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import {
  BookOpen,
  Home,
  Info,
  LayoutDashboard,
  Loader,
  LogIn,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import UserDropdown from "./user-dropdown";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Cursos", href: "/courses", icon: BookOpen },
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Comunidades", href: "/communities", icon: Users },
  { name: "Sobre", href: "/about", icon: Info },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center justify-between mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 sm:space-x-3 group"
        >
          <div className="relative">
            <Image
              src="/Kudondza.svg"
              alt="Kudondza"
              className="size-8 sm:size-10 rounded-lg transition-transform group-hover:scale-105"
              width={40}
              height={40}
              priority
            />
          </div>
          <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Kudondza
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:flex-1 lg:justify-center lg:items-center">
          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-primary group"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
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
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/signin"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Entrar
              </Link>
              <Link
                href="/auth/signin"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                })}
              >
                Começar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-1.5 sm:p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Actions */}
            <div className="pt-3 sm:pt-4 border-t space-y-2 sm:space-y-3">
              {isPending ? (
                <div className="flex items-center justify-center py-3 sm:py-4">
                  <Loader className="size-4 sm:size-5 animate-spin text-muted-foreground" />
                </div>
              ) : session ? (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 bg-accent/50 rounded-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {session.user.name || session.user.email.split("@")[0]}
                      </div>
                      <div className="text-muted-foreground text-xs truncate">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
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
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/signin"
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "w-full flex items-center justify-center space-x-2 text-sm",
                    })}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    href="/auth/signin"
                    className={buttonVariants({
                      variant: "default",
                      className:
                        "w-full flex items-center justify-center space-x-2 text-sm",
                    })}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Começar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
