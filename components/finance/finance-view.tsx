"use client";

import React, { useState } from "react";
import { StatTile, StatGrid } from "@/components/ui/stat-tile";
import { Segmented } from "@/components/ui/segmented";
import { PageHeader } from "@/components/ui/page-header";
import {
  Wallet,
  ArrowDownLeft,
  RotateCcw,
  Search,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Download,
  TrendingUp,
  FileText,
  X,
} from "lucide-react";
import { FinanceTransaction, INITIAL_TRANSACTIONS } from "@/lib/mock-data";
import { ClientAvatar } from "@/components/ui/client-avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { TaxInvoiceModal, TaxInvoiceData } from "@/components/modals/tax-invoice-modal";
import { FinanceRefundModal } from "./finance-refund-modal";
import { FinanceCharts } from "./finance-charts";

export function FinanceView() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year">("month");
  const [selectedLawyer, setSelectedLawyer] = useState<string>("all");

  // Tax Invoice Modal State
  const [taxInvoiceModalData, setTaxInvoiceModalData] = useState<TaxInvoiceData | null>(null);

  // Refund Modal State
  const [refundTxn, setRefundTxn] = useState<FinanceTransaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmRefund = (
    txnId: string,
    amountToRefund: number,
    refundReason: string,
    isPartial: boolean
  ) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId
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

    const client = transactions.find((t) => t.id === txnId)?.clientName || "Client";
    showToast(`✓ Gateway refund of $${amountToRefund.toFixed(2)} processed for ${client}.`);
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

      <PageHeader title="Finance" description="Revenue, payouts and transactions across counsel and payment methods." />

      <div className="surface-card p-3 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search txn ID, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-8 pe-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900 text-navy-900 text-start"
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

          <Segmented
            label="Date range"
            value={dateRange}
            onChange={setDateRange}
            options={(["today", "week", "month", "year"] as const).map((range) => ({
              id: range,
              label: <span className="capitalize">{range === "year" ? "YTD" : range}</span>,
            }))}
          />

          {/* Lawyer Filter */}
          <select
            value={selectedLawyer}
            onChange={(e) => setSelectedLawyer(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-navy-900 font-medium"
          >
            <option value="all">All Counsel</option>
            <option value="Tariq Qudah">Tariq Qudah</option>
            <option value="Sara Al-Majali">Sara Al-Majali</option>
            <option value="Kareem Masri">Kareem Masri</option>
          </select>
        </div>
      </div>

      <StatGrid>
        <StatTile
          dark
          title="Gross"
          icon={DollarSign}
          value={`$${totalGross.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          chip={<><TrendingUp className="w-3 h-3" />24.6%</>}
          caption="vs previous period"
        />
        <StatTile
          title="Net Payout"
          icon={ArrowDownLeft}
          value={`$${totalNet.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          chip="Available"
          chipTone="success"
          delay={60}
        />
        <StatTile
          title="Fees (2.5%)"
          icon={CreditCard}
          value={`$${totalGatewayFees.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          caption="Auto-deducted"
          delay={120}
        />
        <StatTile
          title="Refunded"
          icon={RotateCcw}
          value={`$${totalRefunded.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          chip="Cancellations"
          chipTone="error"
          delay={180}
        />
      </StatGrid>

      {/* REVENUE CHARTS & LAWYER ATTRIBUTION */}
      <FinanceCharts dateRange={dateRange} lawyerAttribution={lawyerAttribution} />

      {/* TRANSACTIONS TABLE */}
      <div className="surface-table shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex-1 flex flex-col min-h-[460px]">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-navy-900">Transactions</h3>
          </div>
          <button
            type="button"
            onClick={() => showToast("Exporting transactions CSV...")}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-none self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar min-h-0">
          <table className="w-full text-start border-collapse table-fixed min-w-[1400px]">
            <colgroup>
              <col className="w-[130px]" />
              <col className="w-[170px]" />
              <col className="w-[210px]" />
              <col className="w-[130px]" />
              <col className="w-[100px]" />
              <col className="w-[105px]" />
              <col className="w-[115px]" />
              <col className="w-[100px]" />
              <col className="w-[130px]" />
              <col className="w-[210px]" />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">ID</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Client</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Service</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Date</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-end">Gross</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-end">Fee</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-end">Net</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Method</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-start">Status</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-end pe-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center">
                    <EmptyState
                      icon={Wallet}
                      title="No transactions found"
                      description={
                        searchQuery
                          ? `No transactions match "${searchQuery}". Check the transaction reference or client name.`
                          : "No financial entries registered for the selected period."
                      }
                      actionLabel={searchQuery ? "Clear Search" : undefined}
                      onAction={searchQuery ? () => setSearchQuery("") : undefined}
                    />
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                    {/* 1. Txn ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-navy-900 text-xs whitespace-nowrap align-middle text-start">
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 inline-block">
                        {txn.txnRef}
                      </span>
                    </td>

                    {/* 2. Client */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-middle text-start">
                      <div className="flex items-center gap-2.5">
                        <ClientAvatar
                          name={txn.clientName}
                          src={txn.clientAvatar}
                          initials={txn.clientInitials}
                          shape="circle"
                          className="w-7 h-7 rounded-full ring-1 ring-slate-200 shrink-0"
                          fallbackClassName="text-[10px] font-bold rounded-full"
                        />
                        <span className="font-medium text-slate-900 text-xs truncate max-w-[120px]">{txn.clientName}</span>
                      </div>
                    </td>

                    {/* 3. Service */}
                    <td className="py-3.5 px-4 align-middle text-start">
                      <div className="flex flex-col min-w-0 pe-2">
                        <span className="font-medium text-slate-900 text-xs truncate leading-tight">{txn.service}</span>
                        <span className="text-[11px] text-slate-400 truncate mt-0.5">Counsel: {txn.lawyerName}</span>
                      </div>
                    </td>

                    {/* 4. Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-middle text-start">
                      <div className="flex flex-col font-mono">
                        <span className="font-medium text-slate-700 text-xs">{txn.date}</span>
                        <span className="text-[10px] text-slate-400">{txn.time}</span>
                      </div>
                    </td>

                    {/* 5. Gross */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 whitespace-nowrap text-end align-middle text-xs tabular-nums">
                      ${txn.grossAmount.toFixed(2)}
                    </td>

                    {/* 6. Gateway Fee */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs whitespace-nowrap text-end align-middle tabular-nums">
                      -${txn.gatewayFee.toFixed(2)}
                    </td>

                    {/* 7. Net Payout */}
                    <td className="py-3.5 px-4 font-semibold text-emerald-600 font-mono whitespace-nowrap text-end align-middle text-xs tabular-nums">
                      ${txn.netAmount.toFixed(2)}
                    </td>

                    {/* 8. Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-middle text-start">
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200/70 inline-block">
                        {txn.paymentMethod}
                      </span>
                    </td>

                    {/* 9. Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-middle text-start">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                          txn.status === "Settled"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : txn.status === "Refunded"
                            ? "bg-rose-50 text-rose-700 border-rose-200/60"
                            : "bg-amber-50 text-amber-700 border-amber-200/60"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          txn.status === "Settled"
                            ? "bg-emerald-500"
                            : txn.status === "Refunded"
                            ? "bg-rose-500"
                            : "bg-amber-500"
                        }`} />
                        {txn.status}
                      </span>
                    </td>

                    {/* 10. Actions per row */}
                    <td className="py-3.5 px-4 text-end whitespace-nowrap align-middle pe-5">
                      <div className="flex items-center justify-end gap-1.5 shrink-0 flex-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            setTaxInvoiceModalData({
                              invoiceNumber: `INV-${txn.txnRef.replace(/[^0-9]/g, "").slice(-5) || "88120"}`,
                              issueDate: `${txn.date}, ${txn.time}`,
                              clientName: txn.clientName,
                              clientPhone: "+962 7 9000 0000",
                              clientEmail: `${txn.clientName.toLowerCase().replace(/\s+/g, ".")}@example.jo`,
                              serviceDescription: txn.service,
                              lawyerName: txn.lawyerName,
                              grossAmount: txn.grossAmount,
                              taxRatePercent: 16,
                              paymentMethod: txn.paymentMethod,
                              gatewayRef: txn.txnRef,
                              status: txn.status === "Settled" ? "Settled" : "Refunded",
                            })
                          }
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-none"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          Invoice
                        </button>

                        {txn.status === "Settled" ? (
                          <button
                            type="button"
                            onClick={() => setRefundTxn(txn)}
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-rose-600 text-xs font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-none"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                            Refund
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono inline-flex items-center gap-1 shrink-0 px-1">
                            <CheckCircle2 className="w-3 h-3 text-slate-300" />
                            {txn.status === "Refunded" ? "Reversed" : "Processed"}
                          </span>
                        )}
                      </div>
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
            <span>Showing <strong className="text-slate-800">{filteredTransactions.length}</strong> transactions</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">Gross Volume: <strong className="font-mono text-slate-800">${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">Fees: <strong className="font-mono text-slate-600">-${totalGatewayFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total Net:</span>
            <span className="font-mono font-bold text-emerald-700 text-[13px]">
              ${totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL: Accessible Dialog-based Refund Modal */}
      <FinanceRefundModal
        isOpen={!!refundTxn}
        onClose={() => setRefundTxn(null)}
        transaction={refundTxn}
        onConfirmRefund={handleConfirmRefund}
      />

      {/* Official Jordan Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={!!taxInvoiceModalData}
        onClose={() => setTaxInvoiceModalData(null)}
        invoice={taxInvoiceModalData}
      />
    </div>
  );
}
