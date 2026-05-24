"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import AscendLogo from "@/components/AscendLogo";

const tabs = [
  { label: "Add mistake", href: "/mistakes" },
  { label: "Drills", href: "/practice" },
  { label: "Analytics", href: "/dashboard" },
  { label: "History", href: "/history" },
  { label: "Billing", href: "/billing" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = email ? email[0].toUpperCase() : "U";

  return (
    <header className="bg-[#14532d] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <AscendLogo size={24} />
          <span className="text-white font-bold text-sm hidden sm:block">Ascend</span>
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-navy"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {email && (
            <span className="text-white/50 text-xs hidden md:block truncate max-w-[140px]">
              {email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="text-white/60 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Sign out
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
