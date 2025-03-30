

export async function getStaticProps() {
  // Fetch data (e.g., blog posts)
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  // Return the data as props
  return {
    props: { posts },
  };
}

const new = ({ posts }) => {
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default new;
