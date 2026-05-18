"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Wifi, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/animations/variants";

const PRIVACY_POINTS = [
  {
    icon: Shield,
    title: "Your documents stay private",
    description: "Everything is processed locally on your device. Nothing is uploaded to cloud servers.",
  },
  {
    icon: Wifi,
    title: "Works offline",
    description: "Once the AI model is loaded, GemmaLens works with no internet connection at all.",
  },
  {
    icon: Lock,
    title: "No account required",
    description: "Just upload and go. No sign-ups, no tracking, no data harvesting.",
  },
];

export function PrivacySection() {
  return (
    <section className="py-20 bg-brand-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={staggerItem} className="space-y-6">
            <h2 className="text-4xl font-black tracking-tight">
              Your documents are yours.{" "}
              <span className="text-brand-300">Always.</span>
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Migrants, refugees, and international workers often share sensitive documents. GemmaLens was built with privacy as a non-negotiable. Gemma 4 E4B runs entirely on your machine — no cloud, no data collection, no surveillance.
            </p>
            <Link href="/upload">
              <Button size="lg" variant="secondary" className="gap-2 font-bold">
                Try it now — it&apos;s free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={staggerContainer} className="space-y-4">
            {PRIVACY_POINTS.map((point) => (
              <motion.div
                key={point.title}
                variants={staggerItem}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-400/20 border border-brand-400/30 shrink-0">
                  <point.icon className="h-5 w-5 text-brand-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white">{point.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
