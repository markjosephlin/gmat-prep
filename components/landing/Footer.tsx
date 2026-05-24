import Link from "next/link";
import AscendLogo from "@/components/AscendLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/50">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AscendLogo size={24} />
          <span className="font-bold text-navy text-sm">Ascend</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-slate-500 text-sm hover:text-navy">Blog</Link>
          <Link href="#" className="text-slate-500 text-sm hover:text-navy">Terms</Link>
          <Link href="#" className="text-slate-500 text-sm hover:text-navy">Privacy</Link>
        </div>
        <p className="text-slate-400 text-xs">© 2026 Ascend</p>
      </div>
    </footer>
  );
}
