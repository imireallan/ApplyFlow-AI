import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/dashboard_layout.tsx", [
    index("./routes/upload.tsx", { id: "dashboard-home" }),
    route("upload", "./routes/upload.tsx"),
    route("search", "./routes/search.tsx"),
    route("analyze", "./routes/analyze.tsx"),
  ]),
] satisfies RouteConfig;
