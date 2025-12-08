"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useSession } from "next-auth/react"
import { profileUpdateSchema, type ProfileUpdateInput } from "@/app/lib/validators"
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
import { UserCog, Mail, ShieldCheck, Camera, MapPin, Briefcase, Globe, Images, AlertCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import ThumbnailUploader from "@/components/thumbnail-uploader"
import GalleryUploader from "@/components/gallery-uploader"
import { TagInput } from "@/components/ui/tag-input"
import { cn } from "@/lib/utils"

type ProfileData = {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  bio: string | null
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation: string | null
  gallery: string[]
  phone?: string | null
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const user = session?.user
  const formRef = useRef<HTMLFormElement>(null)
  const firstErrorRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    reset,
    getValues,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      phone: null,
      image: null,
      bio: null,
      travelInterests: [],
      visitedCountries: [],
      currentLocation: "",
      gallery: [],
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated" && user?.id) {
        try {
          const res = await fetch("/api/profile")
          const data = await res.json()
          
          // Handle different response structures
          const profile = data?.data || data?.user || data
          
          if (res.ok && profile) {
            const profileData = profile as ProfileData
            setProfileData(profileData)
            
            console.log("Fetched profile data:", profileData)
            console.log("Travel interests:", profileData.travelInterests)
            console.log("Visited countries:", profileData.visitedCountries)
            
            // Set form values - ensure arrays are always arrays
            reset({
              name: profileData.name || "",
              phone: profileData.phone || null,
              image: profileData.image || null,
              bio: profileData.bio || null,
              travelInterests: Array.isArray(profileData.travelInterests) ? profileData.travelInterests : [],
              visitedCountries: Array.isArray(profileData.visitedCountries) ? profileData.visitedCountries : [],
              currentLocation: profileData.currentLocation || "",
              gallery: Array.isArray(profileData.gallery) ? profileData.gallery : [],
            })
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error)
          toast.error("Failed to load profile data")
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        router.push("/login")
      }
    }

    fetchProfile()
  }, [status, user, router, reset])

  // Scroll to first error when validation errors occur
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      setTimeout(() => {
        firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [errors])

  // Get all error messages for summary
  const getErrorSummary = () => {
    const errorFields = Object.entries(errors).map(([field, error]) => {
      const fieldLabels: Record<string, string> = {
        name: "Full Name",
        phone: "Phone Number",
        image: "Profile Image",
        bio: "Bio",
        travelInterests: "Travel Interests",
        visitedCountries: "Visited Countries",
        currentLocation: "Current Location",
        gallery: "Photo Gallery",
      }
      return {
        field: fieldLabels[field] || field,
        message: error?.message || "Invalid value",
      }
    })
    return errorFields
  }

  // Get the first error field name
  const firstErrorField = Object.keys(errors)[0]
  
  // Helper to get ref only for first error
  const getErrorRef = (fieldName: string) => {
    return firstErrorField === fieldName ? firstErrorRef : null
  }

  const onSubmit = async (values: ProfileUpdateInput) => {
    try {
      const payload: Record<string, any> = {}
      
      if (values.name) payload.name = values.name
      if (values.phone !== undefined) {
        // Clean phone number: remove formatting characters
        payload.phone = values.phone 
          ? values.phone.replace(/[\s\-\(\)]/g, "") 
          : null
      }
      if (values.image !== undefined) payload.image = values.image
      if (values.bio !== undefined) payload.bio = values.bio
      
      // Always include arrays - get from form state
      const currentValues = getValues()
      // Ensure arrays are always sent, even if empty
      payload.travelInterests = Array.isArray(currentValues.travelInterests) 
        ? currentValues.travelInterests 
        : (Array.isArray(values.travelInterests) ? values.travelInterests : [])
      payload.visitedCountries = Array.isArray(currentValues.visitedCountries) 
        ? currentValues.visitedCountries 
        : (Array.isArray(values.visitedCountries) ? values.visitedCountries : [])
      
      // Current location is required, always include it
      payload.currentLocation = values.currentLocation || ""
      payload.gallery = values.gallery || []
      
      console.log("Form values (onSubmit):", values)
      console.log("Current form values (getValues):", currentValues)
      console.log("Payload being sent:", JSON.stringify(payload, null, 2))

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Update failed")
      }

      // Update the session with new data
      if (values.name) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: values.name,
          },
        })
      }

      toast.success("Profile updated successfully!")
      
      // Refetch profile data to get updated values
      const profileRes = await fetch("/api/profile")
      const profileData = await profileRes.json()
      
      // Handle different response structures
      const updatedProfile = profileData?.data || profileData?.user || profileData
      
      if (profileRes.ok && updatedProfile) {
        setProfileData(updatedProfile as ProfileData)
        
        // Reset form with updated data
        reset({
          name: updatedProfile.name || "",
          phone: updatedProfile.phone || null,
          image: updatedProfile.image || null,
          bio: updatedProfile.bio || null,
          travelInterests: Array.isArray(updatedProfile.travelInterests) ? updatedProfile.travelInterests : [],
          visitedCountries: Array.isArray(updatedProfile.visitedCountries) ? updatedProfile.visitedCountries : [],
          currentLocation: updatedProfile.currentLocation || "",
          gallery: Array.isArray(updatedProfile.gallery) ? updatedProfile.gallery : [],
        })
      }
      
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!user || !profileData) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <CardHeader className="relative space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <UserCog className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold">Update Profile</CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Validation Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div
                ref={firstErrorRef}
                className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <AlertCircle className="h-5 w-5" />
                  <span>Please fix the following errors:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                  {getErrorSummary().map((error, idx) => (
                    <li key={idx}>
                      <strong>{error.field}:</strong> {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Basic Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2" ref={getErrorRef("name")}>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className={cn(
                      "h-11 bg-background/50 backdrop-blur-sm",
                      errors.name && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={user.email ?? ""}
                      disabled
                      className="h-11 bg-muted/50 cursor-not-allowed"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>

                <div className="space-y-2" ref={getErrorRef("phone")}>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+8801700000000 or +1234567890"
                    className={cn(
                      "h-11 bg-background/50 backdrop-blur-sm",
                      errors.phone && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("phone")}
                  />
                  {errors.phone ? (
                    <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">International format required (e.g., +8801700000000)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Account Role
                  </Label>
                  <div className="relative">
                    <Input
                      id="role"
                      value={user.role ?? "USER"}
                      disabled
                      className="h-11 bg-muted/50 cursor-not-allowed"
                    />
                    <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Role is assigned by administrators</p>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-4" ref={getErrorRef("image")}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Profile Image
              </h3>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <div className={cn(
                    "rounded-lg border p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-800/50",
                    errors.image ? "border-destructive" : "border-white/20"
                  )}>
                    <ThumbnailUploader
                      value={field.value || null}
                      onChange={(url) => field.onChange(url)}
                      helperText="Upload a profile picture (up to 4MB, PNG/JPG/WebP)"
                      endpoint="profileImage"
                    />
                  </div>
                )}
              />
              {errors.image && (
                <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-4" ref={getErrorRef("bio")}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                About Me
              </h3>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className={cn(
                    "w-full rounded-md border bg-background/50 backdrop-blur-sm px-3 py-2 text-sm",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "resize-none",
                    errors.bio ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
                  )}
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </div>

            {/* Travel Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Travel Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2" ref={getErrorRef("currentLocation")}>
                  <Label htmlFor="currentLocation" className="text-sm font-medium">
                    Current Location <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentLocation"
                      placeholder="Dhaka, Bangladesh"
                      className={cn(
                        "h-11 bg-background/50 backdrop-blur-sm pl-10",
                        errors.currentLocation && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("currentLocation")}
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.currentLocation && (
                    <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.currentLocation.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2" ref={getErrorRef("travelInterests")}>
                <Label htmlFor="travelInterests" className="text-sm font-medium">
                  Travel Interests
                </Label>
                <Controller
                  name="travelInterests"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => {
                    const fieldValue = Array.isArray(field.value) ? field.value : []
                    return (
                      <TagInput
                        key={`travelInterests-${fieldValue.length}-${fieldValue.join(',')}`}
                        value={fieldValue}
                        onChange={(tags) => {
                          console.log("Travel interests onChange called with:", tags)
                          field.onChange(tags)
                          setValue("travelInterests", tags, { shouldDirty: true, shouldTouch: true })
                        }}
                        placeholder="Add travel interests (e.g., hiking, food tours)..."
                        maxTags={20}
                      />
                    )
                  }}
                />
              </div>

              <div className="space-y-2" ref={getErrorRef("visitedCountries")}>
                <Label htmlFor="visitedCountries" className="text-sm font-medium">
                  Visited Countries
                </Label>
                <Controller
                  name="visitedCountries"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => {
                    const fieldValue = Array.isArray(field.value) ? field.value : []
                    return (
                      <TagInput
                        key={`visitedCountries-${fieldValue.length}-${fieldValue.join(',')}`}
                        value={fieldValue}
                        onChange={(tags) => {
                          console.log("Visited countries onChange called with:", tags)
                          field.onChange(tags)
                          setValue("visitedCountries", tags, { shouldDirty: true, shouldTouch: true })
                        }}
                        placeholder="Add countries you've visited (e.g., Bangladesh, India)..."
                        maxTags={50}
                      />
                    )
                  }}
                />
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-4" ref={getErrorRef("gallery")}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                Photo Gallery
              </h3>
              <Controller
                name="gallery"
                control={control}
                render={({ field }) => (
                  <div className={cn(
                    "rounded-lg border p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-800/50",
                    errors.gallery ? "border-destructive" : "border-white/20"
                  )}>
                    <GalleryUploader
                      value={field.value || []}
                      onChange={field.onChange}
                      maxFiles={10}
                      helperText="Upload up to 10 photos to showcase your travels (4MB each)"
                    />
                  </div>
                )}
              />
              {errors.gallery && (
                <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {Array.isArray(errors.gallery) ? errors.gallery[0]?.message : errors.gallery?.message}
                </p>
              )}
            </div>

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
