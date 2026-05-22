import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page-gradient">
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
