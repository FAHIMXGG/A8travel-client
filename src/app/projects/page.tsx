import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "DaimJobHub",
    description: "Job platform with 'Apply Now' and application tracking dashboard.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8nyFwH3COoKCvjI2WEYb0uAFtGeahRfU5lTpr",
    tags: ["React", "Tailwind CSS", "Flowbite"],
    link: "https://imaginative-biscotti-36f3c1.netlify.app/",
    github: "https://github.com/FAHIMXGG/job-hub",
  },
  {
    id: 2,
    title: "Seoul Garden",
    description: "Explore chefs' recipes and save favorites in a recipe book.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8zF7iBP3fd2ZgbTxyeN5UHVGuIRSmCLv6FtYa",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Firebase", "Tailwind CSS", "Flowbite"],
    link: "https://ass-10-eb539.web.app/",
    github: "https://github.com/FAHIMXGG/ass-10-chef-clint--",
  },
  {
    id: 3,
    title: "PlayfulParadise",
    description: "Users can add, remove, and manage toys via personal and public dashboards.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8pAOc7ldDvUhQVKfNCekItyGJwXWS2Hdxs5rT",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Firebase", "Tailwind CSS", "Flowbite"],
    link: "https://ass-11-toys.web.app/",
    github: "https://github.com/FAHIMXGG/Ass11-toymarket",
  },
  {
    id: 6,
    title: "CarRepairBook",
    description: "Car repair booking platform with admin and user dashboards.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA80XjQsx3pAuOtNPTFVbLHX9BzkjEfer7ndS1v",
    tags: ["Next.js", "Node.js", "Express.js", "MongoDB", "Firebase", "Tailwind CSS", "daisyui"],
    link: "https://car-doctor-lyart.vercel.app/",
    github: "https://github.com/FAHIMXGG/car-doctor",
  },
  {
    id: 5,
    title: "BuySellCar",
    description: "Platform to buy, sell, and list cars with separate admin and user dashboards.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8vaWXd241laORUxEAk4jgC8MKBro3yVY9iZz2",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Firebase", "Tailwind CSS", "daisyui"],
    link: "https://graceful-pithivier-654561.netlify.app/",
    github: "https://github.com/FAHIMXGG/b2c-car-management",
  },
  {
    id: 4,
    title: "ThePencilPalette",
    description: "Platform for drawing courses with dashboards for admin, instructors, and users.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8X28pEGTEzoByqxHPW8OmCYFQg2AV0di9DpaL",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Firebase", "Tailwind CSS", "daisyui", "Stripe"],
    link: "https://ass-12-d2ded.web.app/",
    github: "https://github.com/FAHIMXGG/The_Pencil_Palette",
  },
  {
    id: 7,
    title: "WebAnalyzer",
    description: "Tool to extract site metadata, links, images, and download them as ZIP.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA85kQx2jIE7myflD1Mi0jt3SR8O9kB64FGbaoh",
    tags: ["React", "Node.js", "Express.js", "Tailwind CSS", "Cheerio"],
    link: "https://web-scraping-client.vercel.app/",
    github: "https://github.com/FAHIMXGG/web-scraping-client",
  },
  {
    id: 8,
    title: "Amazon Price Tracker",
    description: "Tracks Amazon product prices and notifies users via email on price updates.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8HML0jCExqVNMCeP7gcUO4fpwWHI0FEXzGmrA",
    tags: ["Next.js", "TypeScript", "Mongoose", "Tailwind CSS", "Nodemailer", "Axios"],
    link: "https://price-tracker-wheat.vercel.app/",
    github: "https://github.com/FAHIMXGG/Price_Tracker",
  },
  {
    id: 11,
    title: "Safar",
    description: "Elementor template kit for travel agencies and tourism businesses.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8Z5owNg6gWMN6jAs89xpfKOI1VHTmuLiF4Ghd",
    tags: ["Elementor", "WordPress", "Travel", "Tourism", "Template Kit"],
    link: "https://safar.kraito.com/",
    github: "",
  },
  {
    id: 9,
    title: "CasePython",
    description: "Create custom phone cases with upload, drag-and-drop, Stripe checkout, and order tracking.",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8N83FG4HVCrUAi3dLK5eFGhBsnkq1Hx4tzMbg",
    tags: ["Next.js", "TypeScript", "Prisma", "Resend", "Shadcn", "Stripe", "Framer Motion", "Dropzone", "Zod"],
    link: "https://casepython.vercel.app/",
    github: "",
  },
  {
    id: 10,
    title: "Real estate",
    description: "Running...",
    image: "https://nhs4sxaav5.ufs.sh/f/tl0YFFZLZVA8aVC82URMU6o0S3kOD97NYGhZts5ujcfPm2qr",
    tags: ["Next.js", "TypeScript", "Running"],
    link: "",
    github: "",
  },
]

export const revalidate = 60

export const metadata = {
  title: "Projects",
  description: "Personal projects and experiments",
}

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-rose-950/20" />

      {/* Decorative blur elements */}
      <div className="fixed top-20 right-20 -z-10 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-500/10 animate-pulse" />
      <div className="fixed bottom-20 left-20 -z-10 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl dark:bg-orange-500/10 animate-pulse delay-1000" />

      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">Personal projects and experiments</p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {projects.map((project) => {
            const hasLive = Boolean(project.link)
            const hasGit = Boolean(project.github)

            return (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image container */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={project.id <= 3}
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                  {/* Title and description */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.tags?.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-amber-100/80 dark:bg-amber-900/30 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-amber-700 dark:text-amber-300 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags && project.tags.length > 4 && (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-muted-foreground">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  {(hasLive || hasGit) && (
                    <div className="flex items-center gap-2 pt-1 sm:pt-2">
                      {hasLive && (
                        <Link
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          Live Demo
                        </Link>
                      )}
                      {hasGit && (
                        <Link
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-accent transition-all duration-200"
                        >
                          <Github className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          GitHub
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
