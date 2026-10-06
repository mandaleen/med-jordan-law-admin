"use client";

import React, { useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  User,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { FinanceTransaction, INITIAL_TRANSACTIONS } from "@/lib/mock-data";

export function FinanceView() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year">("month");
  const [selectedLawyer, setSelectedLawyer] = useState<string>("all");

  // Refund Modal State
  const [refundTxn, setRefundTxn] = useState<FinanceTransaction | null>(null);
  const [refundAmountType, setRefundAmountType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [refundReason, setRefundReason] = useState("Client requested cancellation >48h prior");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExecuteRefund = () => {
    if (!refundTxn) return;
    const isPartial = refundAmountType === "partial" && parseFloat(partialAmount) > 0;
    const amountToRefund = isPartial ? parseFloat(partialAmount) : refundTxn.grossAmount;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === refundTxn.id
          ? {
              ...t,
              status: isPartial ? "Partially Refunded" : "Refunded",
              refundDate: "Today, just now",
              refundReason,
              netAmount: t.netAmount - amountToRefund,
            }
          : t
      )
    );

    showToast(`✓ Gateway refund of $${amountToRefund.toFixed(2)} processed for ${refundTxn.clientName} (Ref: ${refundTxn.txnRef}).`);
    setRefundTxn(null);
    setPartialAmount("");
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.txnRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLawyer = selectedLawyer === "all" || t.lawyerName === selectedLawyer;
    return matchesSearch && matchesLawyer;
  });

  // Calculate totals
  const totalGross = filteredTransactions.reduce((acc, t) => acc + (t.status !== "Refunded" ? t.grossAmount : 0), 0);
  const totalGatewayFees = filteredTransactions.reduce((acc, t) => acc + (t.status !== "Refunded" ? t.gatewayFee : 0), 0);
  const totalNet = filteredTransactions.reduce((acc, t) => acc + (t.status !== "Refunded" ? t.netAmount : 0), 0);
  const totalRefunded = filteredTransactions
    .filter((t) => t.status === "Refunded" || t.status === "Partially Refunded")
    .reduce((acc, t) => acc + t.grossAmount, 0);

  // Lawyer revenue attribution
  const lawyerAttribution = [
    { name: "Tariq Qudah", gross: 10230, cases: 4, percent: 74 },
    { name: "Sara Al-Majali", gross: 2450, cases: 2, percent: 18 },
    { name: "Kareem Masri", gross: 1120, cases: 1, percent: 8 },
  ];

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

      {/* Header & Filter Controls */}
      <div className="apple-glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#0A2342] text-white flex items-center justify-center font-bold shadow-xs">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#0A2342] tracking-tight">Finance & Gateway Settlement</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Gateway Connected
              </span>
            </div>
            <p className="text-[12px] text-slate-400">Payment outcomes, auto-logged settlements & one-click refunds</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search txn ID, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A2342] text-[#0A2342]"
            />
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setDateRange("today")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${dateRange === "today" ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange("week")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${dateRange === "week" ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"}`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange("month")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${dateRange === "month" ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"}`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange("year")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${dateRange === "year" ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"}`}
            >
              YTD
            </button>
          </div>

          {/* Lawyer Filter */}
          <select
            value={selectedLawyer}
            onChange={(e) => setSelectedLawyer(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-[#0A2342] font-medium"
          >
            <option value="all">All Counsel</option>
            <option value="Tariq Qudah">Tariq Qudah</option>
            <option value="Sara Al-Majali">Sara Al-Majali</option>
            <option value="Kareem Masri">Kareem Masri</option>
          </select>
        </div>
      </div>

      {/* REVENUE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Volume */}
        <div className="apple-obsidian-card p-5 text-white rounded-xl flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="font-semibold uppercase tracking-wider">Gross Volume</span>
            <DollarSign className="w-4 h-4 text-blue-300" />
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight my-2">
            ${totalGross.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap truncate">+24.6% vs previous period</span>
          </div>
        </div>

        {/* Net Settled Payouts */}
        <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Net Office Payout</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight text-[#0A2342] my-2 whitespace-nowrap">
            ${totalNet.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold whitespace-nowrap truncate">
            ✓ Available for firm distribution
          </span>
        </div>

        {/* Gateway Processing Fees */}
        <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Gateway Fees (2.5%)</span>
            <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight text-[#0A2342] my-2 whitespace-nowrap">
            ${totalGatewayFees.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 whitespace-nowrap truncate">
            Auto-deducted at transaction clearance
          </span>
        </div>

        {/* Total Refunded */}
        <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Refunded</span>
            <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight text-rose-600 my-2 whitespace-nowrap">
            ${totalRefunded.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 whitespace-nowrap truncate">
            Policy cancellations & waivers
          </span>
        </div>
      </div>

      {/* REVENUE CHARTS & LAWYER ATTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Monthly Trend Visualizer */}
        <div className="lg:col-span-2 apple-glass-card p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0A2342]">Revenue Trajectory & Gateway Settlement</h3>
              <p className="text-xs text-slate-400">Gross intake volume vs net cleared deposits</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800">
              Filtered: {dateRange.toUpperCase()}
            </span>
          </div>

          {/* Simple Clean Bar Chart Representation */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-4 h-44 px-2">
              {[
                { label: "W1", gross: 3200, net: 3120 },
                { label: "W2", gross: 4800, net: 4680 },
                { label: "W3", gross: 2900, net: 2827 },
                { label: "W4 (Current)", gross: 5600, net: 5460, isCurrent: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full max-w-[54px] flex items-end justify-center gap-1.5 h-full">
                    {/* Gross Bar */}
                    <div
                      className="w-1/2 bg-[#0A2342] rounded-t-lg transition-all hover:bg-blue-900 cursor-pointer"
                      style={{ height: `${(bar.gross / 6000) * 100}%` }}
                      title={`Gross: $${bar.gross}`}
                    />
                    {/* Net Bar */}
                    <div
                      className="w-1/2 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400 cursor-pointer"
                      style={{ height: `${(bar.net / 6000) * 100}%` }}
                      title={`Net: $${bar.net}`}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold ${bar.isCurrent ? "text-blue-600 font-bold" : "text-slate-400"}`}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#0A2342]" />
                <span className="text-slate-600 font-medium">Gross Gateway Intake</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-blue-500" />
                <span className="text-slate-600 font-medium">Net Payout Received</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Revenue by Lawyer Attribution */}
        <div className="apple-glass-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#0A2342]">Counsel Attribution</h3>
                <p className="text-xs text-slate-400">Revenue realization by lawyer</p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 pt-4">
              {lawyerAttribution.map((lawyer, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0A2342]">{lawyer.name}</span>
                    <span className="font-mono font-bold text-slate-700">${lawyer.gross.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#0A2342] rounded-full"
                      style={{ width: `${lawyer.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{lawyer.cases} matters settled</span>
                    <span>{lawyer.percent}% share</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 mt-4">
            Consultation fee distribution is audited and reconciled with monthly partner disbursements.
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="apple-glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0A2342]">Gateway Transactions Ledger</h3>
            <p className="text-xs text-slate-400">Every gateway transaction auto-logged with per-row refund actions</p>
          </div>
          <button
            type="button"
            onClick={() => showToast("Exporting transactions CSV...")}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 whitespace-nowrap">Transaction ID</th>
                <th className="py-3 px-4 whitespace-nowrap">Client</th>
                <th className="py-3 px-4 whitespace-nowrap">Service & Counsel</th>
                <th className="py-3 px-4 whitespace-nowrap">Date & Time</th>
                <th className="py-3 px-4 whitespace-nowrap">Gross</th>
                <th className="py-3 px-4 whitespace-nowrap">Gateway Fee</th>
                <th className="py-3 px-4 whitespace-nowrap">Net Payout</th>
                <th className="py-3 px-4 whitespace-nowrap">Method</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Refund Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Txn ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0A2342] whitespace-nowrap">
                    {txn.txnRef}
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {txn.clientAvatar ? (
                        <img
                          src={txn.clientAvatar}
                          alt={txn.clientName}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-[#0A2342] font-bold text-[10px] flex items-center justify-center shrink-0">
                          {txn.clientInitials}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800">{txn.clientName}</span>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-medium text-[#0A2342]">{txn.service}</span>
                      <span className="text-[10px] text-slate-400">Counsel: {txn.lawyerName}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    <div>{txn.date}</div>
                    <div className="text-[10px] text-slate-400">{txn.time}</div>
                  </td>

                  {/* Gross */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono whitespace-nowrap">
                    ${txn.grossAmount.toFixed(2)}
                  </td>

                  {/* Gateway Fee */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    ${txn.gatewayFee.toFixed(2)}
                  </td>

                  {/* Net */}
                  <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono whitespace-nowrap">
                    ${txn.netAmount.toFixed(2)}
                  </td>

                  {/* Method */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium whitespace-nowrap shrink-0 inline-block">
                      {txn.paymentMethod}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 inline-block ${
                        txn.status === "Settled"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : txn.status === "Refunded"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>

                  {/* Refund Action per row */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {txn.status === "Settled" ? (
                      <button
                        type="button"
                        onClick={() => setRefundTxn(txn)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0"
                      >
                        Issue Refund
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                        {txn.status === "Refunded" ? "Reversed" : "Processed"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ROW-SPECIFIC REFUND MODAL */}
      {refundTxn && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2342]">Issue Gateway Refund</h3>
                <p className="text-xs text-slate-400">Ref: {refundTxn.txnRef} · {refundTxn.clientName}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800">{refundTxn.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Original Gross Amount:</span>
                <span className="font-bold text-slate-900">${refundTxn.grossAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Gateway Method:</span>
                <span className="text-slate-700">{refundTxn.paymentMethod}</span>
              </div>
            </div>

            {/* Refund Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Refund Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRefundAmountType("full")}
                  className={`p-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    refundAmountType === "full"
                      ? "bg-[#0A2342] text-white border-[#0A2342]"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Full (${refundTxn.grossAmount.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick={() => setRefundAmountType("partial")}
                  className={`p-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    refundAmountType === "partial"
                      ? "bg-[#0A2342] text-white border-[#0A2342]"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Partial Refund
                </button>
              </div>
            </div>

            {refundAmountType === "partial" && (
              <div>
                <label className="text-xs font-bold text-slate-700">Partial Amount ($):</label>
                <input
                  type="number"
                  placeholder="e.g. 50.00"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Reason for Refund:</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
              >
                <option value="Client requested cancellation &gt;48h prior">Client requested cancellation &gt;48h prior</option>
                <option value="Mutual agreement / emergency postponement">Mutual agreement / emergency postponement</option>
                <option value="Lawyer emergency unavailability">Lawyer emergency unavailability</option>
                <option value="Billing discrepancy correction">Billing discrepancy correction</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRefundTxn(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRefund}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Execute Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
