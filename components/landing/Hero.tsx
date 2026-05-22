import Link from "next/link";
import Image from "next/image";

const schools = [
  { name: "Harvard Business School", file: "HBS.png" },
  { name: "Columbia Business School", file: "CBS.png" },
  { name: "Wharton", file: "Wharton.png" },
  { name: "MIT Sloan", file: "sloan.png" },
  { name: "Chicago Booth", file: "Booth.png" },
  { name: "Stanford GSB", file: "GSB.png" },
];

export default function Hero() {
  const doubled = [...schools, ...schools];

  return (
    <section className="pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-black text-navy leading-[1.08] tracking-tight mb-6">
            GMAT prep that learns from every question you miss.
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed">
            Turn every wrong answer into targeted drills that hit the exact concept
            you got wrong — backed by spaced repetition so it sticks.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/practice" className="btn-primary px-6 py-3 text-base">
              Get started free
            </Link>
            <Link href="#how-it-works" className="btn-secondary px-6 py-3 text-base">
              See how it works
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <p className="text-center text-sm font-black text-slate-700 mb-8 tracking-wide">
          Trusted by students now at...
        </p>
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-16 animate-marquee">
            {doubled.map((school, i) => (
              <div key={i} className="shrink-0 flex items-center justify-center">
                <Image
                  src={`/logos/${school.file}`}
                  alt={school.name}
                  height={80}
                  width={200}
                  className="h-20 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f8fff9] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#f8fff9] to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
