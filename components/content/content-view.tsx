"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Plus,
  Edit3,
  Globe,
  CheckCircle2,
  X,
} from "lucide-react";
import { ArticleItem, INITIAL_ARTICLES } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/empty-state";
import { ArticleEditor, ArticleFormData } from "./article-editor";

export function ContentView() {
  const [articles, setArticles] = useState<ArticleItem[]>(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Editor State
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenEditor = (article?: ArticleItem) => {
    if (article) {
      setEditingArticle(article);
      setIsCreatingNew(false);
    } else {
      setEditingArticle(null);
      setIsCreatingNew(true);
    }
  };

  const handleSaveArticle = (formData: ArticleFormData) => {
    if (isCreatingNew) {
      const newArt: ArticleItem = {
        id: `art-${Date.now()}`,
        title_en: formData.title_en || "Untitled English Article",
        title_ar: formData.title_ar || "مقال بدون عنوان",
        slug: formData.slug || `article-${Date.now()}`,
        excerpt_en: formData.excerpt_en,
        excerpt_ar: formData.excerpt_ar,
        content_en: formData.content_en,
        content_ar: formData.content_ar,
        practiceArea: formData.practiceArea,
        author: formData.author,
        status: formData.status,
        views: 0,
        lastUpdated: "Today",
        readTime: formData.readTime,
      };
      setArticles([newArt, ...articles]);
      showToast(`✓ Article "${newArt.title_en}" created in ${formData.status} status.`);
    } else if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                title_en: formData.title_en,
                title_ar: formData.title_ar,
                slug: formData.slug,
                excerpt_en: formData.excerpt_en,
                excerpt_ar: formData.excerpt_ar,
                content_en: formData.content_en,
                content_ar: formData.content_ar,
                practiceArea: formData.practiceArea,
                author: formData.author,
                status: formData.status,
                lastUpdated: "Just now",
                readTime: formData.readTime,
              }
            : a
        )
      );
      showToast(`✓ Changes saved to "${formData.title_en}".`);
    }

    setEditingArticle(null);
    setIsCreatingNew(false);
  };

  const filteredArticles = articles.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      a.title_en.toLowerCase().includes(q) ||
      a.title_ar.includes(q) ||
      a.practiceArea.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-navy-950 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* MASTER ARTICLES TABLE VIEW vs NO-CODE EDITOR */}
      {!editingArticle && !isCreatingNew ? (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Header & Filter Controls */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-navy-900 tracking-tight">Legal Insights & Articles</h2>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {articles.length} Insights
                  </span>
                </div>
                <p className="text-xs text-slate-500">Firm thought leadership published directly to the public website</p>
              </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Search Box */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title, practice area, counsel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-8 pe-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900 text-start"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-700 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
              </select>

              {/* Create Article Button */}
              <button
                type="button"
                onClick={() => handleOpenEditor()}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Draft Insight
              </button>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex-1 flex flex-col min-h-[460px] overflow-hidden">
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar min-h-0">
              <table className="w-full text-start border-collapse table-fixed min-w-[1250px]">
                <colgroup>
                  <col className="w-[300px]" />
                  <col className="w-[160px]" />
                  <col className="w-[160px]" />
                  <col className="w-[130px]" />
                  <col className="w-[140px]" />
                  <col className="w-[100px]" />
                  <col className="w-[120px]" />
                  <col className="w-[140px]" />
                </colgroup>
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50/80 border-b border-slate-200/80">
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Article Title (EN / AR)</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Practice Area</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Author</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Status</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Languages</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-end">Views</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Updated</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-end pe-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <EmptyState
                          icon={FileText}
                          title="No articles found"
                          description={
                            searchQuery
                              ? `No legal articles match "${searchQuery}". Check the title, author, or practice area.`
                              : "No articles registered in the system."
                          }
                          actionLabel={searchQuery ? "Clear Search" : undefined}
                          onAction={searchQuery ? () => setSearchQuery("") : undefined}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => (
                      <tr
                        key={art.id}
                        onClick={() => handleOpenEditor(art)}
                        className="hover:bg-slate-50/60 transition-colors duration-150 cursor-pointer group"
                      >
                        {/* 1. Title */}
                        <td className="py-3.5 px-4 align-middle text-start">
                          <div className="flex flex-col min-w-0 pe-2">
                            <span
                              className="font-medium text-slate-900 text-xs group-hover:text-slate-600 transition-colors truncate block leading-snug"
                              title={art.title_en}
                            >
                              {art.title_en}
                            </span>
                            <span
                              className="text-[11px] text-slate-400 truncate block mt-0.5 font-sans"
                              dir="rtl"
                              title={art.title_ar}
                            >
                              {art.title_ar}
                            </span>
                          </div>
                        </td>

                        {/* 2. Area */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span className="font-medium text-slate-700 text-xs">{art.practiceArea}</span>
                        </td>

                        {/* 3. Author */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px] flex items-center justify-center shrink-0 ring-1 ring-slate-200">
                              {art.author.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="text-slate-700 font-medium text-xs">{art.author}</span>
                          </div>
                        </td>

                        {/* 4. Status */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                              art.status === "Published"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                : art.status === "Draft"
                                ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                : "bg-blue-50 text-blue-700 border-blue-200/60"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              art.status === "Published"
                                ? "bg-emerald-500"
                                : art.status === "Draft"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`} />
                            {art.status}
                          </span>
                        </td>

                        {/* 5. AR/EN Indicator */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200/70">
                            <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                            EN + AR Synced
                          </span>
                        </td>

                        {/* 6. Views */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700 text-xs whitespace-nowrap text-end align-middle tabular-nums">
                          {art.views.toLocaleString()}
                        </td>

                        {/* 7. Last Updated */}
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap align-middle text-start">
                          {art.lastUpdated}
                        </td>

                        {/* 8. Edit Action */}
                        <td className="py-3.5 px-4 text-end align-middle whitespace-nowrap pe-5">
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 ms-auto cursor-pointer shadow-none"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary Strip */}
            <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 mt-auto shrink-0">
              <div className="flex items-center gap-4">
                <span>Showing <strong className="text-slate-800">{filteredArticles.length}</strong> of {articles.length} articles</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline">Published: <strong className="text-emerald-700">{articles.filter((a) => a.status === "Published").length}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total Readership:</span>
                <span className="font-mono font-bold text-navy-900 text-[13px]">
                  {articles.reduce((acc, a) => acc + a.views, 0).toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DETAIL VIEW: NO-CODE VISUAL EDITOR WITH AR/EN TOGGLE */
        <ArticleEditor
          isCreatingNew={isCreatingNew}
          initialArticle={editingArticle}
          onBack={() => {
            setEditingArticle(null);
            setIsCreatingNew(false);
          }}
          onSave={handleSaveArticle}
        />
      )}
    </div>
  );
}
