import { createBrowserRouter, Navigate } from "react-router";

import { RouteError } from "../components/Errors/RouteError";
import { AboutPage } from "../components/Pages/AboutPage";
import { ContactPage } from "../components/Pages/ContactPage";
import { HomePage } from "../components/Pages/HomePage";
import { PostsPage } from "../components/Pages/PostsPage";
import { NotFound } from "../components/NotFound/NotFound";
import Posts from "../components/Posts";
import { Post } from "../components/Posts/Post";
import { paths } from "./paths";

export const createRouter = () =>
  createBrowserRouter([
    {
      path: paths.home,
      element: <HomePage/>,
      errorElement: <RouteError />,
    },
    {
      path: paths.about,
      element: <AboutPage />,
      errorElement: <RouteError />,
    },
    {
      path: paths.contact,
      element: <ContactPage />,
      errorElement: <RouteError />,
    }, {
      path: paths.posts,
      errorElement: <RouteError />,
      children: [
        {
          index: true,
          element: <Posts />,
        },
        {
          path: "by-tag/:tag",
          element: <PostsPage/>
        },
        {
          path: ":slug",
          element: <Post/>,
        },
      ],
    }, {
      path: paths.notFound,
      element: <NotFound />,
      errorElement: <RouteError />,
    }, {
      path: "*",
      element: <Navigate to={paths.notFound} replace />,
    }
  ]);
