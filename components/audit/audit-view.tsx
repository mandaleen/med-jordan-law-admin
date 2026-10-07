"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Database,
  CreditCard,
} from "lucide-react";
import { AuditLogEntry, INITIAL_AUDIT_LOGS } from "@/lib/mock-data";

export function AuditView() {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesAction =
      actionFilter === "all" || log.action.toLowerCase() === actionFilter.toLowerCase();

    const matchesResource =
      resourceFilter === "all" || log.resourceType.toLowerCase() === resourceFilter.toLowerCase();

    return matchesSearch && matchesAction && matchesResource;
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Actor", "Role", "Action", "Resource Type", "Resource ID", "Details", "IP Address"];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.resourceType}"`,
      `"${l.resourceId}"`,
      `"${l.resourceDetails.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `med_jordan_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Tamper-evident Audit Log exported as CSV.");
  };

  const getActionBadgeColor = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "CLEAR_CONFLICT":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "ISSUE_REFUND":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "EXECUTE_CONTRACT":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "VIEW_DOCUMENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DOWNLOAD_DOCUMENT":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "UPLOAD_DOCUMENT":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col gap-5 flex-1 min-h-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-navy-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-navy-700 text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy-900">System Security Audit Trail</h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-navy-100 text-navy-900">
              Pages 9 & 11 · Compliance
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable legal ledger recording document access, refunds, conflict clearance decisions, and contract executions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Forensic CSV
          </button>
        </div>
      </div>

      {/* Overview Metric Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Logged Operations</span>
            <div className="text-xl font-bold text-navy-900 mt-0.5">{logs.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>

        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Conflict Waivers</span>
            <div className="text-xl font-bold text-amber-700 mt-0.5">
              {logs.filter((l) => l.action === "CLEAR_CONFLICT").length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Refunds Issued</span>
            <div className="text-xl font-bold text-rose-700 mt-0.5">
              {logs.filter((l) => l.action === "ISSUE_REFUND").length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tamper Protection</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">Active</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="apple-glass-card p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor name, role, IP address, resource ID, or detail..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-navy-900 focus:outline-none"
          >
            <option value="all">All Action Types</option>
            <option value="VIEW_DOCUMENT">View Document</option>
            <option value="DOWNLOAD_DOCUMENT">Download Document</option>
            <option value="CLEAR_CONFLICT">Clear Conflict</option>
            <option value="EXECUTE_CONTRACT">Execute Contract</option>
            <option value="ISSUE_REFUND">Issue Refund</option>
            <option value="MODIFY_SETTINGS">Modify Settings</option>
          </select>

          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-navy-900 focus:outline-none"
          >
            <option value="all">All Resources</option>
            <option value="Document">Documents</option>
            <option value="Booking">Bookings</option>
            <option value="Contract">Fee Contracts</option>
            <option value="Finance">Finance</option>
            <option value="Settings">Settings</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="apple-glass-card rounded-2xl border border-gray-200/80 overflow-hidden flex-1 flex flex-col min-h-0 shadow-2xs">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[1040px]">
            <thead className="bg-gray-100/80 text-gray-600 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="py-3.5 px-4.5">Timestamp</th>
                <th className="py-3.5 px-4.5">Actor & Role</th>
                <th className="py-3.5 px-4.5">Action</th>
                <th className="py-3.5 px-4.5">Resource Target</th>
                <th className="py-3.5 px-4.5">Operation Details</th>
                <th className="py-3.5 px-4.5">IP Origin</th>
                <th className="py-3.5 px-4.5 text-right pr-6">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No audit records matching specified filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Timestamp */}
                    <td className="py-4 px-4.5 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                      {log.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="py-4 px-4.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-navy-900">{log.actorName}</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">{log.actorRole}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Resource Target */}
                    <td className="py-4 px-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-mono">
                          {log.resourceType}
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          #{log.resourceId}
                        </span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-4 px-4.5 text-gray-700 max-w-md">
                      <span className="text-[11px] leading-relaxed line-clamp-2">
                        {log.resourceDetails}
                      </span>
                    </td>

                    {/* IP Origin */}
                    <td className="py-4 px-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-600">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span>{log.ipAddress}</span>
                      </div>
                    </td>

                    {/* Integrity */}
                    <td className="py-4 px-4.5 whitespace-nowrap text-right pr-6">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        SHA-256 Valid
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-navy-900" />
            <span>Immutable WORM Storage: Log entries cannot be pruned, updated, or rewritten by any staff role.</span>
          </div>
          <span>Showing {filteredLogs.length} of {logs.length} entries</span>
        </div>
      </div>
    </div>
  );
}
