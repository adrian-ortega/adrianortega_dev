import { createBrowserRouter } from "react-router";
import { paths } from "./paths";
import { RouteError } from "../components/Errors/RouteError";
import { HomePage } from "../components/Pages/HomePage";
import { Post } from "../components/Posts/Post";
import Posts from "../components/Posts";
import { PostsPage } from "../components/Pages/PostsPage";

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
    }
  ]);
