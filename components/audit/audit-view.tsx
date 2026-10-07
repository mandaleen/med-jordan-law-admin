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
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "ISSUE_REFUND":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "EXECUTE_CONTRACT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "VIEW_DOCUMENT":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "DOWNLOAD_DOCUMENT":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "UPLOAD_DOCUMENT":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60";
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy-900">System Security Audit Trail</h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/70">
              Compliance Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable legal ledger recording document access, refunds, conflict clearance decisions, and contract executions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-none transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Forensic CSV
          </button>
        </div>
      </div>

      {/* Overview Metric Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Logged Operations</span>
            <div className="text-xl font-bold text-navy-900 mt-0.5">{logs.length}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Conflict Waivers</span>
            <div className="text-xl font-bold text-amber-600 mt-0.5">
              {logs.filter((l) => l.action === "CLEAR_CONFLICT").length}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Refunds Issued</span>
            <div className="text-xl font-bold text-rose-600 mt-0.5">
              {logs.filter((l) => l.action === "ISSUE_REFUND").length}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tamper Protection</span>
            <div className="text-xl font-bold text-emerald-600 mt-0.5">Active</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor name, role, IP address, resource ID, or detail..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
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
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
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
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse table-fixed min-w-[1180px]">
            <colgroup>
              <col className="w-[140px]" />
              <col className="w-[170px]" />
              <col className="w-[160px]" />
              <col className="w-[150px]" />
              <col className="w-[290px]" />
              <col className="w-[130px]" />
              <col className="w-[140px]" />
            </colgroup>
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/80 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Operation Details</th>
                <th className="py-3 px-4">IP Origin</th>
                <th className="py-3 px-4 text-right pr-5">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No audit records matching specified filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                      {log.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 text-xs">{log.actorName}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">{log.actorRole}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Resource Target */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-slate-600 text-[11px] font-mono">
                          {log.resourceType}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          #{log.resourceId}
                        </span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="text-xs leading-relaxed line-clamp-2">
                        {log.resourceDetails}
                      </span>
                    </td>

                    {/* IP Origin */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.ipAddress}</span>
                      </div>
                    </td>

                    {/* Integrity */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right pr-5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
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
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>Immutable WORM Storage: Log entries cannot be pruned, updated, or rewritten by any staff role.</span>
          </div>
          <span>Showing <strong className="text-slate-800">{filteredLogs.length}</strong> of {logs.length} entries</span>
        </div>
      </div>
    </div>
  );
}
