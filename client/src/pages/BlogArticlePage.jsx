import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { ArrowLeft, Clock3, Tag } from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config/api";

const BlogArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/articles/slug/${slug}`,
        );
        setArticle(response.data || null);
      } catch (err) {
        console.error(err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    void loadArticle();
  }, [slug]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles`);
        setArticles(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        setArticles([]);
      }
    };

    void loadArticles();
  }, []);

  const contentBlocks = useMemo(() => {
    const content = String(article?.content || "").trim();
    if (!content) return [];

    return content
      .split(/\n\n+/)
      .map((block) => block.trim())
      .filter(Boolean);
  }, [article]);

  const relatedArticles = useMemo(() => {
    const currentSlug = article?.slug;
    const currentCategory = article?.category;
    const currentTags = Array.isArray(article?.tags) ? article.tags : [];

    return articles
      .filter((item) => item.slug !== currentSlug)
      .filter((item) => {
        const itemTags = Array.isArray(item.tags) ? item.tags : [];
        const sharesCategory =
          currentCategory && item.category === currentCategory;
        const sharesTag = itemTags.some((tag) => currentTags.includes(tag));
        return sharesCategory || sharesTag;
      })
      .slice(0, 3);
  }, [article, articles]);

  const renderBlock = (block) => {
    if (block.startsWith("## ")) {
      return (
        <h2 className="mt-10 border-t border-white/10 pt-6 text-[1.3rem] md:text-[1.45rem] font-semibold leading-[1.3] tracking-tight text-white">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }

    if (block.startsWith("### ")) {
      return (
        <h3 className="mt-8 text-[1.05rem] md:text-[1.15rem] font-semibold leading-[1.36] tracking-tight text-white">
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }

    return (
      <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] tracking-[0.002em] text-slate-200">
        {block}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-primary text-text">
      <Navbar />

      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_38%),linear-gradient(180deg,#050c16_0%,#0c1525_58%,#0f172a_100%)]">
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />

          <div className="container mx-auto px-6 py-16 max-w-6xl relative">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-accent/35"
            >
              <ArrowLeft size={15} /> Back to Blog
            </a>

            {loading ? (
              <div className="mt-8 text-slate-300">Loading article...</div>
            ) : !article ? (
              <div className="mt-8 rounded-2xl border border-white/10 bg-secondary/70 p-6 text-slate-300">
                Article not found.
              </div>
            ) : (
              <Motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mt-8"
              >
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-secondary/70 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
                  {article.imageUrl ? (
                    <div className="relative h-[280px] md:h-[380px]">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
                          {article.category || "Writing"}
                        </p>
                        <h1 className="mt-3 max-w-4xl font-sans text-[1.8rem] md:text-[2.6rem] font-semibold leading-[1.15] tracking-tight text-white">
                          {article.title}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <div className="p-7 md:p-9">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
                        {article.category || "Writing"}
                      </p>
                      <h1 className="mt-3 max-w-4xl font-sans text-[1.8rem] md:text-[2.6rem] font-semibold leading-[1.15] tracking-tight text-white">
                        {article.title}
                      </h1>
                    </div>
                  )}

                  <div className="p-6 md:p-8 border-t border-white/10">
                    <p className="max-w-4xl font-sans text-[0.95rem] md:text-[1rem] text-slate-300 leading-[1.75] tracking-[0.002em]">
                      {article.excerpt}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 size={15} className="text-accent" />
                        {article.readTime || "-"}
                      </span>
                      <span>{article.date || "-"}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(article.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                        >
                          <Tag size={11} className="text-accent" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Motion.div>
            )}
          </div>
        </section>

        {article && (
          <section className="py-14">
            <article className="container mx-auto px-6 max-w-6xl">
              <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                <aside className="lg:sticky lg:top-28 h-fit rounded-2xl border border-white/10 bg-secondary/60 p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                    Article Info
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-400">Category:</span>{" "}
                      {article.category || "Writing"}
                    </p>
                    <p>
                      <span className="text-slate-400">Read time:</span>{" "}
                      {article.readTime || "-"}
                    </p>
                    <p>
                      <span className="text-slate-400">Published:</span>{" "}
                      {article.date || "-"}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(article.tags || []).slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </aside>

                <div className="rounded-3xl border border-white/10 bg-secondary/60 p-7 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
                  {contentBlocks.length > 0 ? (
                    <div className="mx-auto max-w-3xl space-y-5 text-slate-200">
                      {contentBlocks.map((block, index) => (
                        <div key={`${index}-${block.slice(0, 18)}`}>
                          {renderBlock(block)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="max-w-3xl text-slate-300 text-[0.9rem] md:text-[0.95rem] leading-[1.85] tracking-[0.004em]">
                      This article has no content yet.
                    </p>
                  )}
                </div>
              </div>
            </article>
          </section>
        )}

        {article && relatedArticles.length > 0 && (
          <section className="pb-16">
            <div className="container mx-auto px-6 max-w-5xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="font-sans text-2xl md:text-[1.9rem] font-semibold tracking-tight text-white">
                  Related Articles
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {relatedArticles.map((item) => (
                  <a
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-secondary/60 transition-transform hover:-translate-y-0.5 hover:border-accent/35"
                  >
                    {item.imageUrl ? (
                      <div className="h-36 overflow-hidden border-b border-white/10 bg-black/20">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-36 border-b border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.25),rgba(15,23,42,0.85))]" />
                    )}

                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-accent">
                        {item.category || "Writing"}
                      </p>
                      <h3 className="mt-3 font-sans text-[1.05rem] md:text-[1.1rem] font-semibold text-white leading-[1.35]">
                        {item.title}
                      </h3>
                      <p className="mt-3 font-sans text-[0.9rem] text-slate-300 leading-[1.7]">
                        {item.excerpt}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticlePage;
