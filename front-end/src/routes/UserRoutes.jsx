import {createBrowserRouter} from "react-router-dom";

import App from "../App";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Sales from "../pages/Sales";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Orders from "../pages/Orders";
import Stock from "../pages/Stocks";
import Inventory from "../pages/Inventory";
import InventoryFaire from "../pages/InventoryFaire";
import InventoryListe from "../pages/InventoryListe";
import Statistics from "../pages/Statistics";
import Suppliers from "../pages/Suppliers";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Logout from "../pages/Logout";
import ProtectedRoute from "./ProtectedRoutes";
import Stocks from "../pages/Stocks";
import SalesReport from '../pages/reports/SalesReport';
import ZoneTransferReport from '../pages/reports/ZoneTransferReport';
import InventoryReport from '../pages/reports/InventoryReport';
import CrudLogReport from '../pages/reports/CrudLogReport';
// import RedirectHome from "./RedirectHome";



 export const userRoutes = createBrowserRouter(
    [
        {
            path: "/",
            element: <App/>,
        },
        {
            path: "/login",
            element: <Login/>,
        },
        {
            element: (
                <ProtectedRoute>
                    <MainLayout/>
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "/dashboard",
                    element: <Dashboard/>
                },
                {
                    path: "/sales",
                    element: <Sales/>
                },
                {
                    path: "/products",
                    element: <Products/>
                },
                {
                    path: "/categories",
                    element: <Categories/>
                }
                ,
                {
                    path:"orders",
                    element: <Orders/>
                },
                {
                    path:"stocks",
                    element: <Stocks/>
                },
                {
                    path: "inventory",
                    element: <Inventory />,
                    children: [
                        {
                            path: "faire",
                            element: <InventoryFaire />
                        },
                        {
                            path: "liste",
                            element: <InventoryListe />
                        },
                        {
                            index: true,
                            element: <InventoryFaire />
                        }
                    ]
                },
                {
                    path:"statistics",
                    element: <Statistics/>
                },
                {
                    path:"suppliers",
                    element: <Suppliers/>
                },
                {
                    path: "/reports",
                    element: <Reports/>,
                    children: [
                        { path: "sales", element: <SalesReport /> },
                        { path: "zone-transfer", element: <ZoneTransferReport /> },
                        { path: "inventory", element: <InventoryReport /> },
                        { path: "crud-log", element: <CrudLogReport /> },
                    ]
                },
                {
                    path: "/settings",
                    element: <Settings/>
                },
                {
                    path:"/profile",
                    element: <Profile/>
                },
                {
                    path:"logout",
                    element: <Logout/>
                }
                
            ]
        }
    ]
);

// export default UserRoutes;