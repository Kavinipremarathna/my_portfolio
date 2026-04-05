import React, { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config/api";

const BASE_GALLERY_CATEGORIES = [
  "about",
  "skills",
  "workspace",
  "personal",
  "nature",
];

const formatCategoryLabel = (value) =>
  String(value || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/gallery`);
        setPhotos(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPhotos();
  }, []);

  const tabs = useMemo(() => {
    const dynamicCategories = photos
      .map((photo) => String(photo.category || "general").toLowerCase())
      .filter(Boolean);

    return [
      "all",
      ...Array.from(
        new Set([...BASE_GALLERY_CATEGORIES, ...dynamicCategories]),
      ),
    ];
  }, [photos]);

  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab("all");
    }
  }, [tabs, activeTab]);

  const filteredPhotos = useMemo(() => {
    if (activeTab === "all") {
      return photos;
    }
    return photos.filter(
      (photo) =>
        String(photo.category || "general").toLowerCase() === activeTab,
    );
  }, [activeTab, photos]);

  return (
    <div className="min-h-screen bg-primary text-text">
      <Navbar />

      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_33%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.22),transparent_38%),linear-gradient(180deg,#020617_0%,#0b1220_50%,#0f172a_100%)]">
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="container mx-auto px-6 py-20 relative max-w-6xl">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <Sparkles size={14} className="text-accent" />
                Visual Gallery
              </div>

              <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[0.92] text-white tracking-tight">
                Life In
                <br />
                Frames.
              </h1>

              <p className="mt-6 max-w-2xl text-lg md:text-xl leading-8 text-slate-300">
                A curated visual space that captures code, craft, and moments
                beyond the screen.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${
                        isActive
                          ? "border-accent/40 bg-accent/15 text-accent"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      {formatCategoryLabel(tab)}
                    </button>
                  );
                })}
              </div>
            </Motion.div>
          </div>
        </section>

        <section className="py-16 bg-primary">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <div className="inline-flex items-center gap-2 text-slate-300">
                <Camera size={18} className="text-accent" />
                <span className="text-sm uppercase tracking-[0.25em]">
                  {loading ? "Loading" : `${filteredPhotos.length} photos`}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Scroll, explore, and tap into the details.
              </p>
            </div>

            {!loading && filteredPhotos.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-secondary/70 p-10 text-center text-slate-300">
                {activeTab === "nature"
                  ? "Your Nature section is ready. Add your first nature photo from the admin dashboard and keep building your photography skills."
                  : "No photos in this category yet. Add photos from your admin dashboard."}
              </div>
            )}

            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
              {filteredPhotos.map((photo, index) => (
                <Motion.article
                  key={photo._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.03 }}
                  className="group relative mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-secondary/70 shadow-2xl shadow-black/20"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    loading="lazy"
                    className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/35 to-transparent opacity-90" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                      {photo.category || "general"}
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-white">
                      {photo.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-200">
                      {photo.caption}
                    </p>
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

export default Gallery;
