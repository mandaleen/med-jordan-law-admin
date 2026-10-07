"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  Languages,
  Quote,
  Heading,
} from "lucide-react";
import { ArticleItem } from "@/lib/mock-data";

export interface ArticleFormData {
  title_en: string;
  title_ar: string;
  slug: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  practiceArea: string;
  author: string;
  status: "Published" | "Draft" | "Scheduled";
  readTime: string;
}

interface ArticleEditorProps {
  isCreatingNew: boolean;
  initialArticle: ArticleItem | null;
  onBack: () => void;
  onSave: (data: ArticleFormData) => void;
}

export function ArticleEditor({
  isCreatingNew,
  initialArticle,
  onBack,
  onSave,
}: ArticleEditorProps) {
  const [editorLanguage, setEditorLanguage] = useState<"en" | "ar">("en");

  // Working draft form fields
  const [formTitleEn, setFormTitleEn] = useState(initialArticle?.title_en || "");
  const [formTitleAr, setFormTitleAr] = useState(initialArticle?.title_ar || "");
  const [formSlug, setFormSlug] = useState(initialArticle?.slug || (isCreatingNew ? "new-legal-insight" : ""));
  const [formExcerptEn, setFormExcerptEn] = useState(initialArticle?.excerpt_en || "");
  const [formExcerptAr, setFormExcerptAr] = useState(initialArticle?.excerpt_ar || "");
  const [formContentEn, setFormContentEn] = useState(initialArticle?.content_en || "");
  const [formContentAr, setFormContentAr] = useState(initialArticle?.content_ar || "");
  const [formArea, setFormArea] = useState(initialArticle?.practiceArea || "Corporate & Commercial");
  const [formAuthor, setFormAuthor] = useState(initialArticle?.author || "Tariq Qudah");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft" | "Scheduled">(
    initialArticle?.status || (isCreatingNew ? "Draft" : "Published")
  );
  const [formReadTime, setFormReadTime] = useState(initialArticle?.readTime || "5 min read");

  const handleSave = () => {
    if (!formTitleEn && !formTitleAr) return;
    onSave({
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
      readTime: formReadTime,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Editor Header */}
      <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
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
            <h2 className="text-lg font-bold text-navy-900">
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
                    ? "bg-white text-navy-900 shadow-xs"
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
                    ? "bg-navy-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>🇯🇴</span>
                <span>العربية (AR Data Model)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0 transition-colors"
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
                className="w-full p-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50 text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            ) : (
              <input
                type="text"
                dir="rtl"
                placeholder="مثال: دليل التعديلات الجديدة على قانون الشركات الأردني 2026"
                value={formTitleAr}
                onChange={(e) => setFormTitleAr(e.target.value)}
                className="w-full p-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50 text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 font-sans"
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
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            ) : (
              <textarea
                rows={2}
                dir="rtl"
                placeholder="موجز يظهر في بطاقات الاستشارات ومحركات البحث..."
                value={formExcerptAr}
                onChange={(e) => setFormExcerptAr(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900 font-sans"
              />
            )}
          </div>

          {/* Block Toolbar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/70 text-xs">
            <button
              type="button"
              onClick={() => {
                const addition = "\n\n## Key Legislative Provision\n";
                if (editorLanguage === "en") setFormContentEn((prev) => prev + addition);
                else setFormContentAr((prev) => prev + "\n\n## النص التشريعي الرئيسي\n");
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg text-slate-700 font-semibold cursor-pointer flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Heading className="w-3.5 h-3.5" />
              Add Heading
            </button>
            <button
              type="button"
              onClick={() => {
                const addition = "\n\n> Legal Citation: Civil Procedure Code Law No. 24 of 1988, Article 114.\n";
                if (editorLanguage === "en") setFormContentEn((prev) => prev + addition);
                else setFormContentAr((prev) => prev + "\n\n> السند القانوني: قانون أصول المحاكمات المدنية رقم 24 لسنة 1988، المادة 114.\n");
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg text-slate-700 font-semibold cursor-pointer flex items-center gap-1 shadow-2xs transition-colors"
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
                className="w-full p-3 text-xs leading-relaxed border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900 font-sans"
              />
            ) : (
              <textarea
                rows={12}
                dir="rtl"
                placeholder="اكتب التحليل القانوني هنا..."
                value={formContentAr}
                onChange={(e) => setFormContentAr(e.target.value)}
                className="w-full p-3 text-xs leading-relaxed border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900 font-sans"
              />
            )}
          </div>
        </div>

        {/* Right 1 Col: Metadata & Publishing Settings */}
        <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4 h-fit">
          <h3 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-100">
            Publishing Metadata
          </h3>

          <div className="flex flex-col gap-3">
            {/* Status */}
            <div>
              <label className="text-xs font-bold text-slate-700">Publishing Status:</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as "Published" | "Draft" | "Scheduled")}
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-semibold text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
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
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900"
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
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900"
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
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>
          </div>

          {/* Instant Publish Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {formStatus === "Published" ? "Publish to Live Site" : "Save Draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
