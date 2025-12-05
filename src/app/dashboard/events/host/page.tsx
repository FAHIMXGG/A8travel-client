"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useSession } from "next-auth/react"
import { travelPlanSchema, type TravelPlanInput } from "@/app/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Globe,
  ImageIcon,
  Tag,
  Link as LinkIcon,
  Phone,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import GalleryUploader from "@/components/gallery-uploader"
import { TagInput } from "@/components/ui/tag-input"
import { cn } from "@/lib/utils"

const TRAVEL_TYPES = [
  { value: "FRIENDS", label: "Friends" },
  { value: "FAMILY", label: "Family" },
  { value: "SOLO", label: "Solo" },
  { value: "COUPLES", label: "Couples" },
  { value: "BUSINESS", label: "Business" },
] as const

export default function HostEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<TravelPlanInput>({
    resolver: zodResolver(travelPlanSchema),
    defaultValues: {
      title: "",
      destinationCountry: "",
      destinationCity: "",
      startDate: "",
      endDate: "",
      budgetMin: 0,
      budgetMax: 0,
      travelType: "FRIENDS",
      description: "",
      groupChatLink: "",
      contact: "",
      images: [],
      tags: [],
      isPublic: true,
      maxParticipants: 1,
    },
  })

  const startDate = watch("startDate")

  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate)
      const end = new Date(startDate)
      end.setDate(end.getDate() + 1)
      if (!watch("endDate") || new Date(watch("endDate")) <= start) {
        setValue("endDate", end.toISOString().slice(0, 16))
      }
    }
  }, [startDate, setValue, watch])

  const onSubmit = async (values: TravelPlanInput) => {
    try {
      setIsSubmitting(true)

      // Convert dates to ISO format
      const payload = {
        ...values,
        startDate: values.startDate ? new Date(values.startDate).toISOString() : values.startDate,
        endDate: values.endDate ? new Date(values.endDate).toISOString() : values.endDate,
        budgetMin: Number(values.budgetMin),
        budgetMax: Number(values.budgetMax),
        maxParticipants: Number(values.maxParticipants),
        groupChatLink: values.groupChatLink || undefined,
        images: values.images || [],
        tags: values.tags || [],
      }

      const res = await fetch("/api/travel-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to create travel plan")
      }

      toast.success("Travel plan created successfully!")
      router.push("/dashboard/events")
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <CardHeader className="relative space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold">Host a Travel Event</CardTitle>
              <CardDescription>Create a travel plan for others to join</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Event Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Dhaka to Cox's Bazar Trip"
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="destinationCountry" className="text-sm font-medium">
                      Destination Country *
                    </Label>
                    <Input
                      id="destinationCountry"
                      placeholder="Bangladesh"
                      className="h-11 bg-background/50 backdrop-blur-sm"
                      {...register("destinationCountry")}
                    />
                    {errors.destinationCountry && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        {errors.destinationCountry.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destinationCity" className="text-sm font-medium">
                      Destination City *
                    </Label>
                    <Input
                      id="destinationCity"
                      placeholder="Cox's Bazar"
                      className="h-11 bg-background/50 backdrop-blur-sm"
                      {...register("destinationCity")}
                    />
                    {errors.destinationCity && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        {errors.destinationCity.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Travel Dates
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    {...register("endDate")}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Budget (per person)
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin" className="text-sm font-medium">
                    Minimum Budget *
                  </Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="100"
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    {...register("budgetMin", { valueAsNumber: true })}
                  />
                  {errors.budgetMin && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.budgetMin.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetMax" className="text-sm font-medium">
                    Maximum Budget *
                  </Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="300"
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    {...register("budgetMax", { valueAsNumber: true })}
                  />
                  {errors.budgetMax && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.budgetMax.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Travel Type & Participants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Travel Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="travelType" className="text-sm font-medium">
                    Travel Type *
                  </Label>
                  <select
                    id="travelType"
                    className={cn(
                      "h-11 w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-1 text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    {...register("travelType")}
                  >
                    {TRAVEL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.travelType && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.travelType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants" className="text-sm font-medium">
                    Max Participants *
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    placeholder="5"
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    {...register("maxParticipants", { valueAsNumber: true })}
                  />
                  {errors.maxParticipants && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {errors.maxParticipants.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Description
              </h3>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Event Description *
                </Label>
                <textarea
                  id="description"
                  placeholder="Beach trip with sightseeing and seafood..."
                  rows={5}
                  className={cn(
                    "w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "resize-none"
                  )}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium">
                    Contact *
                  </Label>
                  <Input
                    id="contact"
                    placeholder="+8801700000000"
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    {...register("contact")}
                  />
                  {errors.contact && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.contact.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupChatLink" className="text-sm font-medium">
                    Group Chat Link (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="groupChatLink"
                      type="url"
                      placeholder="https://chat.whatsapp.com/your-group-id"
                      className="h-11 bg-background/50 backdrop-blur-sm pl-10"
                      {...register("groupChatLink")}
                    />
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.groupChatLink && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {errors.groupChatLink.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Tags
              </h3>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add tags (e.g., beach, relax, seafood)..."
                    maxTags={10}
                  />
                )}
              />
              {errors.tags && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {Array.isArray(errors.tags) ? errors.tags[0]?.message : errors.tags?.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Event Images
              </h3>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <div className="rounded-lg border border-white/20 p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-800/50">
                    <GalleryUploader
                      value={field.value || []}
                      onChange={field.onChange}
                      maxFiles={10}
                      helperText="Upload images for your travel event (up to 10 images, 4MB each)"
                    />
                  </div>
                )}
              />
              {errors.images && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {Array.isArray(errors.images) ? errors.images[0]?.message : errors.images?.message}
                </p>
              )}
            </div>

            {/* Public/Private */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  className="h-4 w-4 rounded border-input"
                  {...register("isPublic")}
                />
                <Label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
                  Make this event public
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Public events can be discovered by other travelers. Private events are only visible to you and
                participants you invite.
              </p>
            </div>

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Create Travel Plan
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
