import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/landing.tsx"),
  route("login", "./routes/login.tsx"),
  route("logout", "./routes/logout.tsx"),
  route("app", "./routes/dashboard_layout.tsx", [
    index("./routes/upload.tsx", { id: "dashboard-home" }),
    route("upload", "./routes/upload.tsx"),
    route("search", "./routes/search.tsx"),
    route("settings", "./routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
