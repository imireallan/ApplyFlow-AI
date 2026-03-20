import {
  FileUp,
  LogOut,
  Menu,
  Mic2,
  PenTool,
  Search,
  Settings,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Form,
  Link,
  NavLink,
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

interface LoaderArgs {
  request: Request;
}

interface LoaderData {
  success: boolean;
  cvs: UserCV[];
}

interface ComponentProps {
  loaderData: LoaderData;
}

export const loader = async ({ request }: LoaderArgs): Promise<LoaderData> => {
  const result = (await apiRequestHandler(request, {
    endpoint: "/cv/user-cvs",
    method: "GET",
  })) as any;

  const cvs = (result as any)?.data?.data || ([] as UserCV[]);

  const url = new URL(request.url);
  const pathname = url.pathname;

  const requiresCvRoutes = ["/app/search"];

  const requiresCv = requiresCvRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (cvs.length === 0 && requiresCv) {
    throw redirect(`/app?redirectTo=${encodeURIComponent(pathname)}`);
  }

  return {
    success: true,
    cvs,
  };
};

export const action = async ({ request }: LoaderArgs) => {
  return logout(request);
};

export interface DashboardContext {
  user: User | null;
  cvs: UserCV[];
}

export default function DashboardLayout({ loaderData }: ComponentProps) {
  const { user } = useOutletContext<DashboardContext>();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCvId = searchParams.get("cv_id");
  const cvs = loaderData?.cvs || [];

  useEffect(() => {
    if (!urlCvId && cvs.length > 0) {
      const next = new URLSearchParams(searchParams);
      next.set("cv_id", cvs[0].id);
      setSearchParams(next, { replace: true });
    }
  }, [urlCvId, cvs, searchParams, setSearchParams]);

  const selectedCvId = urlCvId;

  const updateSelectedCV = (cvId: string | null): void => {
    const next = new URLSearchParams(searchParams);

    if (cvId) next.set("cv_id", cvId);
    else next.delete("cv_id");

    setSearchParams(next);
  };

  const selectedCV = cvs.find((cv: UserCV) => cv.id === selectedCvId);

  return (
    <div className="flex h-screen w-full bg-[#fcfcfd] overflow-hidden">
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <Link to="/" className="font-black text-blue-600 text-xl">
                    <Svg />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
                  <NavLink
                    to="/app/upload"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-base ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <FileUp size={24} />
                    Upload
                  </NavLink>
                  <NavLink
                    to="/app/search"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-base ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Search size={24} />
                    Search
                  </NavLink>

                  <div className="pt-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                      AI Capabilities
                    </h2>
                    <nav className="space-y-3">
                      <FeatureNavItem
                        icon={<Target size={20} />}
                        label="Find Best Matches"
                        active
                      />
                      <FeatureNavItem
                        icon={<PenTool size={20} />}
                        label="Improve Your Resume"
                        isComingSoon
                      />
                      <FeatureNavItem
                        icon={<Mic2 size={20} />}
                        label="Interview Prep"
                        isComingSoon
                      />
                      <FeatureNavItem
                        icon={<Sparkles size={20} />}
                        label="Salary Insights"
                        isComingSoon
                      />
                    </nav>
                  </div>
                </nav>

                {/* FIXED: Resume Section for Mobile */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2 tracking-wide">
                      Your Resume
                    </p>
                    {cvs.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No resumes.{" "}
                        <Link
                          to="/app/upload"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="underline font-medium"
                        >
                          Upload now
                        </Link>
                      </p>
                    ) : (
                      <>
                        {selectedCV && (
                          <p className="text-sm text-blue-900 font-bold truncate mb-3">
                            {selectedCV.file_name}
                          </p>
                        )}
                        <select
                          onChange={(e) => {
                            updateSelectedCV(e.target.value || null);
                            // Optional: close menu after selection
                            // setIsMobileMenuOpen(false);
                          }}
                          value={selectedCvId || ""}
                          className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Left Icon Sidebar - Desktop Only */}
      <nav className="hidden lg:w-16 lg:flex lg:flex-col lg:items-center lg:py-6 lg:border-r lg:border-gray-200 lg:bg-white lg:flex-shrink-0">
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
      </nav>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex lg:hidden items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <UserAvatar
            user={user}
            size="sm"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          />
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex lg:h-16 items-center justify-end border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 sticky top-0 z-30 w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Online</span>
            </div>
            <UserAvatar
              user={user}
              size="md"
              showName
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            />
          </div>
        </header>

        {/* Sidebar + Outlet Wrapper */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Right Sidebar (AI Capabilities) */}
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-gray-100 lg:bg-white lg:p-6 lg:overflow-y-auto">
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

          {/* Dynamic Content Viewport */}
          <main className="flex-1 overflow-hidden bg-[#fcfcfd]">
            <AnimatedOutlet context={{ user, cvs }} />
          </main>
        </div>
      </div>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-4 right-4 lg:top-20 lg:right-6 lg:bottom-auto z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-48 lg:w-56">
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
    </div>
  );
}

interface FeatureNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isComingSoon?: boolean;
}

function FeatureNavItem({
  icon,
  label,
  active,
  isComingSoon,
}: FeatureNavItemProps) {
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

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  actionResult,
  defaultShouldRevalidate,
}: any) {
  // 1. If it's an action (like processing a job) that returned a cvId, don't revalidate
  if (actionResult?.cvId) {
    return false;
  }

  // 2. If it's a navigation (like changing the dropdown)
  // Check if the pathname is the same and we only changed the cv_id
  if (currentUrl.pathname === nextUrl.pathname) {
    const currentCvId = currentUrl.searchParams.get("cv_id");
    const nextCvId = nextUrl.searchParams.get("cv_id");

    if (currentCvId !== nextCvId) {
      // The user just picked a different CV.
      // We already have the list of CVs in memory, so don't hit the API again.
      return false;
    }
  }

  return defaultShouldRevalidate;
}
