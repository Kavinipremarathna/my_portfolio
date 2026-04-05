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

  const contentBlocks = useMemo(() => {
    const content = String(article?.content || "").trim();
    if (!content) return [];

    return content
      .split(/\n\n+/)
      .map((block) => block.trim())
      .filter(Boolean);
  }, [article]);

  return (
    <div className="min-h-screen bg-primary text-text">
      <Navbar />

      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_35%),linear-gradient(180deg,#050c16_0%,#0d1626_58%,#0f172a_100%)]">
          <div className="container mx-auto px-6 py-16 max-w-4xl relative">
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
                <p className="text-xs uppercase tracking-[0.35em] text-accent">
                  {article.category || "Writing"}
                </p>
                <h1 className="mt-4 text-4xl md:text-6xl font-black leading-[0.96] text-white">
                  {article.title}
                </h1>
                <p className="mt-5 text-lg text-slate-300 leading-8">
                  {article.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={15} className="text-accent" />
                    {article.readTime || "-"}
                  </span>
                  <span>{article.date || "-"}</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(article.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      <Tag size={11} className="text-accent" /> {tag}
                    </span>
                  ))}
                </div>
              </Motion.div>
            )}
          </div>
        </section>

        {article && (
          <section className="py-14">
            <article className="container mx-auto px-6 max-w-4xl">
              <div className="rounded-3xl border border-white/10 bg-secondary/60 p-7 md:p-10">
                {contentBlocks.length > 0 ? (
                  <div className="space-y-6 text-slate-200 leading-8 text-lg">
                    {contentBlocks.map((block, index) => (
                      <p key={`${index}-${block.slice(0, 18)}`}>{block}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300 leading-8 text-lg">
                    This article has no content yet.
                  </p>
                )}
              </div>
            </article>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticlePage;
