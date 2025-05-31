//import pages
import TableData from "@/pages/TableData";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import Authentication from "@/pages/Authentication";

const publicRoutes = [
    { path: "/", component: Login},
    { path: "/register", component: Register}
]

const privateRoutes = [
    { path: "/", component: Index},
    { path: "/table", component: TableData},
    { path: "/authentication", component: Authentication},
    { path: "*", component: NotFound}
]

const CreateSegmentationRoutes = [
]

const microSegmentRoutes = [
]

export { privateRoutes, microSegmentRoutes, CreateSegmentationRoutes, publicRoutes }