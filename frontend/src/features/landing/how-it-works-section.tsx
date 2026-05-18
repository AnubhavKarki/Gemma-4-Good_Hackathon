"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, LayoutList } from "lucide-react";
import { staggerContainer, staggerItem } from "@/animations/variants";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your document",
    description: "Drop in a PDF, photo, or scan. Any format works — even blurry phone photos.",
    color: "bg-brand-100 border-brand-300",
    iconColor: "text-brand-700",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Local AI reads it",
    description: "Gemma 4 E4B runs entirely on your device. Your document is never sent to any server.",
    color: "bg-warm-100 border-warm-300",
    iconColor: "text-warm-700",
  },
  {
    number: "03",
    icon: LayoutList,
    title: "You get plain answers",
    description: "Not a translation. Real explanations — what it means, what you need to do, what to watch out for.",
    color: "bg-purple-100 border-purple-300",
    iconColor: "text-purple-700",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-muted/40 border-y-2 border-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-12"
        >
          <motion.div variants={staggerItem} className="text-center space-y-3">
            <h2 className="text-4xl font-black tracking-tight">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Three steps. Under a minute. Finally peace of mind.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="card-brutal p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 border-2 ${step.color}`}>
                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <span className="text-5xl font-black text-black/10">{step.number}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
