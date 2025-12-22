import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Blog Post",
  description: "Create a new blog post to share your travel experiences and tips with the community.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



