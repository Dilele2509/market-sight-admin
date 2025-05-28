//import pages
import TableData from "@/pages/TableData";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
<<<<<<< HEAD
import CreateSegmentation from "@/pages/CreateSegmentation";
import SyncConfigPage from "@/pages/SyncConfig";
=======
import SqlEditorPage from "@/pages/SqlEditor";
>>>>>>> 82912c6 (update admin)

const publicRoutes = [
    { path: "/", component: Login},
    { path: "/register", component: Register}
]

const privateRoutes = [
    { path: "/", component: Index},
<<<<<<< HEAD
    { path: "/micro-segmentation", component: MicroSegmentation},
    { path: "/create-segmentation", component: CreateSegmentation},
    { path: "/connect-data", component: ImportData},
    { path: "/data-modeling", component:  DataModeling},
    { path: "/sync-config", component:  SyncConfigPage},
=======
    { path: "/table", component: TableData},
    { path: "/sql-editor", component: SqlEditorPage},
    { path: "/business-management", component: Index},
    { path: "/authentication", component: Index},
>>>>>>> 82912c6 (update admin)
    { path: "*", component: NotFound}
]

const CreateSegmentationRoutes = [
]

const microSegmentRoutes = [
]

export { privateRoutes, microSegmentRoutes, CreateSegmentationRoutes, publicRoutes }