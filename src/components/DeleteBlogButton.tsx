"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// (Optional) if you use react-hot-toast, uncomment:
// import toast from "react-hot-toast";

type Props = {
  id: string;
  title?: string;
};

export default function DeleteBlogButton({ id, title }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const onConfirm = async () => {
    setLoading(true);
    setErr(null);
    try {
      // Calls your working example route that proxies to BACKEND_URL DELETE
      const res = await fetch(`/api/blogs/${id}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete post");
      }

      toast?.success?.("Post deleted");
      setOpen(false); // Use router.push() to redirect to the blogs dashboard
      router.push("/dashboard/blogs");
    } catch (e: any) {
      setErr(e.message || "Something went wrong"); // toast?.error?.(e.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {title ? `"${title}"` : "this post"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The post will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
