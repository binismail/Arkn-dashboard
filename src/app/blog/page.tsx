import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Blog & Engineering Insights • ARKN",
  description:
    "Engineering, security architecture, and AI compliance insights from the ARKN team.",
};

const BLOG_POSTS = [
  {
    slug: "how-arkn-redacts-pii-in-browser",
    title: "How ARKN Redacts Sensitive PII In-Browser Before Network Transmission",
    excerpt:
      "A deep dive into candidate pipelines, contextual confidence scoring, and zero-latency client-side interception across ChatGPT, Claude, and Gemini.",
    category: "Security Architecture",
    date: "July 21, 2026",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "decoding-google-gemini-batchexecute-rpc",
    title: "Decoding Google Gemini's Proprietary batchexecute RPC Stream Payload",
    excerpt:
      "How we reverse-engineered Google's nested URL-encoded RPC payloads to enable seamless real-time PII interception on gemini.google.com.",
    category: "Engineering",
    date: "July 18, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "ai-compliance-guide-legal-and-medical-teams",
    title: "Navigating AI Compliance for Enterprise Legal & Medical Teams",
    excerpt:
      "Why regulated professionals are adopting browser-first security boundaries to enforce GDPR, NHS, and SRA data protection guidelines without blocking AI adoption.",
    category: "Compliance",
    date: "July 14, 2026",
    readTime: "4 min read",
    featured: false,
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-5xl mx-auto w-full">
        
        {/* Blog Header */}
        <div className="border-b border-gray-100 pb-10 mb-12 space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[12px] font-mono text-[#1A5C38] font-semibold">
            <span>ARKN Blog</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight">
            Engineering &amp; Security Insights
          </h1>

          <p className="text-sm text-gray-500 font-normal leading-relaxed">
            Technical deep-dives on browser-first AI interception, PII redaction pipelines, and enterprise compliance.
          </p>
        </div>

        {/* Featured Post (Pure Flat Swatch Card - 0 Drop Shadows, 0 Borders) */}
        {BLOG_POSTS.filter((p) => p.featured).map((post) => (
          <article
            key={post.slug}
            className="mb-16 bg-[#F2F8F4] rounded-3xl p-8 sm:p-12 transition-all hover:bg-[#ebf4ef] group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-xs font-mono text-[#1A5C38] font-semibold mb-4">
              <span className="bg-white px-3 py-1 rounded-full text-gray-950 font-medium">
                {post.category}
              </span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight leading-snug group-hover:text-[#1A5C38] transition-colors mb-4">
              {post.title}
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6 max-w-3xl">
              {post.excerpt}
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A5C38] group-hover:underline">
              <span>Read technical article</span>
              <span>→</span>
            </div>
          </article>
        ))}

        {/* Blog Posts Grid (Pure Flat Swatch Cards - 0 Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.filter((p) => !p.featured).map((post) => (
            <article
              key={post.slug}
              className="bg-[#f4f5f6] rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:bg-[#ecede8] transition-all group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                  <span className="text-[#1A5C38] font-semibold">{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-950 tracking-tight leading-snug group-hover:text-[#1A5C38] transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200/50 flex items-center justify-between text-xs font-semibold text-[#1A5C38]">
                <span>Read article</span>
                <span className="text-gray-400 font-normal">{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
