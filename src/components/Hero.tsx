import { HeroIcon } from "./ui/heroicon";
import { Search } from "lucide-react";
import { Section } from "./ui/section";

export default function Hero() {
  return (
    <Section className="pt-16 pb-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white/20 rounded-full p-4 shadow-lg mb-2">
          <HeroIcon Icon={Search} />
        </div>
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">BeLocal</h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto mb-4">
          Instantly check local prices for items and services around the world. Make smarter decisions, wherever you are.
        </p>
      </div>
    </Section>
  );
} 