import React, { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Clock3, Sparkles } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config/api";

const mediumProfileUrl = "https://medium.com/@kavinipremarathna";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles`);
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(posts.map((post) => post.category)));
    return ["All", ...dynamic.filter(Boolean)];
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (activeFilter === "All") {
      return posts;
    }
    return posts.filter((post) => post.category === activeFilter);
  }, [activeFilter, posts]);

  const featuredPost = useMemo(
    () => posts.find((post) => post.featured) || posts[0],
    [posts],
  );

  return (
    <div className="min-h-screen bg-primary text-text">
      <Navbar />

      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_35%),linear-gradient(180deg,#040b14_0%,#0c1423_55%,#0f172a_100%)]">
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px]" />

          <div className="container mx-auto px-6 py-20 relative max-w-6xl">
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <Sparkles size={14} className="text-accent" />
                Writing
              </div>

              <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[0.92] text-white tracking-tight">
                Blog
              </h1>

              <p className="mt-6 max-w-3xl text-lg md:text-xl leading-8 text-slate-300">
                Thoughts on full-stack engineering, design systems, performance,
                and creative growth through photography.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                {categories.map((category) => {
                  const isActive = activeFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveFilter(category)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition-all ${
                        isActive
                          ? "border-accent/40 bg-accent/15 text-accent"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </Motion.div>
          </div>
        </section>

        <section className="py-16 bg-primary">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <Motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-secondary/70 p-7 md:p-9"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-accent">
                  Featured Post
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl font-black text-white leading-tight">
                  {featuredPost?.title || "No featured article yet"}
                </h2>
                <p className="mt-5 text-slate-300 leading-8 text-lg">
                  {featuredPost?.excerpt ||
                    "Add your first full article from admin to populate this section."}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <BookOpen size={15} className="text-accent" />
                    {featuredPost?.category || "Writing"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={15} className="text-accent" />
                    {featuredPost?.readTime || "-"}
                  </span>
                  <span>{featuredPost?.date || "-"}</span>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {(featuredPost?.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href={featuredPost ? `/blog/${featuredPost.slug}` : "/blog"}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
                  >
                    Read Full Article <ArrowUpRight size={15} />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-accent/35"
                  >
                    Let&apos;s Discuss <ArrowUpRight size={15} />
                  </a>
                </div>
              </Motion.article>

              <Motion.aside
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="rounded-3xl border border-white/10 bg-secondary/70 p-7"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-accent">
                  Publishing
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white leading-tight">
                  Built for full in-site reading
                </h3>
                <p className="mt-4 text-slate-300 leading-7">
                  Articles are now rendered fully on this site. You can still
                  publish to Medium from admin and keep references for each
                  post.
                </p>

                <a
                  href={mediumProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  See My Medium Articles <ArrowUpRight size={14} />
                </a>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 leading-7">
                  Tip: In admin, create articles with source set to
                  <span className="text-accent"> medium </span>
                  and optionally include a Medium URL for reference.
                </div>
              </Motion.aside>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {loading && (
                <div className="rounded-3xl border border-white/10 bg-secondary/60 p-6 text-slate-300 md:col-span-2 xl:col-span-3">
                  Loading articles...
                </div>
              )}

              {!loading && visiblePosts.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-secondary/60 p-6 text-slate-300 md:col-span-2 xl:col-span-3">
                  No articles yet. Add one from the admin panel.
                </div>
              )}

              {visiblePosts.map((post, index) => (
                <Motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-3xl border border-white/10 bg-secondary/60 p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-white leading-tight">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-slate-300 leading-7">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{post.date}</span>
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                    >
                      Read article <ArrowUpRight size={14} />
                    </a>
                  </div>
                </Motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
