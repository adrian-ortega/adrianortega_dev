import { usePages } from "../../utils/usePages";

const Pages = () => {
  const [pages, { loading, fetchBySlug }] = usePages();

  return (
    <div>
      <h2>Pages Component</h2>
      {loading ? (
        <p>Loading pages...</p>
      ) : pages.length > 0 ? (
        <ul>
          {pages.map((page, index) => (
            <li key={index}>
              <a href={`/pages/${page.slug}`} onClick={(e) => {
                e.preventDefault();
                fetchBySlug(page.slug);
              }}>{page.page_title || page.slug}</a>
              {page.slug !== page.page_title && <pre>{JSON.stringify(page, null, 2)}</pre>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pages available.</p>
      )}
    </div>
  );
};

export default Pages;
