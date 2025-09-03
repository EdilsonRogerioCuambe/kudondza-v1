import React from "react";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
