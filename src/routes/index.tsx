//import pages
import TableData from "@/pages/TableData";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import SqlEditorPage from "@/pages/SqlEditor";

const publicRoutes = [
    { path: "/", component: Login},
    { path: "/register", component: Register}
]

const privateRoutes = [
    { path: "/", component: Index},
    { path: "/table", component: TableData},
    { path: "/sql-editor", component: SqlEditorPage},
    { path: "/business-management", component: Index},
    { path: "/authentication", component: Index},
    { path: "*", component: NotFound}
]

const CreateSegmentationRoutes = [
]

const microSegmentRoutes = [
]

export { privateRoutes, microSegmentRoutes, CreateSegmentationRoutes, publicRoutes }