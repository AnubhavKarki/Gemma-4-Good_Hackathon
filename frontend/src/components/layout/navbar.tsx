"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, SUPPORTED_LANGUAGES } from "@/lib/constants";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full border-b-2 border-black bg-white/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary border-2 border-black shadow-brutal-sm group-hover:shadow-brutal group-hover:-translate-y-0.5 transition-all duration-200">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-accent/50 border border-border px-3 py-1.5 text-xs font-semibold text-accent-foreground">
              <Shield className="h-3.5 w-3.5" />
              Private & Local
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground ml-2">
              <Globe className="h-3.5 w-3.5" />
              {SUPPORTED_LANGUAGES.length} Languages
            </div>
          </nav>

          {/* CTA */}
          <Link href="/upload">
            <Button size="sm" className="font-bold">
              Upload Document
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
