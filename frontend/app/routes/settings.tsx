import { motion } from "motion/react";
import { Save, Loader2 } from "lucide-react";
import { Form, useNavigation, useOutletContext } from "react-router";
import type { DashboardContext } from "./dashboard_layout";

export async function loader() {
  return null;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const firstName = formData.get("first_name")?.toString().trim() ?? "";
  const lastName = formData.get("last_name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const newsletter = formData.get("newsletter") === "on";

  // Validation
  if (!email || !firstName || !lastName) {
    return {
      error: "First name, last name, and email are required.",
      values: { firstName, lastName, email, newsletter },
    };
  }

  // In production this would call the backend API to update the user profile
  return { success: true };
}

export default function SettingsPage() {
  const navigation = useNavigation();
  const { user } = useOutletContext<DashboardContext>();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="w-full h-full flex flex-col items-center p-8 lg:p-12 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-base text-gray-500 mb-8">
          Manage your profile and preferences
        </p>

        <Form method="post" className="space-y-6">
          {/* Profile Section */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Profile
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  defaultValue={user?.first_name ?? ""}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  aria-label="First name"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-xs font-semibold text-gray-600 mb-1"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  defaultValue={user?.last_name ?? ""}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  aria-label="Last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email ?? ""}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                aria-label="Email"
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Preferences
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="newsletter"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Receive job matching suggestions via email
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="settings-submit"
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none hover:bg-blue-700 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </Form>
      </motion.div>
    </div>
  );
}
