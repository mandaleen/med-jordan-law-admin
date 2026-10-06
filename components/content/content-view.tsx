"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Plus,
  Edit3,
  Globe,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Save,
  Send,
  BookOpen,
  Languages,
  Quote,
  Heading,
} from "lucide-react";
import { ArticleItem, INITIAL_ARTICLES } from "@/lib/mock-data";

export function ContentView() {
  const [articles, setArticles] = useState<ArticleItem[]>(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Editor State
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState<"en" | "ar">("en");
  
  // Working draft form fields
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleAr, setFormTitleAr] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerptEn, setFormExcerptEn] = useState("");
  const [formExcerptAr, setFormExcerptAr] = useState("");
  const [formContentEn, setFormContentEn] = useState("");
  const [formContentAr, setFormContentAr] = useState("");
  const [formArea, setFormArea] = useState("Corporate & Commercial");
  const [formAuthor, setFormAuthor] = useState("Tariq Qudah");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft" | "Scheduled">("Published");
  const [formReadTime, setFormReadTime] = useState("5 min read");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenEditor = (article?: ArticleItem) => {
    if (article) {
      setEditingArticle(article);
      setIsCreatingNew(false);
      setFormTitleEn(article.title_en);
      setFormTitleAr(article.title_ar);
      setFormSlug(article.slug);
      setFormExcerptEn(article.excerpt_en);
      setFormExcerptAr(article.excerpt_ar);
      setFormContentEn(article.content_en);
      setFormContentAr(article.content_ar);
      setFormArea(article.practiceArea);
      setFormAuthor(article.author);
      setFormStatus(article.status);
      setFormReadTime(article.readTime);
    } else {
      setEditingArticle(null);
      setIsCreatingNew(true);
      setFormTitleEn("");
      setFormTitleAr("");
      setFormSlug("new-legal-insight");
      setFormExcerptEn("");
      setFormExcerptAr("");
      setFormContentEn("");
      setFormContentAr("");
      setFormArea("Corporate & Commercial");
      setFormAuthor("Tariq Qudah");
      setFormStatus("Draft");
      setFormReadTime("4 min read");
    }
    setEditorLanguage("en");
  };

  const handleSaveArticle = () => {
    if (!formTitleEn && !formTitleAr) return;

    if (isCreatingNew) {
      const newArt: ArticleItem = {
        id: `art-${Date.now()}`,
        title_en: formTitleEn || "Untitled English Article",
        title_ar: formTitleAr || "مقال بدون عنوان",
        slug: formSlug || `article-${Date.now()}`,
        excerpt_en: formExcerptEn,
        excerpt_ar: formExcerptAr,
        content_en: formContentEn,
        content_ar: formContentAr,
        practiceArea: formArea,
        author: formAuthor,
        status: formStatus,
        views: 0,
        lastUpdated: "Today",
        readTime: formReadTime,
      };
      setArticles([newArt, ...articles]);
      showToast(`✓ Article "${newArt.title_en}" created in ${formStatus} status.`);
    } else if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                title_en: formTitleEn,
                title_ar: formTitleAr,
                slug: formSlug,
                excerpt_en: formExcerptEn,
                excerpt_ar: formExcerptAr,
                content_en: formContentEn,
                content_ar: formContentAr,
                practiceArea: formArea,
                author: formAuthor,
                status: formStatus,
                lastUpdated: "Just now",
                readTime: formReadTime,
              }
            : a
        )
      );
      showToast(`✓ Changes saved to "${formTitleEn}".`);
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
    const matchesStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#0A2342] text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* MASTER LIST VIEW */}
      {!editingArticle && !isCreatingNew ? (
        <div className="flex flex-col gap-4">
          {/* Header Bar */}
          <div className="apple-glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#0A2342] text-white flex items-center justify-center font-bold shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[#0A2342] tracking-tight">Legal Insights & Articles CMS</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-200/50">
                    No-Code Publishing
                  </span>
                </div>
                <p className="text-[12px] text-slate-400">Manage thought leadership, client guides & bilingual legal articles</p>
              </div>
            </div>

            {/* Filter and New Article Button */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles, practice areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A2342] text-[#0A2342]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-[#0A2342] font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <button
                type="button"
                onClick={() => handleOpenEditor()}
                className="px-3.5 py-1.5 rounded-xl bg-[#0A2342] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Write Article (No-Code)
              </button>
            </div>
          </div>

          {/* Articles Table */}
          <div className="apple-glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1020px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4 whitespace-nowrap">Article Title (EN / AR)</th>
                    <th className="py-3 px-4 whitespace-nowrap">Practice Area</th>
                    <th className="py-3 px-4 whitespace-nowrap">Author</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 whitespace-nowrap">Bilingual Model</th>
                    <th className="py-3 px-4 whitespace-nowrap">Views</th>
                    <th className="py-3 px-4 whitespace-nowrap">Last Updated</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredArticles.map((art) => (
                    <tr
                      key={art.id}
                      onClick={() => handleOpenEditor(art)}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                      {/* Title */}
                      <td className="py-3.5 px-4 max-w-[320px]">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0A2342] text-[13px] group-hover:text-blue-600 transition-colors truncate">
                            {art.title_en}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate font-sans text-right" dir="rtl">
                            {art.title_ar}
                          </span>
                        </div>
                      </td>

                      {/* Area */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700">{art.practiceArea}</span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {art.author}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 inline-block ${
                            art.status === "Published"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : art.status === "Draft"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>

                      {/* AR/EN Indicator */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold whitespace-nowrap shrink-0">
                          <Globe className="w-3 h-3 text-blue-600" />
                          EN + AR Synced
                        </span>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600 whitespace-nowrap">
                        {art.views.toLocaleString()}
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {art.lastUpdated}
                      </td>

                      {/* Edit Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-[#0A2342] group-hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 ml-auto whitespace-nowrap shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* DETAIL VIEW: NO-CODE VISUAL EDITOR WITH AR/EN TOGGLE */
        <div className="flex flex-col gap-4">
          {/* Editor Header */}
          <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEditingArticle(null);
                  setIsCreatingNew(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A2342] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Articles Roster
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">No-Code Publishing Studio</span>
              </div>
            </div>

            {/* Title & Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-[#0A2342]">
                  {isCreatingNew ? "Draft New Legal Insight" : `Editing: ${formTitleEn || "Article"}`}
                </h2>
                <p className="text-xs text-slate-400">
                  Publish directly to the firm website without needing developer deployment.
                </p>
              </div>

              {/* AR/EN DATA MODEL TOGGLE */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditorLanguage("en")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      editorLanguage === "en"
                        ? "bg-white text-[#0A2342] shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English Version</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorLanguage("ar")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      editorLanguage === "ar"
                        ? "bg-[#0A2342] text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span>🇯🇴</span>
                    <span>العربية (AR Data Model)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSaveArticle}
                  className="px-4 py-2 rounded-xl bg-[#0A2342] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save & Publish
                </button>
              </div>
            </div>
          </div>

          {/* Bilingual Explanatory Note */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Bilingual Data Architecture:</strong> Switching between <strong>English</strong> and <strong>العربية</strong> updates the same record model. Both languages are stored and indexed so the upcoming Arabic client portal renders seamlessly.
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-blue-700 shrink-0">
              Active Edit: {editorLanguage.toUpperCase()}
            </span>
          </div>

          {/* EDITOR FORM */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 Cols: Main Content Body */}
            <div className="lg:col-span-2 apple-glass-card p-5 rounded-xl flex flex-col gap-4">
              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {editorLanguage === "en" ? "Article Title (English):" : "عنوان المقال (باللغة العربية):"}
                </label>
                {editorLanguage === "en" ? (
                  <input
                    type="text"
                    placeholder="e.g. Navigating Jordan's New Companies Law Amendments 2026"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    className="w-full p-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50 text-[#0A2342] focus:outline-none focus:ring-1 focus:ring-[#0A2342]"
                  />
                ) : (
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثال: دليل التعديلات الجديدة على قانون الشركات الأردني 2026"
                    value={formTitleAr}
                    onChange={(e) => setFormTitleAr(e.target.value)}
                    className="w-full p-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50 text-[#0A2342] focus:outline-none focus:ring-1 focus:ring-[#0A2342] font-sans"
                  />
                )}
              </div>

              {/* Excerpt / Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {editorLanguage === "en" ? "Executive Summary / Excerpt:" : "الموجز التنفيذي / نبذة المقال:"}
                </label>
                {editorLanguage === "en" ? (
                  <textarea
                    rows={2}
                    placeholder="Brief 2-sentence summary shown on cards and social search previews..."
                    value={formExcerptEn}
                    onChange={(e) => setFormExcerptEn(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none"
                  />
                ) : (
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="موجز يظهر في بطاقات الاستشارات ومحركات البحث..."
                    value={formExcerptAr}
                    onChange={(e) => setFormExcerptAr(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none font-sans"
                  />
                )}
              </div>

              {/* Block Toolbar */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/70 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const addition = "\n\n## Key Legislative Provision\n";
                    if (editorLanguage === "en") setFormContentEn(formContentEn + addition);
                    else setFormContentAr(formContentAr + "\n\n## النص التشريعي الرئيسي\n");
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg text-slate-700 font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Heading className="w-3.5 h-3.5" />
                  Add Heading
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const addition = "\n\n> Legal Citation: Civil Procedure Code Law No. 24 of 1988, Article 114.\n";
                    if (editorLanguage === "en") setFormContentEn(formContentEn + addition);
                    else setFormContentAr(formContentAr + "\n\n> السند القانوني: قانون أصول المحاكمات المدنية رقم 24 لسنة 1988، المادة 114.\n");
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg text-slate-700 font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Quote className="w-3.5 h-3.5" />
                  Add Case Law Citation
                </button>
              </div>

              {/* Rich Content Area */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-bold text-slate-700">
                  {editorLanguage === "en" ? "Article Body (English):" : "محتوى المقال (باللغة العربية):"}
                </label>
                {editorLanguage === "en" ? (
                  <textarea
                    rows={12}
                    placeholder="Write your legal insight in plain text or markdown..."
                    value={formContentEn}
                    onChange={(e) => setFormContentEn(e.target.value)}
                    className="w-full p-3 text-xs leading-relaxed border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A2342] font-sans"
                  />
                ) : (
                  <textarea
                    rows={12}
                    dir="rtl"
                    placeholder="اكتب التحليل القانوني هنا..."
                    value={formContentAr}
                    onChange={(e) => setFormContentAr(e.target.value)}
                    className="w-full p-3 text-xs leading-relaxed border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A2342] font-sans"
                  />
                )}
              </div>
            </div>

            {/* Right 1 Col: Metadata & Publishing Settings */}
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4 h-fit">
              <h3 className="text-sm font-bold text-[#0A2342] pb-2 border-b border-slate-100">
                Publishing Metadata
              </h3>

              <div className="flex flex-col gap-3">
                {/* Status */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Publishing Status:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-semibold text-[#0A2342]"
                  >
                    <option value="Published">Published (Live on Website)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                    <option value="Scheduled">Scheduled for Next Week</option>
                  </select>
                </div>

                {/* Practice Area */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Practice Area Category:</label>
                  <select
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-medium text-slate-800"
                  >
                    <option value="Corporate & Commercial">Corporate & Commercial</option>
                    <option value="Arbitration & Dispute Resolution">Arbitration & Dispute Resolution</option>
                    <option value="Real Estate & Land Registry">Real Estate & Land Registry</option>
                    <option value="Patent & IP">Patent & IP</option>
                    <option value="Labor & Employment">Labor & Employment</option>
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Author (Counsel):</label>
                  <select
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-medium text-slate-800"
                  >
                    <option value="Tariq Qudah">Tariq Qudah (Senior Partner)</option>
                    <option value="Sara Al-Majali">Sara Al-Majali (Partner)</option>
                    <option value="Kareem Masri">Kareem Masri (Senior Associate)</option>
                  </select>
                </div>

                {/* URL Slug */}
                <div>
                  <label className="text-xs font-bold text-slate-700">SEO URL Slug:</label>
                  <div className="flex items-center gap-1 mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500">
                    <span className="text-slate-400">/insights/</span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      className="w-full bg-transparent text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Read Time */}
                <div>
                  <label className="text-xs font-bold text-slate-700">Estimated Reading Time:</label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Instant Publish Button */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSaveArticle}
                  className="w-full py-2.5 rounded-xl bg-[#0A2342] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  {formStatus === "Published" ? "Publish to Live Site" : "Save Draft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
