// types/blog.ts

// Minimal author info the API returns on detail view
export interface BlogAuthor {
    name: string
    email?: string
    role?: string
  }
  
  export interface BlogBase {
    _id: string
    title: string
    content: string
    excerpt?: string | null
    tags?: string[]
    categories?: string[]
    isFeatured?: boolean
    thumbnailUrl?: string | null
    views?: number
    createdAt?: string
    updatedAt?: string
  }
  
  // For list endpoints: no author usually
  export type BlogItem = BlogBase
  
  // For detail endpoint: includes author object
  export interface BlogDetail extends BlogBase {
    author?: BlogAuthor
  }
  
  // Standard list response
  export interface BlogListResponse {
    success: boolean
    message?: string
    data: BlogItem[]
    meta?: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
  
  // Create/Update inputs (frontend)
  export type BlogCreateInput = {
    title: string
    content: string
    excerpt?: string
    tags?: string[]
    categories?: string[]
    isFeatured?: boolean
    thumbnailUrl?: string | null
  }
  
  export type BlogUpdateInput = Partial<BlogCreateInput> & { title?: string }
  