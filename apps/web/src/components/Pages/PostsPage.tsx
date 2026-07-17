import { useParams } from "react-router";
import Posts from "../Posts";

export function PostsPage() {
  const { tag } = useParams<{ tag?: string }>();
  return <Posts tag={tag} showDetails />;
}
