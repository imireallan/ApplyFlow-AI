import { Outlet, NavLink } from "react-router";
import {
  FileUp,
  Search,
  BrainCircuit,
  Target,
  PenTool,
  Mic2,
  Sparkles,
} from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex h-full w-full bg-[#fcfcfd]">
      <nav className="w-16 flex flex-col items-center py-6 border-r border-gray-200 bg-white shadow-sm">
        <div className="mb-10 font-black text-blue-600 tracking-tighter text-xl">
          AF
        </div>
        <div className="flex flex-col space-y-4">
          <SidebarLink to="/upload" icon={<FileUp size={20} />} />
          <SidebarLink to="/search" icon={<Search size={20} />} />
          <SidebarLink to="/analyze" icon={<BrainCircuit size={20} />} />
        </div>
      </nav>
      <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden md:block">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
          AI Capabilities
        </h2>

        <nav className="space-y-2">
          <FeatureNavItem
            icon={<Target size={18} />}
            label="Skills Gap"
            active
          />
          <FeatureNavItem
            icon={<PenTool size={18} />}
            label="Bullet Tailoring"
            isComingSoon
          />
          <FeatureNavItem
            icon={<Mic2 size={18} />}
            label="Interview Prep"
            isComingSoon
          />
          <FeatureNavItem
            icon={<Sparkles size={18} />}
            label="Salary Match"
            isComingSoon
          />
        </nav>

        <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[11px] font-bold text-blue-600 uppercase mb-1">
            Current Profile
          </p>
          <p className="text-xs text-blue-900 font-medium truncate">
            Standard_Resume_2026.pdf
          </p>
        </div>
      </aside>
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function FeatureNavItem({ icon, label, active, isComingSoon }: any) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl transition-all ${active ? "bg-gray-50 text-blue-600" : "text-gray-500 opacity-60"}`}
    >
      <div className="flex items-center gap-3 font-semibold text-sm">
        {icon} {label}
      </div>
      {isComingSoon && (
        <span className="text-[8px] font-black bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded uppercase">
          Soon
        </span>
      )}
    </div>
  );
}

function SidebarLink({ to, icon }: { to: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `p-3 rounded-xl transition-all ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-400 hover:bg-gray-100"}`
      }
    >
      {icon}
    </NavLink>
  );
}
