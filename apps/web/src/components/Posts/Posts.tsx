import { usePosts } from "../../utils/usePosts";

const Posts = () => {
  const [posts, { loading }] = usePosts();

  return (
    <div>
      <h2>Posts Component</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <ul>
          {posts.map((post, index) => (
            <li key={index}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
