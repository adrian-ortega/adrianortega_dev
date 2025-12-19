import { useEffect, useState } from "react";
import { type PostEntity } from "../../../../shared/types";

const Posts = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostEntity[]>([]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts');
      const data: { posts:PostEntity[]} = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {      
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts Component</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <li key={index}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Posts;
