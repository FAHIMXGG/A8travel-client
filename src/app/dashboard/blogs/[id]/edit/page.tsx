import type { Metadata } from "next";
import { headers } from "next/headers";
import BlogEditForm from "./_form";

async function getPost(id: string) {
  try {
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`
    
    const res = await fetch(`${baseUrl}/api/blogs/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  
  return {
    title: post ? `Edit ${post.title}` : "Edit Blog Post",
    description: "Edit your blog post content, title, tags, and other details.",
    robots: {
      index: false,
      follow: false,
    },
  };
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
