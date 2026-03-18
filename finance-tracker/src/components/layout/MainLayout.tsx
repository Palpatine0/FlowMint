import { Sidebar } from "./Sidebar";
import { LayoutDashboard, Plus } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
  onAddClick: () => void;
}

export function MainLayout({ children, onAddClick }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-slate-400" size={20} />
            <h1 className="text-lg font-semibold text-slate-800">Overview</h1>
          </div>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200"
          >
            <Plus size={18} /> Add Transaction
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
