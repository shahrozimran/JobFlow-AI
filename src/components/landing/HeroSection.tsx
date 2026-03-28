"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center min-h-[90vh]">
      {/* Subtle modern background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">Revolutionize your job search</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[1.05] mb-8">
            The resume that <br className="hidden md:block" />
            <span className="text-muted-foreground">gets you hired.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Stop being ignored by ATS systems. JobFlow AI optimizes your resume,
            matches you to jobs, and automates your outreach with unprecedented precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-[1.05rem] shadow-xl hover:shadow-2xl transition-all"
              >
                Start for free <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/features">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-secondary/50 backdrop-blur-md text-foreground font-semibold text-[1.05rem] border border-border/50 hover:bg-secondary transition-all"
              >
                See how it works
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Abstract App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative mx-auto max-w-4xl"
        >
          <div className="aspect-[16/9] rounded-2xl overflow-hidden glass-card border border-border/40 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-10 bg-secondary/80 border-b border-border/40 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-gold/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            {/* Mockup content */}
            <div className="pt-16 p-8 h-full flex gap-6 bg-background dark:bg-card">
              <div className="w-1/3 flex flex-col gap-4">
                <div className="h-8 rounded-md bg-secondary/80 w-3/4" />
                <div className="h-4 rounded-md bg-secondary/60 w-1/2" />
                <div className="flex-1 rounded-xl bg-secondary/30 border border-border/50" />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="h-48 rounded-xl bg-foreground/5 border border-border/50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <span className="text-success font-bold text-xl">96%</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 focus h-32 rounded-xl bg-secondary/30 border border-border/50" />
                  <div className="flex-1 focus h-32 rounded-xl bg-secondary/30 border border-border/50" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
