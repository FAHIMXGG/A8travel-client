"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


export default function DeleteButton({ id }: { id: string }) {
const router = useRouter()
const doDelete = async () => {
try {
const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
const data = await res.json()
if (!res.ok || data?.success === false) throw new Error(data?.message || "Delete failed")
toast.success("Deleted")
router.push("/dashboard/blogs")
router.refresh()
} catch (e: any) {
toast.error(e.message || "Error deleting")
}
}
return <Button variant="destructive" onClick={doDelete}>Delete</Button>
}