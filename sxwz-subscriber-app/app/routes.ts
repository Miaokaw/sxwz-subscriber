import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("components/Layout.tsx", [
        index("routes/home.tsx"),
        route("/dynamics", "routes/dynamics.tsx"),
    ]),
] satisfies RouteConfig;
