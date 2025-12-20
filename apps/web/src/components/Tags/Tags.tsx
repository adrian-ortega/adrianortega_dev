import { useTags } from "../../utils/useTags";

const Tags = () => {
  const [tags, { loading, fetchBySlug }] = useTags();

  return (
    <div>
      <h2>Tags Component</h2>
      {loading ? (
        <p>Loading tags...</p>
      ) : tags.length > 0 ? (
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>
              <a href={`/tags/${tag.slug}`} onClick={(e) => {
                e.preventDefault();
                fetchBySlug(tag.slug);
              }}>{tag.name}</a>
              {tag.slug !== tag.name && <pre>{JSON.stringify(tag, null, 2)}</pre>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags available.</p>
      )}
    </div>
  );
};

export default Tags;
