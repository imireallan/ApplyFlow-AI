import { GoogleLogin } from "@react-oauth/google";
import { AnimatePresence, motion } from "motion/react";
import {
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router";
import { login } from "~/.server/login";
import { getUserToken, isTokenExpired } from "~/.server/sessions";
import { ApplyFlowLogo } from "~/components/Logo";
import type { Route } from "./+types/login";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/app";

  const token = getUserToken(request);

  // 1. If active session exists, bypass login and go to the destination
  if (token && !isTokenExpired(token)) {
    return redirect(redirectTo);
  }

  // 2. If no session, stay on login.
  // The client-side component will use 'redirectTo' from the URL for the Action.
  return null;
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const credential = formData.get("credential");

  // Extract redirectTo from the URL
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/app";

  // Pass redirectTo to your login function so it knows where to send the user
  return await login(request, credential, redirectTo);
};

export default function LoginPage() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const isSubmitting = navigation.state === "submitting";

  const handleSuccess = (response: any) => {
    const formData = new FormData();
    formData.append("credential", response.credential);
    submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute-events-none">
        {/* Gradient Orbs */}
        <motion.div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />
        <motion.div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-indigo-500/8 blur-[80px] rounded-full" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(21,93,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(21,93,252,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 h-16 border-b border-slate-100/50 dark:border-slate-800/50 backdrop-blur-sm">
        <Link to="/">
          <ApplyFlowLogo />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            AI-Powered
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* AI Scanning Card Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Scanning Line Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2,
                }}
                className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
              >
                <div className="w-full h-[1px] bg-blue-400/30 shadow-[0_0_20px_rgba(96,165,250,0.3)]" />
              </motion.div>
            </div>

            {/* Card */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-500/5">
              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  AI-Powered Login
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-black text-center text-slate-900 dark:text-white mb-3"
              >
                Welcome to{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  ApplyFlow
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center text-slate-500 dark:text-slate-400 mb-8 text-base leading-relaxed"
              >
                Your AI career assistant awaits. Sign in to unlock intelligent
                resume analysis, job matching, and recruiter messaging.
              </motion.p>

              {/* Features Pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-2 mb-8"
              >
                {[
                  "Resume Analysis",
                  "Job Matching",
                  "Fit Score",
                  "Smart Messaging",
                ].map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                {/* Only show this in test environments */}
                {process.env.NODE_ENV === "development" && (
                  <button
                    data-testid="mock-login-button"
                    onClick={() =>
                      handleSuccess({ credential: "mock-google-token" })
                    }
                    className="mt-4 text-xs text-slate-400 underline"
                  >
                    Debug: Mock Login
                  </button>
                )}
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold text-sm uppercase tracking-wider"
                    >
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </motion.div>
                  ) : (
                    <GoogleLogin
                      onSuccess={(credentialResponse) =>
                        handleSuccess(credentialResponse)
                      }
                      onError={() => {
                        console.error("Login failed");
                      }}
                      useOneTap
                      theme="outline"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                      logo_alignment="center"
                      ux_mode="popup"
                    />
                  )}
                  {actionData?.error && (
                    <div className="text-red-500 mt-4">
                      {actionData?.error?.message}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Trust Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-xs text-slate-400 mt-6"
              >
                By signing in, you agree to our Terms of Service and Privacy
                Policy.
                <br />
                Your data is encrypted and secure with AI-powered protection.
              </motion.p>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Sign up for free
              </span>
            </p>
          </motion.div> */}
        </div>
      </div>
    </div>
  );
}
