"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, slideUp } from "@/animations/variants";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const EXAMPLE_TERMS = [
  { original: "Bond required before tenancy begins.", simplified: "You need to pay a refundable security deposit before you can move in. In Australia, this is usually 4 weeks' rent." },
  { original: "Indemnification clause applies.", simplified: "You agree to be responsible if something goes wrong because of your actions." },
  { original: "Subject to means-tested eligibility.", simplified: "You can only get this if your income and savings are below a certain amount." },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background grid decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left column — headline + CTA */}
          <div className="space-y-8">
            <motion.div variants={staggerItem} className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-50 px-4 py-1.5 text-sm font-bold text-brand-700 shadow-brutal-sm">
                <Zap className="h-3.5 w-3.5 fill-current" />
                Powered by Gemma 4 · Runs on your device
              </span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
            >
              Finally
              <br />
              <span className="text-gradient">understand</span>
              <br />
              your documents.
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Housing contracts. Government forms. Medical paperwork.{" "}
              <strong className="text-foreground">Percepta explains what they actually mean</strong> — in plain language and your own cultural context.
            </motion.p>

            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
              <Link href="/upload">
                <Button size="xl" className="w-full sm:w-auto gap-2 font-black">
                  <Upload className="h-5 w-5" />
                  Upload Your Document
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <span>Private. Offline. Never leaves your device.</span>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-3">
              {[
                { icon: Globe, label: `${SUPPORTED_LANGUAGES.length} languages` },
                { icon: Zap, label: "Under 30 seconds" },
                { icon: Shield, label: "100% local AI" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — example card */}
          <motion.div variants={staggerItem} className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Example — Rental Agreement
            </p>
            {EXAMPLE_TERMS.map((term, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                className="card-brutal p-5 space-y-3"
              >
                <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground font-mono">
                  &ldquo;{term.original}&rdquo;
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-primary border border-black flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {term.simplified}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
