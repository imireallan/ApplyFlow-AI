import {
  FileUp,
  LogOut,
  Mic2,
  PenTool,
  Search,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Form,
  Link,
  NavLink,
  data,
  redirect,
  useOutletContext,
  useSearchParams,
} from "react-router";
import { apiRequestHandler } from "~/.server/apiRequestHandler";
import { logout } from "~/.server/auth";
import { AnimatedOutlet } from "~/components/AnimatedOutlet";
import { Svg } from "~/components/SvgLogo";
import { UserAvatar } from "~/components/UserAvatar";
import type { UserCV } from "~/types/cv";
import type { User } from "~/types/user";
import type { Route } from "./+types/dashboard_layout";

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const result = await apiRequestHandler(request, {
      endpoint: "/cv/user-cvs",
      method: "GET",
    });

    // Check for API errors (401, 500, etc.)
    if (
      (result as any).error ||
      (result as any).status === 401 ||
      (result as any).status >= 500
    ) {
      const loginUrl = new URL(request.url);
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectTo", new URL(request.url).pathname);
      throw redirect(loginUrl.toString());
    }

    const resultData = result as any;
    const cvs = resultData.data?.data || [];
    return data({
      success: true,
      cvs,
    });
  } catch (error: any) {
    if (error.status === 401) {
      const loginUrl = new URL(request.url);
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectTo", new URL(request.url).pathname);
      throw redirect(loginUrl.toString());
    }
    throw error;
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  return logout(request);
};

export interface DashboardContext {
  user: User | null;
  cvs: UserCV[];
  selectedCvId?: string;
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = useOutletContext<DashboardContext>();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCvId = searchParams.get("cv_id") || loaderData?.cvs?.[0]?.id;
  const cvs = loaderData?.cvs || [];

  const updateSelectedCV = (cvId: string | null) => {
    if (cvId) {
      searchParams.set("cv_id", cvId);
    } else {
      searchParams.delete("cv_id");
    }
    setSearchParams(searchParams);
  };

  const selectedCV = cvs.find((cv: UserCV) => cv.id === selectedCvId);

  return (
    <div className="flex h-screen w-full bg-[#fcfcfd]">
      {/* Left Sidebar - Sticky */}
      <nav className="w-16 flex flex-col items-center py-6 border-r border-gray-200 bg-white shadow-sm sticky top-0 h-screen z-20">
        <Link
          to="/"
          className="mb-10 font-black text-blue-600 tracking-tighter text-xl"
        >
          <Svg />
        </Link>

        <div className="flex flex-col space-y-4 flex-1">
          <SidebarLink to="/app/upload" icon={<FileUp size={20} />} />
          <SidebarLink to="/app/search" icon={<Search size={20} />} />
        </div>

        {/* User Avatar at bottom of sidebar */}
        <div className="mt-auto pt-4">
          <UserAvatar
            user={user}
            size="sm"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          />
        </div>
      </nav>

      {/* Profile Dropdown - Absolute position relative to main */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-16 right-4 md:right-6 z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-48">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.first_name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <div className="p-1">
                <Link
                  to="/app/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings size={14} />
                  Settings
                </Link>
                <Form method="post">
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </Form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Sidebar - Sticky */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
          AI Capabilities
        </h2>

        <nav className="space-y-2">
          <FeatureNavItem
            icon={<Target size={18} />}
            label="Find Best Matches"
            active
          />
          <FeatureNavItem
            icon={<PenTool size={18} />}
            label="Improve Your Resume"
            isComingSoon
          />
          <FeatureNavItem
            icon={<Mic2 size={18} />}
            label="Interview Prep"
            isComingSoon
          />
          <FeatureNavItem
            icon={<Sparkles size={18} />}
            label="Salary Insights"
            isComingSoon
          />
        </nav>

        <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[11px] font-bold text-blue-600 uppercase mb-1">
            Your Resume
          </p>
          {cvs.length === 0 ? (
            <p className="text-xs text-gray-500">
              No resumes.{" "}
              <Link to="/app/upload" className="underline">
                Upload now
              </Link>
            </p>
          ) : (
            <>
              {selectedCV && (
                <p className="text-xs text-blue-900 font-bold truncate mb-2">
                  {selectedCV.file_name}
                </p>
              )}
              <select
                onChange={(e) => updateSelectedCV(e.target.value || null)}
                value={selectedCvId || ""}
                className="w-full p-1 text-xs bg-transparent border-none outline-none text-blue-900 font-medium rounded focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Resume</option>
                {cvs.map((cv: UserCV) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.file_name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Header - Sticky */}
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-end px-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-gray-500">Online</span>
              </div>
            </div>

            {/* Profile Button */}
            <UserAvatar
              user={user}
              size="md"
              showName
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            />
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatedOutlet context={{ user, cvs, selectedCvId }} />
        </div>
      </main>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
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
