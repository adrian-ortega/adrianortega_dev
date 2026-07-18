export type ENTITY_TYPE = 'post' | 'page' | 'tag' | 'notification' | 'widget' | 'sidebar';
export const ENTITY_TYPE: Record<string, ENTITY_TYPE> = {
  POST: 'post',
  PAGE: 'page',
  TAG: 'tag',
  NOTIFICATION: 'notification',
  WIDGET: 'widget',
  SIDEBAR: 'sidebar',
};

export type MdEntity = Record<string, any> & {
  // Slugs are extracted from Markdown file names and used as unique identifiers.
  //
  // e.g., "post.my-first-post.md" -> "my-first-post"
  //       "page.about.md" -> "about"
  //       "sidebar.default" -> "default"
  slug: string,
  content: string
};

type HasHTMLMetaData = Record<string, any> & {
  page_title?: string;
  page_description?: string;
}

export type TagEntity = MdEntity & HasHTMLMetaData & {
  name: string;
  description: string;
};

export type WIDGET_TYPE = 'default' | 'html';
export const WIDGET_TYPE: Record<string, WIDGET_TYPE> = {
  DEFAULT: 'default',
  HTML: 'html',
};

export type WidgetEntity = MdEntity & {
  type: WIDGET_TYPE;
  title: string;
}

export type SidebarEntity = MdEntity & {
  widgets: string[]; // Array of WidgetEntity slugs
}

export type NotificationEntity = MdEntity & {
  link?: string;
  link_alt?: string;
  expires?: string; // ISO 8601 date string
};

export type PageEntity = MdEntity & HasHTMLMetaData & {
  sidebar?: string; // SidebarEntity slug
};

export type PostEntity = MdEntity & HasHTMLMetaData & {
  title: string;
  description: string;

  draft?: boolean;
  featured?: boolean;

  created_at?: string;
  published_at?: string;
  updated_at?: string;

  thumbnail?: string;
  cover_image?: string;

  tags: string[]; // Array of TagEntity slugs
};

// Minimal post reference for next/prev navigation.
// Posts have no separate id — the slug is the unique identifier.
export type PostNavLink = {
  slug: string;
  title: string;
};

export type PostNavigation = {
  prev: PostNavLink | null; // older post (further down the timeline)
  next: PostNavLink | null; // newer post
};

// Shape returned by GET /api/posts/:slug — the post plus its neighbors
export type PostDetail = PostEntity & {
  navigation: PostNavigation;
};

// Card-sized post summary returned by GET /api/posts/:slug/related
export type RelatedPost = PostNavLink & {
  description: string;
  thumbnail?: string;
  tags: string[];
  created_at?: string;
};
