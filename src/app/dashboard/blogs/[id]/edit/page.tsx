import BlogEditForm from "./_form";

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data;
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;              // ✅ await the Promise
  const post = await getPost(id);
  if (!post) return <div>Not found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Post</h1>
      <BlogEditForm post={post} />
    </div>
  );
}
