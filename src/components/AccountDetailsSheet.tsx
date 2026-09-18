"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Check, RefreshCw, X, Link as LinkIcon, ArrowRight } from "lucide-react";

interface AccountDetail {
  id: number;
  financialInstitute: string;
  activeStatus: string;
  accountType: string;
  accountNumber: string;
  startDate: string;
  comments: string;
  taxPeriod: string;
  orderIndex: number;
  amountFromHand: number;
}

interface DepositDetail {
  id: number;
  accountNumber: string;
  dateInvested: string;
  amount: number;
  cumulativeAmt: number;
  comments: string;
  orderIndex: number;
  isFinalForAccount?: boolean;
}

interface AccountDetailsSheetProps {
  onNotify?: (msg: string, type?: "success" | "error" | "info") => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return "$0.00";
  return (
    "$" +
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export default function AccountDetailsSheet({ onNotify }: AccountDetailsSheetProps) {
  const [accountDetails, setAccountDetails] = useState<AccountDetail[]>([]);
  const [depositsByAccount, setDepositsByAccount] = useState<Record<string, DepositDetail[]>>({});
  const [totalAmountFromHand, setTotalAmountFromHand] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [depositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [editingDeposit, setEditingDeposit] = useState<DepositDetail | null>(null);
  const [depAccount, setDepAccount] = useState<string>("");
  const [depDate, setDepDate] = useState<string>("");
  const [depAmount, setDepAmount] = useState<string>("");
  const [depComments, setDepComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Edit Account Detail Modal
  const [accModalOpen, setAccModalOpen] = useState<boolean>(false);
  const [editingAcc, setEditingAcc] = useState<AccountDetail | null>(null);
  const [accBank, setAccBank] = useState<string>("CS");
  const [accStatus, setAccStatus] = useState<string>("Active");
  const [accType, setAccType] = useState<string>("Trading Account");
  const [accNumber, setAccNumber] = useState<string>("");
  const [accStartDate, setAccStartDate] = useState<string>("");
  const [accComments, setAccComments] = useState<string>("");
  const [accTaxPeriod, setAccTaxPeriod] = useState<string>("Yearly Tax on Profit in US.");

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const res = await fetch("/api/account-details", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load account details");
      setAccountDetails(json.accountDetails || []);
      setDepositsByAccount(json.depositsByAccount || {});
      setTotalAmountFromHand(json.totalAmountFromHand || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load data");
      if (onNotify) onNotify("Failed to load Account Details", "error");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [onNotify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Deposit Modal
  const handleOpenAddDeposit = (accountNum?: string) => {
    setEditingDeposit(null);
    setDepAccount(accountNum || accountDetails[0]?.accountNumber || "CS 9271");
    setDepDate(new Date().toLocaleDateString("en-US"));
    setDepAmount("");
    setDepComments("");
    setDepositModalOpen(true);
  };

  const handleOpenEditDeposit = (deposit: DepositDetail) => {
    setEditingDeposit(deposit);
    setDepAccount(deposit.accountNumber);
    setDepDate(deposit.dateInvested);
    setDepAmount(String(deposit.amount));
    setDepComments(deposit.comments || "");
    setDepositModalOpen(true);
  };

  const handleSaveDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depAccount) return alert("Select an account.");
    const amt = parseFloat(depAmount);
    if (isNaN(amt) || amt <= 0) return alert("Enter a valid deposit amount greater than zero.");
    if (!depDate.trim()) return alert("Enter a valid investment date.");

    try {
      setIsSubmitting(true);
      if (editingDeposit) {
        const res = await fetch("/api/account-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "edit-deposit",
            data: {
              id: editingDeposit.id,
              accountNumber: depAccount,
              dateInvested: depDate.trim(),
              amount: amt,
              comments: depComments.trim(),
            },
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update deposit");
        setAccountDetails(json.accountDetails || []);
        setDepositsByAccount(json.depositsByAccount || {});
        setTotalAmountFromHand(json.totalAmountFromHand || 0);
        if (onNotify) onNotify(`Deposit updated and linked to Account ${depAccount}!`);
      } else {
        const res = await fetch("/api/account-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add-deposit",
            data: {
              accountNumber: depAccount,
              dateInvested: depDate.trim(),
              amount: amt,
              comments: depComments.trim(),
            },
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to add deposit");
        setAccountDetails(json.accountDetails || []);
        setDepositsByAccount(json.depositsByAccount || {});
        setTotalAmountFromHand(json.totalAmountFromHand || 0);
        if (onNotify) onNotify(`New deposit added and linked to Account ${depAccount}!`);
      }
      setDepositModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving deposit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDeposit = async (id: number, accNum: string) => {
    if (!window.confirm("Are you sure you want to delete this deposit record?")) return;
    try {
      const res = await fetch("/api/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-deposit",
          data: { id },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete deposit");
      setAccountDetails(json.accountDetails || []);
      setDepositsByAccount(json.depositsByAccount || {});
      setTotalAmountFromHand(json.totalAmountFromHand || 0);
      if (onNotify) onNotify(`Deposit deleted. Account ${accNum} principle amount recalculated!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete deposit");
    }
  };

  // Open Edit Account Modal
  const handleOpenEditAccount = (acc: AccountDetail) => {
    setEditingAcc(acc);
    setAccBank(acc.financialInstitute);
    setAccStatus(acc.activeStatus);
    setAccType(acc.accountType);
    setAccNumber(acc.accountNumber);
    setAccStartDate(acc.startDate);
    setAccComments(acc.comments);
    setAccTaxPeriod(acc.taxPeriod);
    setAccModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accNumber.trim()) return alert("Account # is required");
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingAcc ? "edit-account-detail" : "add-account-detail",
          data: {
            id: editingAcc?.id,
            financialInstitute: accBank.trim(),
            activeStatus: accStatus.trim(),
            accountType: accType.trim(),
            accountNumber: accNumber.trim(),
            startDate: accStartDate.trim(),
            comments: accComments.trim(),
            taxPeriod: accTaxPeriod.trim(),
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save account details");
      setAccountDetails(json.accountDetails || []);
      setDepositsByAccount(json.depositsByAccount || {});
      setTotalAmountFromHand(json.totalAmountFromHand || 0);
      setAccModalOpen(false);
      if (onNotify) onNotify(`Account ${accNumber} details saved!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save account");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate dynamic max column widths for Account Details table
  const accColWidths = useMemo(() => {
    const calcW = (header: string, values: string[]) =>
      Math.ceil(Math.max(header.length, ...values.map((v) => String(v || "").length)) * 7.4 + 24);
    return [
      calcW("Financial Institute/Bank", accountDetails.map((a) => a.financialInstitute)),
      calcW("Active Status", accountDetails.map((a) => a.activeStatus)),
      calcW("Account Type", accountDetails.map((a) => a.accountType)),
      calcW("Account #", accountDetails.map((a) => a.accountNumber)),
      calcW("~Start Date", accountDetails.map((a) => a.startDate)),
      calcW("Comments", accountDetails.map((a) => a.comments || "—")),
      calcW("Tax period", accountDetails.map((a) => a.taxPeriod)),
      calcW("Amount from Hand (Principle Amount)", [
        ...accountDetails.map((a) => formatCurrency(a.amountFromHand)),
        formatCurrency(totalAmountFromHand),
      ]),
      80, // Actions column
    ];
  }, [accountDetails, totalAmountFromHand]);

  const accTotalWidth = useMemo(() => accColWidths.reduce((s, w) => s + w, 0), [accColWidths]);

  // Distinct accounts that have deposits or are configured
  const accountsList = useMemo(() => {
    return accountDetails.map((a) => a.accountNumber);
  }, [accountDetails]);

  // Compute Deposit Details columns width
  const allDeposits = useMemo(() => {
    return Object.values(depositsByAccount).flat();
  }, [depositsByAccount]);

  const depColWidths = useMemo(() => {
    const calcW = (header: string, values: string[], min = 70) =>
      Math.ceil(Math.max(min, Math.max(header.length, ...values.map((v) => String(v || "").length)) * 7.4 + 24));
    return [
      calcW("ACC#", allDeposits.map((d) => d.accountNumber), 95),
      calcW("& Date Invested", allDeposits.map((d) => d.dateInvested), 125),
      calcW("Amount", allDeposits.map((d) => formatCurrency(d.amount)), 125),
      calcW("Cumulative Amt", allDeposits.map((d) => formatCurrency(d.cumulativeAmt)), 135),
      calcW("Comments", allDeposits.map((d) => d.comments || "—"), 240),
      85, // Actions
    ];
  }, [allDeposits]);

  const depTotalWidth = useMemo(() => depColWidths.reduce((s, w) => s + w, 0), [depColWidths]);

  return (
    <div className="section-font-summary space-y-6 pb-12 animate-in fade-in duration-150">
      {/* SECTION 1: ACCOUNT DETAILS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,0.65)]">
        {/* Table Title Bar: Unified Navy Linear Gradient matching Account's Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-950/25 bg-[linear-gradient(110deg,#173f68_0%,#245d8f_55%,#1b4b76_100%)] px-3.5 py-1.5 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.07em]">Account Details</h2>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-blue-100">
              {accountDetails.length} Accounts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingAcc(null);
                setAccBank("CS");
                setAccStatus("Active");
                setAccType("Trading Account");
                setAccNumber("");
                setAccStartDate("");
                setAccComments("");
                setAccTaxPeriod("Yearly Tax on Profit in US.");
                setAccModalOpen(true);
              }}
              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold normal-case text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-3 w-3" />
              Add Account
            </button>
            <button
              type="button"
              onClick={() => fetchData(true)}
              className="grid h-6 w-6 place-items-center rounded bg-white/20 hover:bg-white/30 text-white transition"
              title="Refresh data"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Account Details Spreadsheet Table */}
        <div className="freeze-header-scroll relative max-h-[50vh] overflow-auto">
          <table
            className="freeze-header-table table-fixed border-separate border-spacing-0 text-xs"
            style={{ width: accTotalWidth, minWidth: accTotalWidth }}
          >
            <colgroup>
              {accColWidths.map((w, idx) => (
                <col key={idx} style={{ width: w, minWidth: w, maxWidth: w }} />
              ))}
            </colgroup>
            <thead>
              {/* Header row in Periwinkle Slate Blue #D9E1F2 matching Account's Summary */}
              <tr className="border-b border-slate-400 bg-[#D9E1F2] text-center font-bold text-[#1F4E79]">
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Financial Institute/Bank
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Active Status
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Account Type
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Account #
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-center whitespace-nowrap">
                  ~Start Date
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Comments
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Tax period
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-right whitespace-nowrap bg-[#C6D9F1] text-[#1F4E79] font-bold">
                  Amount from Hand
                  <br />
                  <span className="text-[9.5px] font-normal text-slate-700">(Principle Amount)</span>
                </th>
                <th className="border border-slate-300 px-2 py-1.5 text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {accountDetails.map((acc, idx) => {
                const isEven = idx % 2 === 1;
                const isGreenHighlight = acc.accountNumber === "CS 9271";
                return (
                  <tr
                    key={acc.id}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      isEven ? "bg-[#D9E1F2]/40" : "bg-white"
                    }`}
                  >
                    <td className="border border-slate-300 px-3 py-1.5 font-bold text-slate-800 whitespace-nowrap">
                      {acc.financialInstitute}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-300/40">
                        <Check className="h-2.5 w-2.5 text-emerald-600" />
                        {acc.activeStatus}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 font-semibold text-blue-950 whitespace-nowrap">
                      {acc.accountType}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 font-bold text-[#1F4E79] whitespace-nowrap font-mono">
                      {acc.accountNumber}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center text-slate-700 whitespace-nowrap font-mono text-[11px]">
                      {acc.startDate || "—"}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-slate-600 whitespace-nowrap">
                      {acc.comments || "—"}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-slate-700 whitespace-nowrap text-[11px]">
                      {acc.taxPeriod}
                    </td>
                    {/* Amount from Hand (Principle Amount) - dynamically linked strictly to final cumulative deposit! */}
                    <td
                      className={`border border-slate-300 px-3 py-1.5 text-right font-mono font-bold whitespace-nowrap ${
                        isGreenHighlight
                          ? "bg-[#E2EFDA] text-emerald-950"
                          : isEven
                          ? "bg-[#D9E1F2]/60 text-slate-900"
                          : "text-slate-900"
                      }`}
                      title={`Referenced strictly from the final Cumulative Amount in Deposit Details for ${acc.accountNumber}`}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-[9px] text-emerald-700 font-sans" title="Linked from Deposit Details table">
                          <LinkIcon className="h-2.5 w-2.5 inline" />
                        </span>
                        <span>{formatCurrency(acc.amountFromHand)}</span>
                      </div>
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEditAccount(acc)}
                        className="p-1 text-blue-700 hover:text-blue-950 rounded hover:bg-blue-100/50"
                        title="Edit Account Details"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Total Row matching standard workbook style: Green background #E2EFDA */}
              <tr className="bg-[#E2EFDA] font-extrabold text-slate-900 border-t-2 border-slate-400">
                <td colSpan={7} className="border border-slate-400 px-3 py-2 text-right uppercase tracking-wider text-[11px]">
                  Total Principle Amount (Amount from Hand):
                </td>
                <td className="border border-slate-400 px-3 py-2 text-right font-mono text-[13px] text-emerald-950 bg-[#C6E0B4] whitespace-nowrap">
                  {formatCurrency(totalAmountFromHand)}
                </td>
                <td className="border border-slate-400 text-center whitespace-nowrap">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: DEPOSIT DETAILS - AMOUNT FROM HAND */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,0.65)]">
        {/* Banner: Matching Navy Linear Gradient */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-950/25 bg-[linear-gradient(110deg,#173f68_0%,#245d8f_55%,#1b4b76_100%)] px-3.5 py-1.5 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.07em]">
              Deposit Details - Amount from Hand
            </h2>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-blue-100">
              Linked by Account # Reference
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenAddDeposit()}
              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold normal-case text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-3 w-3" />
              Add Deposit
            </button>
          </div>
        </div>

        {/* Deposit Details Table: Sized and styled with the exact same header color coding (#D9E1F2) in par with Account Details */}
        <div className="freeze-header-scroll relative max-h-[60vh] overflow-auto">
          <table
            className="freeze-header-table table-fixed border-separate border-spacing-0 text-xs"
            style={{ width: depTotalWidth, minWidth: depTotalWidth }}
          >
            <colgroup>
              {depColWidths.map((w, idx) => (
                <col key={idx} style={{ width: w, minWidth: w, maxWidth: w }} />
              ))}
            </colgroup>
            <thead>
              {/* Table 2 Header: EXACT same Periwinkle Slate Blue #D9E1F2 matching Account Details and Account's Summary */}
              <tr className="border-b border-slate-400 bg-[#D9E1F2] text-center font-bold text-[#1F4E79]">
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  ACC#
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-center whitespace-nowrap">
                  & Date Invested
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-right whitespace-nowrap">
                  Amount
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-right whitespace-nowrap bg-[#C6D9F1] text-[#1F4E79] font-bold">
                  Cumulative Amt
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Comments
                </th>
                <th className="border border-slate-300 px-2 py-1.5 text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {accountsList.map((accNum, accIdx) => {
                const deps = depositsByAccount[accNum] || [];

                return (
                  <React.Fragment key={accNum}>
                    {/* If there are deposit rows for this account */}
                    {deps.length > 0 ? (
                      deps.map((dep, depIdx) => {
                        const isFinalRow = depIdx === deps.length - 1;
                        return (
                          <tr
                            key={dep.id}
                            className={`transition-colors hover:bg-blue-50/40 ${
                              isFinalRow ? "font-semibold bg-white" : "bg-white"
                            }`}
                          >
                            {/* ACC# shown cleanly on first row */}
                            <td className="border border-slate-300 px-3 py-1.5 font-mono font-bold text-[#1F4E79] bg-white whitespace-nowrap">
                              {depIdx === 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <span>{accNum}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddDeposit(accNum)}
                                    className="p-0.5 text-slate-400 hover:text-emerald-700"
                                    title={`Add deposit for ${accNum}`}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-300 font-normal select-none">·</span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-3 py-1.5 text-center font-mono text-[11px] whitespace-nowrap text-slate-800">
                              {dep.dateInvested}
                            </td>
                            <td className="border border-slate-300 px-3 py-1.5 text-right font-mono whitespace-nowrap text-slate-900">
                              {formatCurrency(dep.amount)}
                            </td>
                            {/* Cumulative Amt - final row highlighted in light green #E2EFDA matching screenshot */}
                            <td
                              className={`border border-slate-300 px-3 py-1.5 text-right font-mono font-bold whitespace-nowrap ${
                                isFinalRow ? "bg-[#E2EFDA] text-emerald-950" : "text-slate-900"
                              }`}
                              title={
                                isFinalRow
                                  ? `Final Cumulative Amount (${formatCurrency(
                                      dep.cumulativeAmt
                                    )}) referenced directly in Account Details for ${accNum}!`
                                  : undefined
                              }
                            >
                              <div className="flex items-center justify-end gap-1.5">
                                {isFinalRow && (
                                  <span
                                    className="text-[9px] font-sans font-bold text-emerald-700"
                                    title="Linked to Account Details table"
                                  >
                                    Linked
                                    <ArrowRight className="h-2.5 w-2.5 inline ml-0.5" />
                                  </span>
                                )}
                                <span>{formatCurrency(dep.cumulativeAmt)}</span>
                              </div>
                            </td>
                            <td className="border border-slate-300 px-3 py-1.5 text-slate-700 text-[11px] whitespace-nowrap">
                              {dep.comments || "—"}
                            </td>
                            <td className="border border-slate-300 px-2 py-1.5 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditDeposit(dep)}
                                  className="p-1 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                                  title="Edit Deposit"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDeposit(dep.id, accNum)}
                                  className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                                  title="Delete Deposit"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      // Empty state for this account
                      <tr key={`empty-${accNum}`} className="bg-slate-50/50">
                        <td className="border border-slate-300 px-3 py-2 font-mono font-bold text-[#1F4E79] whitespace-nowrap">
                          {accNum}
                        </td>
                        <td colSpan={4} className="border border-slate-300 px-3 py-2 text-slate-400 italic text-[11px]">
                          No deposit records yet. Final Cumulative: $0.00
                        </td>
                        <td className="border border-slate-300 px-2 py-2 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenAddDeposit(accNum)}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9.5px] font-bold hover:bg-emerald-700"
                          >
                            <Plus className="h-2.5 w-2.5" />
                            Deposit
                          </button>
                        </td>
                      </tr>
                    )}

                    {/* Clean subtle separator row between accounts */}
                    {accIdx < accountsList.length - 1 && (
                      <tr key={`sep-${accNum}`} className="bg-slate-200/80 select-none pointer-events-none">
                        <td colSpan={6} className="h-1.5 bg-slate-200 border-y border-slate-300 p-0" />
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Banner on Table Architecture & Linking */}
      <div className="flex items-start gap-2.5 rounded-lg border border-blue-200/90 bg-blue-50/70 p-3 text-[11px] text-blue-950 shadow-2xs">
        <LinkIcon className="h-4 w-4 shrink-0 text-blue-700 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-blue-900">
            Independent Table Architecture & Strict Deposit-Only Reference:
          </p>
          <p className="text-slate-600 leading-relaxed text-[10.5px]">
            <strong>Account Details</strong> and <strong>Deposit Details</strong> are stored in separate, dedicated database tables (<code>portfolio_account_details</code> and <code>portfolio_deposit_details</code>).
            The <em>Amount from Hand (Principle Amount)</em> column in the Account Details section is calculated and referenced strictly from the cumulative deposits for each matching <strong>Account #</strong> (e.g. <code>CS 9271 → $47,894.01</code>, <code>CS 9538 → $35,600.00</code>), completely independent of the Account&apos;s Summary table.
          </p>
        </div>
      </div>

      {/* MODAL: ADD / EDIT DEPOSIT */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden flex flex-col">
            <div className="bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-200" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  {editingDeposit ? `Edit Deposit #${editingDeposit.id}` : "Add Deposit - Amount from Hand"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDepositModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveDeposit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Account #</label>
                <select
                  value={depAccount}
                  onChange={(e) => setDepAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  required
                >
                  {accountsList.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">& Date Invested</label>
                <input
                  type="text"
                  value={depDate}
                  onChange={(e) => setDepDate(e.target.value)}
                  placeholder="e.g. 11/6/2024 or 2024-11-06"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={depAmount}
                  onChange={(e) => setDepAmount(e.target.value)}
                  placeholder="e.g. 15000.00"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Comments</label>
                <input
                  type="text"
                  value={depComments}
                  onChange={(e) => setDepComments(e.target.value)}
                  placeholder="e.g. Transfer of Securities(In/Out), Transfer of Cash, Savings Money"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                />
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-900">
                <span className="font-bold block mb-0.5">Automatic Account Linking:</span>
                The running cumulative sum will be recalculated automatically and linked to{" "}
                <strong>Amount from Hand (Principle Amount)</strong> in the Account Details table.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#1F4E79] hover:bg-[#163857] text-white rounded font-bold shadow"
                >
                  {isSubmitting ? "Saving..." : "Save Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ACCOUNT DETAIL */}
      {accModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-200" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  {editingAcc ? `Edit Account ${editingAcc.accountNumber}` : "Add Account Detail"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAccModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAccount} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Financial Institute / Bank</label>
                  <input
                    type="text"
                    value={accBank}
                    onChange={(e) => setAccBank(e.target.value)}
                    placeholder="e.g. CS, RH, ME"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Active Status</label>
                  <select
                    value={accStatus}
                    onChange={(e) => setAccStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Type</label>
                  <input
                    type="text"
                    value={accType}
                    onChange={(e) => setAccType(e.target.value)}
                    placeholder="e.g. Trading Account, Roth IRA"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account #</label>
                  <input
                    type="text"
                    value={accNumber}
                    disabled={!!editingAcc}
                    onChange={(e) => setAccNumber(e.target.value)}
                    placeholder="e.g. CS 9271, RH 8031"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono font-bold text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none disabled:bg-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">~Start Date</label>
                  <input
                    type="text"
                    value={accStartDate}
                    onChange={(e) => setAccStartDate(e.target.value)}
                    placeholder="e.g. Nov-23, Aug-24"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tax period</label>
                  <input
                    type="text"
                    value={accTaxPeriod}
                    onChange={(e) => setAccTaxPeriod(e.target.value)}
                    placeholder="e.g. Yearly Tax on Profit in US."
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Comments</label>
                <input
                  type="text"
                  value={accComments}
                  onChange={(e) => setAccComments(e.target.value)}
                  placeholder="e.g. Divided by 2."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAccModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#1F4E79] hover:bg-[#163857] text-white rounded font-bold shadow"
                >
                  {isSubmitting ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
