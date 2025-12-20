import { generatePath, type To } from "react-router";

type RouteId = "home" | "page" | "about" | "posts" | "postsTag" | "post" | "contact";

export type RouteMetaPage = {
  title?: string;
};

export type RouteMeta = Record<string, unknown> & {
  page?: RouteMetaPage;
};

export type RouteNode = {
  id?: RouteId;
  title?: string;
  path?: string;
  to?: To;
  exact?: boolean;
  hidden?: boolean;
  children?: RouteNode[];
  meta?: RouteMeta;
};

export const paths: Record<RouteId, string> = {
  home: "/",
  about: "/about",
  posts: "/posts",
  post: "/posts/:slug",
  postsTag: "/posts/by-tag/:tag",
  page: "/page/:slug",
  contact: "/contact",
};

export const routes: RouteNode[] = [
  {
    id: "home",
    path: paths.home,
    title: "Home",
  },
  {
    id: "page", 
    path: paths.page,
  },
  {
    id: "about",
    path: paths.about,
    title: "About",
  },
  {
    id: "posts",
    path: paths.posts,
    title: "Posts",
  },
  {
    id: "contact",
    path: paths.contact,
    title: "Contact",
  }
];

export const to = {
  home: () => paths.home,
  about: () => paths.about,
  posts: () => paths.posts,
  postsTag: (tag: string) => generatePath(paths.postsTag, { tag }),
  post: (slug: string) => generatePath(paths.post, { slug }),
  page: (slug: string) => generatePath(paths.page, { slug }),
  contact: () => paths.contact,
}
