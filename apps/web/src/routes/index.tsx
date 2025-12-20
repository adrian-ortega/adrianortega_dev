import { createBrowserRouter } from "react-router";
import { paths } from "./paths";
import { RouteError } from "../components/Errors/RouteError";
import { HomePage } from "../components/Pages/Home";

export const createRouter = () =>
  createBrowserRouter([
    {
      path: paths.home,
      element: <HomePage/>,
      errorElement: <RouteError />,
    },
    {
      path: paths.about,
      element: <div>About Page</div>,
      errorElement: <RouteError />,
    },
    {
      path: paths.contact,
      element: <div>Contact Page</div>,
      errorElement: <RouteError />,
    }
  ]);
