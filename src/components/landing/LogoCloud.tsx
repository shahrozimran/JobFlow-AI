import { motion } from "framer-motion";

export default function LogoCloud() {
  const logos = ["Stripe", "Vercel", "Linear", "Notion", "Figma", "OpenAI"];

  return (
    <section className="py-16 border-y border-border/40 bg-card/30 backdrop-blur-sm relative z-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground mb-8 tracking-widest uppercase">
          Trusted by professionals from
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 p-4">
          {logos.map((logo) => (
            <div key={logo} className="w-auto h-8 flex items-center justify-center">
              <span className="text-2xl font-bold tracking-tighter text-foreground transition-colors hover:text-foreground">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
