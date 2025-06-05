import {createBrowserRouter, RouterProvider} from "react-router-dom";

 const UserRoutes = createBrowserRouter(
    [
        {
            path: "/",
            element: <h1>Welcome to NeoPOS</h1>,
        }
    ]
);

export default UserRoutes;