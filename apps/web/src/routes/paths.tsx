import type { To } from "react-router";

type RouteId = "home" | "page" | "about" | "blog" | "blogTag" | "contact";

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
  blog: "/blog",
  blogTag: "/tags/:slug",
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
    id: "blog",
    path: paths.blog,
    title: "Blog",
  },
  {
    id: "contact",
    path: paths.contact,
    title: "Contact",
  }
];
