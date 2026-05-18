"use client";

import { motion } from "framer-motion";
import { Home, FileText, Heart, Briefcase, Landmark, GraduationCap } from "lucide-react";
import { staggerContainer, staggerItem } from "@/animations/variants";

const DOCUMENT_TYPES = [
  { icon: Home, label: "Rental Agreements", desc: "Bonds, lease terms, tenant rights", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { icon: FileText, label: "Government Forms", desc: "Visas, benefits, registrations", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { icon: Heart, label: "Medical Paperwork", desc: "Consent forms, discharge papers", color: "bg-red-50 text-red-700 border-red-200" },
  { icon: Briefcase, label: "Work Contracts", desc: "Employment terms, entitlements", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { icon: Landmark, label: "Banking Documents", desc: "Loan agreements, account terms", color: "bg-green-50 text-green-700 border-green-200" },
  { icon: GraduationCap, label: "Education Forms", desc: "Enrolment, scholarships, policies", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

export function DocumentTypesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-12"
        >
          <motion.div variants={staggerItem} className="space-y-3 max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight">
              Works for the documents that matter most.
            </h2>
            <p className="text-lg text-muted-foreground">
              The documents that change your life are often the ones hardest to understand. Percepta focuses on the ones that affect real people every day.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {DOCUMENT_TYPES.map((doc) => (
              <motion.div
                key={doc.label}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border-2 p-5 space-y-3 transition-all duration-200 cursor-default ${doc.color}`}
              >
                <doc.icon className="h-7 w-7" />
                <div>
                  <p className="font-bold text-sm">{doc.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{doc.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
