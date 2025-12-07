import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Tag, FolderOpen, Star, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Dummy blog posts with full content
const dummyBlogPosts = [
  {
    id: "1",
    title: "10 Essential Tips for Finding the Perfect Travel Buddy",
    excerpt: "Discover how to connect with like-minded travelers and ensure a smooth journey together. Learn about communication, planning, and compatibility.",
    content: `
      <h2>Introduction</h2>
      <p>Finding the right travel companion can make or break your trip. Whether you're planning a weekend getaway or a months-long adventure, these tips will help you connect with someone who shares your travel style and values.</p>
      
      <h2>1. Define Your Travel Style</h2>
      <p>Before searching for a travel buddy, understand your own preferences. Are you a budget backpacker or a luxury traveler? Do you prefer early mornings or late nights? Knowing yourself helps you find compatible companions.</p>
      
      <h2>2. Use Detailed Profiles</h2>
      <p>Create a comprehensive profile that showcases your interests, travel experience, and what you're looking for. The more information you share, the easier it is for others to determine if you'd be a good match.</p>
      
      <h2>3. Communicate Early and Often</h2>
      <p>Start conversations well before your trip. Discuss expectations, budgets, itinerary preferences, and any deal-breakers. Good communication prevents misunderstandings later.</p>
      
      <h2>4. Plan Together</h2>
      <p>Involve your potential travel buddy in the planning process. This ensures both parties have input and creates a sense of shared ownership of the trip.</p>
      
      <h2>5. Set Clear Boundaries</h2>
      <p>Discuss personal space needs, alone time preferences, and how you'll handle disagreements. Setting boundaries upfront creates a more comfortable travel experience.</p>
      
      <h2>6. Test the Waters</h2>
      <p>Consider meeting for coffee or a short day trip before committing to a longer journey. This helps you gauge compatibility in real-world situations.</p>
      
      <h2>7. Discuss Finances Openly</h2>
      <p>Money can be a sensitive topic, but it's crucial to discuss budgets, payment methods, and how you'll split costs before the trip begins.</p>
      
      <h2>8. Check Reviews and Ratings</h2>
      <p>Look at reviews from previous travel companions. A good track record of positive experiences is a strong indicator of compatibility.</p>
      
      <h2>9. Trust Your Instincts</h2>
      <p>If something feels off, trust your gut. It's better to travel alone than with someone who makes you uncomfortable.</p>
      
      <h2>10. Have a Backup Plan</h2>
      <p>Even with the best planning, things can change. Have a plan for what happens if your travel buddy needs to cancel or if you need to part ways during the trip.</p>
      
      <h2>Conclusion</h2>
      <p>Finding the perfect travel buddy takes time and effort, but the rewards are worth it. A compatible companion can turn a good trip into an unforgettable adventure.</p>
    `,
    tags: ["Travel Tips", "Community", "Planning"],
    categories: ["Tips & Guides"],
    isFeatured: true,
    thumbnailUrl: null,
    views: 1250,
    createdAt: "2024-12-15T10:00:00.000Z",
    author: {
      name: "Travel Expert",
      email: "expert@travelbuddy.com",
      role: "Travel Guide",
    },
  },
  {
    id: "2",
    title: "Solo Travel vs. Group Travel: Which is Right for You?",
    excerpt: "Explore the pros and cons of traveling alone versus with a group. Find out which style matches your personality and travel goals.",
    content: `
      <h2>Introduction</h2>
      <p>The age-old debate: should you travel solo or with a group? Both have their merits, and the best choice depends on your personality, goals, and circumstances.</p>
      
      <h2>Solo Travel: Freedom and Self-Discovery</h2>
      <p>Solo travel offers unparalleled freedom. You set your own schedule, make spontaneous decisions, and answer only to yourself. It's an incredible opportunity for self-discovery and personal growth.</p>
      
      <h3>Pros of Solo Travel</h3>
      <ul>
        <li>Complete freedom and flexibility</li>
        <li>Opportunity for self-reflection and growth</li>
        <li>Easier to meet locals and other travelers</li>
        <li>No compromises on itinerary or activities</li>
        <li>Builds confidence and independence</li>
      </ul>
      
      <h3>Cons of Solo Travel</h3>
      <ul>
        <li>Higher costs (no splitting expenses)</li>
        <li>Safety concerns in some destinations</li>
        <li>Loneliness at times</li>
        <li>No one to share memories with immediately</li>
      </ul>
      
      <h2>Group Travel: Shared Experiences and Safety</h2>
      <p>Traveling with others creates shared memories and provides a safety net. Whether it's friends, family, or new companions, group travel has unique benefits.</p>
      
      <h3>Pros of Group Travel</h3>
      <ul>
        <li>Shared costs and expenses</li>
        <li>Safety in numbers</li>
        <li>Built-in companionship</li>
        <li>Shared responsibilities</li>
        <li>More fun activities possible</li>
      </ul>
      
      <h3>Cons of Group Travel</h3>
      <ul>
        <li>Need to compromise on decisions</li>
        <li>Different energy levels and interests</li>
        <li>Potential conflicts</li>
        <li>Less flexibility</li>
      </ul>
      
      <h2>Finding Your Balance</h2>
      <p>Many travelers find a middle ground: traveling solo for part of a trip and joining groups for other segments. This hybrid approach offers the best of both worlds.</p>
      
      <h2>Conclusion</h2>
      <p>There's no one-size-fits-all answer. Consider your personality, travel goals, and destination when deciding. Remember, you can always try both and see what works best for you!</p>
    `,
    tags: ["Solo Travel", "Group Travel", "Lifestyle"],
    categories: ["Travel Styles"],
    isFeatured: true,
    thumbnailUrl: null,
    views: 980,
    createdAt: "2024-12-12T10:00:00.000Z",
    author: {
      name: "Adventure Seeker",
      email: "adventure@travelbuddy.com",
      role: "Travel Blogger",
    },
  },
  {
    id: "3",
    title: "Budget-Friendly Destinations for 2025",
    excerpt: "Plan your next adventure without breaking the bank. We've compiled a list of amazing destinations that offer incredible experiences on a budget.",
    content: `
      <h2>Introduction</h2>
      <p>Travel doesn't have to be expensive. These destinations offer incredible value, rich experiences, and unforgettable memories without draining your savings.</p>
      
      <h2>1. Vietnam</h2>
      <p>Vietnam offers stunning landscapes, delicious food, and rich culture at incredibly affordable prices. From $20-30 per day, you can enjoy excellent meals, comfortable accommodations, and amazing experiences.</p>
      
      <h2>2. Guatemala</h2>
      <p>Central America's hidden gem offers Mayan ruins, volcanic landscapes, and colonial cities. Budget travelers can enjoy this destination for $25-35 per day.</p>
      
      <h2>3. Nepal</h2>
      <p>Home to the Himalayas, Nepal is a trekker's paradise. Even with guided tours, you can experience this incredible country for $30-40 per day.</p>
      
      <h2>4. Romania</h2>
      <p>Eastern Europe's best-kept secret offers medieval castles, beautiful landscapes, and charming cities. Budget: $30-45 per day.</p>
      
      <h2>5. Morocco</h2>
      <p>Experience the magic of North Africa with bustling souks, desert adventures, and stunning architecture. Budget: $35-50 per day.</p>
      
      <h2>Money-Saving Tips</h2>
      <p>Travel during off-peak seasons, stay in hostels or guesthouses, eat local food, use public transportation, and consider group travel to split costs.</p>
      
      <h2>Conclusion</h2>
      <p>With careful planning and the right destinations, amazing travel experiences are accessible to everyone, regardless of budget.</p>
    `,
    tags: ["Budget Travel", "Destinations", "2025"],
    categories: ["Destinations"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 2100,
    createdAt: "2024-12-10T10:00:00.000Z",
    author: {
      name: "Budget Traveler",
      email: "budget@travelbuddy.com",
      role: "Travel Writer",
    },
  },
  {
    id: "4",
    title: "Safety First: How to Stay Safe While Traveling with Strangers",
    excerpt: "Important safety guidelines and best practices when meeting new travel companions. Learn how to verify profiles and trust your instincts.",
    content: `
      <h2>Introduction</h2>
      <p>Safety should always be your top priority when traveling, especially when meeting new people. These guidelines will help you stay safe while still enjoying the benefits of group travel.</p>
      
      <h2>1. Verify Profiles Thoroughly</h2>
      <p>Check profile completeness, read reviews from previous travelers, verify social media accounts, and look for verified badges or certifications.</p>
      
      <h2>2. Meet in Public First</h2>
      <p>Always meet potential travel companions in a public place first. A coffee shop, restaurant, or busy park are ideal locations for initial meetings.</p>
      
      <h2>3. Share Your Plans</h2>
      <p>Always let someone back home know your travel plans, including who you're traveling with, where you're going, and when you expect to return.</p>
      
      <h2>4. Trust Your Instincts</h2>
      <p>If something feels wrong, trust your gut. It's better to cancel plans than to put yourself in an uncomfortable or dangerous situation.</p>
      
      <h2>5. Keep Emergency Contacts</h2>
      <p>Have emergency contacts saved, know local emergency numbers, and keep copies of important documents in multiple locations.</p>
      
      <h2>6. Set Boundaries</h2>
      <p>Communicate your boundaries clearly and respect others' boundaries. Don't feel pressured to share personal information or engage in activities you're uncomfortable with.</p>
      
      <h2>7. Use Secure Payment Methods</h2>
      <p>Use secure payment platforms, avoid sharing banking information directly, and keep receipts of all transactions.</p>
      
      <h2>8. Stay Connected</h2>
      <p>Regular check-ins with friends or family, share your location when comfortable, and have a plan for staying in touch.</p>
      
      <h2>Conclusion</h2>
      <p>By following these safety guidelines, you can enjoy the benefits of group travel while minimizing risks. Remember: your safety is always more important than being polite.</p>
    `,
    tags: ["Safety", "Security", "Tips"],
    categories: ["Safety"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1750,
    createdAt: "2024-12-08T10:00:00.000Z",
    author: {
      name: "Safety Expert",
      email: "safety@travelbuddy.com",
      role: "Security Advisor",
    },
  },
  {
    id: "5",
    title: "Top 5 Hidden Gems in Southeast Asia",
    excerpt: "Discover off-the-beaten-path destinations that offer authentic experiences away from tourist crowds. Perfect for adventurous travelers.",
    content: `
      <h2>Introduction</h2>
      <p>Southeast Asia is full of incredible destinations, but some of the best experiences are found away from the tourist trail. Here are five hidden gems worth exploring.</p>
      
      <h2>1. Luang Prabang, Laos</h2>
      <p>This UNESCO World Heritage city offers stunning temples, French colonial architecture, and a peaceful atmosphere. Wake up early for the alms-giving ceremony and explore the nearby Kuang Si Falls.</p>
      
      <h2>2. Bagan, Myanmar</h2>
      <p>Home to thousands of ancient temples, Bagan is best explored by bicycle or hot air balloon. The sunrise and sunset views are absolutely breathtaking.</p>
      
      <h2>3. Kampot, Cambodia</h2>
      <p>A charming riverside town known for its pepper plantations and relaxed vibe. Perfect for those looking to escape the crowds and experience authentic Cambodian life.</p>
      
      <h2>4. Ninh Binh, Vietnam</h2>
      <p>Often called "Halong Bay on land," Ninh Binh offers stunning karst landscapes, ancient temples, and peaceful boat rides through rice paddies.</p>
      
      <h2>5. Tana Toraja, Indonesia</h2>
      <p>This remote region of Sulawesi offers unique cultural experiences, traditional architecture, and fascinating funeral ceremonies. A truly off-the-beaten-path destination.</p>
      
      <h2>Travel Tips</h2>
      <p>These destinations require more planning and flexibility than tourist hotspots. Research transportation options, respect local customs, and be prepared for basic accommodations.</p>
      
      <h2>Conclusion</h2>
      <p>Venturing off the beaten path rewards you with authentic experiences and memories that last a lifetime. These hidden gems are waiting to be discovered!</p>
    `,
    tags: ["Southeast Asia", "Hidden Gems", "Adventure"],
    categories: ["Destinations"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1450,
    createdAt: "2024-12-05T10:00:00.000Z",
    author: {
      name: "Adventure Guide",
      email: "adventure@travelbuddy.com",
      role: "Travel Guide",
    },
  },
  {
    id: "6",
    title: "How to Split Costs Fairly on Group Trips",
    excerpt: "A comprehensive guide to managing expenses when traveling with others. Learn about apps, methods, and best practices for fair cost-sharing.",
    content: `
      <h2>Introduction</h2>
      <p>Money matters can strain even the best travel relationships. Here's how to handle expenses fairly and avoid awkward conversations about money.</p>
      
      <h2>1. Discuss Budgets Before You Go</h2>
      <p>Have an open conversation about budgets before booking anything. Understand each person's comfort level with spending to avoid surprises later.</p>
      
      <h2>2. Use Expense Tracking Apps</h2>
      <p>Apps like Splitwise, Tricount, or Settle Up make it easy to track who paid for what and calculate who owes whom. They eliminate the need for constant mental math.</p>
      
      <h2>3. Establish a Shared Fund</h2>
      <p>For group expenses like accommodation or transportation, consider creating a shared fund. Each person contributes equally, and one person manages the fund.</p>
      
      <h2>4. Split Common Expenses Equally</h2>
      <p>For shared costs like accommodation, transportation, and group activities, split equally regardless of individual usage. This keeps things simple and fair.</p>
      
      <h2>5. Handle Personal Expenses Separately</h2>
      <p>Individual expenses like personal meals, souvenirs, or optional activities should be paid separately. Don't expect others to cover your personal choices.</p>
      
      <h2>6. Set Up Payment Methods</h2>
      <p>Agree on payment methods in advance. Consider using digital payment apps that make transfers easy and immediate.</p>
      
      <h2>7. Keep Receipts</h2>
      <p>Save receipts for shared expenses. This helps with tracking and resolving any disputes that might arise.</p>
      
      <h2>8. Settle Up Regularly</h2>
      <p>Don't wait until the end of the trip to settle expenses. Regular check-ins prevent large debts from accumulating and keep relationships healthy.</p>
      
      <h2>9. Be Flexible</h2>
      <p>Sometimes things don't split perfectly. Be willing to compromise and focus on the overall fairness rather than exact penny-pinching.</p>
      
      <h2>10. Communicate Openly</h2>
      <p>If you have concerns about expenses, address them early and directly. Open communication prevents resentment from building up.</p>
      
      <h2>Conclusion</h2>
      <p>With clear communication and the right tools, managing group expenses can be stress-free. Focus on enjoying your trip together rather than worrying about money!</p>
    `,
    tags: ["Budget", "Group Travel", "Finance"],
    categories: ["Tips & Guides"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1320,
    createdAt: "2024-12-03T10:00:00.000Z",
    author: {
      name: "Finance Expert",
      email: "finance@travelbuddy.com",
      role: "Travel Advisor",
    },
  },
  {
    id: "7",
    title: "Building Lasting Friendships Through Travel",
    excerpt: "Real stories from travelers who met their best friends on the road. Discover how shared adventures create unbreakable bonds.",
    content: `
      <h2>Introduction</h2>
      <p>Some of the strongest friendships are forged on the road. Shared adventures, challenges overcome together, and unique experiences create bonds that last a lifetime.</p>
      
      <h2>Why Travel Friendships Are Special</h2>
      <p>Travel friendships are unique because they're built during intense, shared experiences. You see each other at your best and worst, creating a level of intimacy that's hard to achieve in everyday life.</p>
      
      <h2>Real Stories</h2>
      <h3>Sarah and Maria: From Strangers to Best Friends</h3>
      <p>Sarah and Maria met on a group trip to Peru. Despite coming from different countries and backgrounds, they discovered shared values and a similar sense of humor. Five years later, they've traveled to 15 countries together.</p>
      
      <h3>James and Tom: Adventure Partners for Life</h3>
      <p>James and Tom met while backpacking through Southeast Asia. Their shared love of adventure and willingness to try new things created an instant connection. They now plan annual trips together.</p>
      
      <h2>How to Build Travel Friendships</h2>
      <p>Be open to new people, share experiences actively, communicate honestly, and make an effort to stay in touch after the trip ends.</p>
      
      <h2>Maintaining Long-Distance Friendships</h2>
      <p>Regular video calls, planning future trips together, sharing photos and memories, and visiting each other when possible helps maintain these special bonds.</p>
      
      <h2>Conclusion</h2>
      <p>The friendships you make while traveling can be some of the most meaningful relationships in your life. Be open, be yourself, and let the journey bring you together.</p>
    `,
    tags: ["Community", "Friendship", "Stories"],
    categories: ["Community"],
    isFeatured: true,
    thumbnailUrl: null,
    views: 1890,
    createdAt: "2024-12-01T10:00:00.000Z",
    author: {
      name: "Community Builder",
      email: "community@travelbuddy.com",
      role: "Community Manager",
    },
  },
  {
    id: "8",
    title: "Packing Essentials for Every Type of Traveler",
    excerpt: "From minimalist backpackers to luxury travelers, find the perfect packing list for your travel style. Never forget the essentials again.",
    content: `
      <h2>Introduction</h2>
      <p>Packing can make or break your trip. Whether you're a minimalist backpacker or a luxury traveler, here are the essentials you should never leave home without.</p>
      
      <h2>Universal Essentials</h2>
      <ul>
        <li>Passport and copies</li>
        <li>Travel insurance documents</li>
        <li>Emergency contacts</li>
        <li>First aid kit</li>
        <li>Universal adapter</li>
        <li>Portable charger</li>
      </ul>
      
      <h2>For Backpackers</h2>
      <p>Lightweight, multi-purpose items are key. Pack quick-dry clothing, a quality backpack, a sleeping bag liner, and a water bottle with filter.</p>
      
      <h2>For Luxury Travelers</h2>
      <p>Focus on comfort and style. Pack wrinkle-free clothing, quality toiletries, comfortable shoes, and items that make you feel at home.</p>
      
      <h2>For Business Travelers</h2>
      <p>Efficiency is everything. Pack a carry-on with work essentials, wrinkle-free professional clothing, and items that help you stay productive on the road.</p>
      
      <h2>Packing Tips</h2>
      <p>Roll clothes to save space, use packing cubes, pack versatile items, leave room for souvenirs, and always pack a change of clothes in your carry-on.</p>
      
      <h2>Conclusion</h2>
      <p>Good packing is about balance: bringing what you need without overpacking. Remember, you can usually buy things you forget, but you can't always replace lost essentials.</p>
    `,
    tags: ["Packing", "Essentials", "Preparation"],
    categories: ["Tips & Guides"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 1100,
    createdAt: "2024-11-28T10:00:00.000Z",
    author: {
      name: "Packing Pro",
      email: "packing@travelbuddy.com",
      role: "Travel Expert",
    },
  },
  {
    id: "9",
    title: "Cultural Etiquette: How to Respect Local Customs",
    excerpt: "Learn about cultural sensitivity and how to be a respectful traveler. Understanding local customs enhances your experience and builds bridges.",
    content: `
      <h2>Introduction</h2>
      <p>Being a respectful traveler means understanding and honoring local customs. This not only enhances your experience but also builds positive relationships between cultures.</p>
      
      <h2>Research Before You Go</h2>
      <p>Learn about local customs, dress codes, religious practices, and social norms before you arrive. A little research goes a long way in showing respect.</p>
      
      <h2>Dress Appropriately</h2>
      <p>Respect local dress codes, especially in religious sites. When in doubt, err on the side of modesty. Covering up shows respect and often grants you better access to cultural sites.</p>
      
      <h2>Learn Basic Phrases</h2>
      <p>Learning a few words in the local language shows respect and effort. Even simple phrases like "hello," "thank you," and "please" can make a big difference.</p>
      
      <h2>Respect Religious Practices</h2>
      <p>Observe and respect religious customs, even if they're different from your own. Remove shoes when required, cover your head when asked, and be quiet in sacred spaces.</p>
      
      <h2>Understand Social Norms</h2>
      <p>Different cultures have different concepts of personal space, eye contact, and physical touch. Observe locals and follow their lead.</p>
      
      <h2>Photography Etiquette</h2>
      <p>Always ask before taking photos of people, especially in traditional or religious contexts. Some places prohibit photography entirely—respect these rules.</p>
      
      <h2>Be Mindful of Body Language</h2>
      <p>Gestures and body language vary widely across cultures. What's friendly in one place might be offensive in another. When unsure, keep gestures minimal.</p>
      
      <h2>Support Local Culture</h2>
      <p>Buy from local artisans, eat at local restaurants, and participate in cultural experiences. Your support helps preserve traditions.</p>
      
      <h2>Conclusion</h2>
      <p>Cultural sensitivity isn't about perfection—it's about showing respect and making an effort. When you approach new cultures with humility and curiosity, you'll have richer experiences and leave positive impressions.</p>
    `,
    tags: ["Culture", "Etiquette", "Respect"],
    categories: ["Culture"],
    isFeatured: false,
    thumbnailUrl: null,
    views: 950,
    createdAt: "2024-11-25T10:00:00.000Z",
    author: {
      name: "Cultural Guide",
      email: "culture@travelbuddy.com",
      role: "Cultural Advisor",
    },
  },
];

function getPost(id: string) {
  return dummyBlogPosts.find((post) => post.id === id) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id?: string | string[] }>;
}): Promise<Metadata> {
  const p = await params;
  const id = Array.isArray(p.id) ? p.id[0] : p.id;
  if (!id) return { title: "Post", description: "Blog post" };

  const post = getPost(id);
  if (!post) return { title: "Post", description: "Blog post" };

  return {
    title: post.title,
    description: post.excerpt ?? "Blog post",
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id?: string | string[] }>;
}) {
  const p = await params;
  const id = Array.isArray(p.id) ? p.id[0] : p.id;
  if (!id) notFound();

  const post = getPost(id);
  if (!post) notFound();

  const tags = post.tags ?? [];
  const categories = post.categories ?? [];

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <article className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 sm:mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-background/50 backdrop-blur-sm group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        <div className="bg-background/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Thumbnail */}
          <div className="relative h-64 sm:h-80 overflow-hidden bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <div className="w-full h-full flex items-center justify-center">
              <div className="p-6 rounded-xl bg-background/60 backdrop-blur-sm border border-white/10">
                <Plane className="w-16 h-16 text-amber-500/50" />
              </div>
            </div>
            {post.isFeatured && (
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1.5 text-xs sm:text-sm">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                  Featured
                </Badge>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
              {post.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {post.views !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {post.excerpt && (
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed font-light italic border-l-4 border-amber-500/50 pl-4 sm:pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Tags & Categories */}
            {(tags.length > 0 || categories.length > 0) && (
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10">
                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    {tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs sm:text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    {categories.map((cat, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs sm:text-sm"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-neutral dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl
                prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl
                prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl
                prose-p:leading-relaxed prose-p:text-foreground/90
                prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-amber-600 dark:prose-code:text-amber-400 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:border-l-amber-500 prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
                mb-8 sm:mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author */}
            {post.author && (
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background/40 backdrop-blur-sm border border-white/10">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-amber-500/20 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm sm:text-lg font-semibold">
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{post.author.name}</h3>
                      {post.author.role && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs"
                        >
                          {post.author.role}
                        </Badge>
                      )}
                    </div>
                    {post.author.email && (
                      <p className="text-xs sm:text-sm text-muted-foreground break-all">{post.author.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
