"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Link as LinkIcon,
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

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
  onDataChanged?: () => void;
  refreshKey?: number;
}

function formatCurrency(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return "$0.00";
  const num = Number(val);
  const formatted = Math.abs(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return num < 0 ? `-$${formatted}` : `$${formatted}`;
}

// Convert any date format ("Nov-23", "Aug-24", "11/6/2024", ISO, etc.) strictly into m/dd/yyyy format
function formatMDDYYYY(val: string | null | undefined): string {
  if (!val) return "—";
  const str = String(val).trim();
  if (!str || str === "—") return "—";

  const months: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };

  // Month-YY format like Nov-23, Aug-24, Feb-24, Jan-24
  const myMatch = str.match(/^([A-Za-z]{3})[-/](\d{2,4})$/);
  if (myMatch) {
    const m = months[myMatch[1].toLowerCase()] || 1;
    let y = parseInt(myMatch[2], 10);
    if (y < 100) y += 2000;
    return `${m}/01/${y}`;
  }

  // MM/DD/YYYY or M/D/YYYY
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (slashMatch) {
    const m = parseInt(slashMatch[1], 10);
    const d = parseInt(slashMatch[2], 10).toString().padStart(2, "0");
    let y = parseInt(slashMatch[3], 10);
    if (y < 100) y += 2000;
    return `${m}/${d}/${y}`;
  }

  // YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10).toString().padStart(2, "0");
    return `${m}/${d}/${y}`;
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate().toString().padStart(2, "0");
    const y = d.getUTCFullYear();
    return `${m}/${day}/${y}`;
  }

  return str;
}

export default function AccountDetailsSheet({
  onNotify,
  onDataChanged,
  refreshKey,
}: AccountDetailsSheetProps) {
  const [accountDetails, setAccountDetails] = useState<AccountDetail[]>([]);
  const [depositsByAccount, setDepositsByAccount] = useState<
    Record<string, DepositDetail[]>
  >({});
  const [totalAmountFromHand, setTotalAmountFromHand] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected account for highlighting
  const [selectedAccNum, setSelectedAccNum] = useState<string | null>(null);

  // Expand / collapse state for deposit details accounts
  const [collapsedAccounts, setCollapsedAccounts] = useState<Set<string>>(new Set());

  const toggleAccountCollapse = (accNum: string) => {
    setCollapsedAccounts((prev) => {
      const next = new Set(prev);
      if (next.has(accNum)) {
        next.delete(accNum);
      } else {
        next.add(accNum);
      }
      return next;
    });
  };

  const expandAllAccounts = () => setCollapsedAccounts(new Set());
  const collapseAllAccounts = () => setCollapsedAccounts(new Set(accountsList));

  // In-cell editing state for Deposit Amount (allows negative numbers)
  const [editingAmountId, setEditingAmountId] = useState<number | null>(null);
  const [editingAmountVal, setEditingAmountVal] = useState<string>("");
  const [isSavingInline, setIsSavingInline] = useState<boolean>(false);

  // Modal state for Deposit
  const [depositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [editingDeposit, setEditingDeposit] = useState<DepositDetail | null>(null);
  const [depAccount, setDepAccount] = useState<string>("");
  const [depDate, setDepDate] = useState<string>("");
  const [depAmount, setDepAmount] = useState<string>("");
  const [depComments, setDepComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal state for Add Account Detail
  const [addAccModalOpen, setAddAccModalOpen] = useState<boolean>(false);
  const [addBank, setAddBank] = useState<string>("CS");
  const [addStatus, setAddStatus] = useState<string>("Active");
  const [addType, setAddType] = useState<string>("Trading Account");
  const [addNumber, setAddNumber] = useState<string>("");
  const [addStartDate, setAddStartDate] = useState<string>("");
  const [addComments, setAddComments] = useState<string>("");
  const [addTaxPeriod, setAddTaxPeriod] = useState<string>("Yearly Tax on Profit in US.");
  const [addInitialAmount, setAddInitialAmount] = useState<string>("");

  // Modal state for Edit Account Detail (near Add Account)
  const [editAccModalOpen, setEditAccModalOpen] = useState<boolean>(false);
  const [editSelectedAccId, setEditSelectedAccId] = useState<number>(0);
  const [editBank, setEditBank] = useState<string>("CS");
  const [editStatus, setEditStatus] = useState<string>("Active");
  const [editType, setEditType] = useState<string>("Trading Account");
  const [editNumber, setEditNumber] = useState<string>("");
  const [editStartDate, setEditStartDate] = useState<string>("");
  const [editComments, setEditComments] = useState<string>("");
  const [editTaxPeriod, setEditTaxPeriod] = useState<string>("Yearly Tax on Profit in US.");

  const fetchData = useCallback(
    async (silent = false) => {
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
    },
    [onNotify]
  );

  useEffect(() => {
    fetchData(true);
  }, [refreshKey, fetchData]);

  // Open Deposit Modal
  const handleOpenAddDeposit = (accountNum?: string) => {
    setEditingDeposit(null);
    setDepAccount(accountNum || accountDetails[0]?.accountNumber || "CS 9271");
    setDepDate(formatMDDYYYY(new Date().toLocaleDateString("en-US")));
    setDepAmount("");
    setDepComments("");
    setDepositModalOpen(true);
  };

  const handleOpenEditDeposit = (deposit: DepositDetail) => {
    setEditingDeposit(deposit);
    setDepAccount(deposit.accountNumber);
    setDepDate(formatMDDYYYY(deposit.dateInvested));
    setDepAmount(String(deposit.amount));
    setDepComments(deposit.comments || "");
    setDepositModalOpen(true);
  };

  // Direct In-Cell Edit for Deposit Amount (allows negative numbers)
  const startInlineEditAmount = (deposit: DepositDetail) => {
    setEditingAmountId(deposit.id);
    setEditingAmountVal(String(deposit.amount));
  };

  const cancelInlineEditAmount = () => {
    setEditingAmountId(null);
    setEditingAmountVal("");
  };

  const handleSaveInlineAmount = async (deposit: DepositDetail) => {
    const val = parseFloat(editingAmountVal);
    if (isNaN(val) || !Number.isFinite(val) || val === 0) {
      alert("Please enter a valid deposit amount (positive or negative, non-zero).");
      return;
    }

    try {
      setIsSavingInline(true);
      const res = await fetch("/api/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit-deposit",
          data: {
            id: deposit.id,
            amount: val,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update deposit amount");
      setAccountDetails(json.accountDetails || []);
      setDepositsByAccount(json.depositsByAccount || {});
      setTotalAmountFromHand(json.totalAmountFromHand || 0);
      setEditingAmountId(null);
      setEditingAmountVal("");
      if (onNotify)
        onNotify(
          `Deposit amount updated to ${formatCurrency(
            val
          )}! Principle amount recalculated.`
        );
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update amount");
    } finally {
      setIsSavingInline(false);
    }
  };

  const handleSaveDepositModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depAccount) return alert("Select an account.");
    const amt = parseFloat(depAmount);
    if (isNaN(amt) || !Number.isFinite(amt) || amt === 0)
      return alert("Enter a valid deposit amount (positive or negative, non-zero).");
    if (!depDate.trim()) return alert("Enter a valid investment date.");

    try {
      setIsSubmitting(true);
      const cleanDate = formatMDDYYYY(depDate.trim());
      if (editingDeposit) {
        const res = await fetch("/api/account-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "edit-deposit",
            data: {
              id: editingDeposit.id,
              accountNumber: depAccount,
              dateInvested: cleanDate,
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
        if (onNotify)
          onNotify(`Deposit updated and linked to Account ${depAccount}!`);
        if (onDataChanged) onDataChanged();
      } else {
        const res = await fetch("/api/account-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add-deposit",
            data: {
              accountNumber: depAccount,
              dateInvested: cleanDate,
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
        if (onNotify)
          onNotify(`New deposit added and linked to Account ${depAccount}!`);
        if (onDataChanged) onDataChanged();
      }
      setDepositModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving deposit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDeposit = async (id: number, accNum: string) => {
    if (!window.confirm("Are you sure you want to delete this deposit record?"))
      return;
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
      if (onNotify)
        onNotify(
          `Deposit deleted. Account ${accNum} principle amount recalculated!`
        );
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete deposit");
    }
  };

  // Open Edit Account Modal (placed near Add Account)
  const handleOpenEditAccountModal = (targetAccNum?: string) => {
    const acc =
      (targetAccNum && accountDetails.find((a) => a.accountNumber === targetAccNum)) ||
      (selectedAccNum && accountDetails.find((a) => a.accountNumber === selectedAccNum)) ||
      accountDetails[0];

    if (!acc) return alert("No account available to edit.");
    loadAccountIntoEditModal(acc);
    setEditAccModalOpen(true);
  };

  const loadAccountIntoEditModal = (acc: AccountDetail) => {
    setEditSelectedAccId(acc.id);
    setEditNumber(acc.accountNumber);
    setEditBank(acc.financialInstitute);
    setEditStatus(acc.activeStatus);
    setEditType(acc.accountType);
    setEditStartDate(formatMDDYYYY(acc.startDate));
    setEditComments(acc.comments || "");
    setEditTaxPeriod(acc.taxPeriod || "Yearly Tax on Profit in US.");
  };

  const handleSelectAccountToEdit = (accIdNum: number) => {
    const acc = accountDetails.find((a) => a.id === accIdNum);
    if (acc) loadAccountIntoEditModal(acc);
  };

  const handleSaveEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNumber.trim()) return alert("Account # is required");
    try {
      setIsSubmitting(true);
      const cleanStartDate = formatMDDYYYY(editStartDate.trim());
      const res = await fetch("/api/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit-account-detail",
          data: {
            id: editSelectedAccId,
            financialInstitute: editBank.trim(),
            activeStatus: editStatus.trim(),
            accountType: editType.trim(),
            accountNumber: editNumber.trim(),
            startDate: cleanStartDate === "—" ? "" : cleanStartDate,
            comments: editComments.trim(),
            taxPeriod: editTaxPeriod.trim(),
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update account details");
      setAccountDetails(json.accountDetails || []);
      setDepositsByAccount(json.depositsByAccount || {});
      setTotalAmountFromHand(json.totalAmountFromHand || 0);
      setEditAccModalOpen(false);
      if (onNotify)
        onNotify(`Account ${editNumber} details updated successfully!`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccountInModal = async () => {
    const acc = accountDetails.find((a) => a.id === editSelectedAccId);
    if (!acc) return;
    if (
      !window.confirm(
        `Delete Account ${acc.accountNumber}? This will also delete its linked deposits and remove it from Account's Summary.`
      )
    )
      return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-account-detail",
          data: { id: acc.id },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete account");
      setAccountDetails(json.accountDetails || []);
      setDepositsByAccount(json.depositsByAccount || {});
      setTotalAmountFromHand(json.totalAmountFromHand || 0);
      setEditAccModalOpen(false);
      if (onNotify) onNotify(`Account ${acc.accountNumber} removed from all sheets!`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addNumber.trim()) return alert("Account # is required");
    try {
      setIsSubmitting(true);
      const cleanStartDate = formatMDDYYYY(addStartDate.trim());
      const res = await fetch("/api/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-account-detail",
          data: {
            financialInstitute: addBank.trim(),
            activeStatus: addStatus.trim(),
            accountType: addType.trim(),
            accountNumber: addNumber.trim(),
            startDate: cleanStartDate === "—" ? "" : cleanStartDate,
            comments: addComments.trim(),
            taxPeriod: addTaxPeriod.trim(),
            initialAmount: parseFloat(addInitialAmount) || 0,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save account details");
      setAccountDetails(json.accountDetails || []);
      setDepositsByAccount(json.depositsByAccount || {});
      setTotalAmountFromHand(json.totalAmountFromHand || 0);
      setAddAccModalOpen(false);
      if (onNotify)
        onNotify(
          `Account ${addNumber} details saved and linked to Account's Summary!`
        );
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save account");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // COLUMN WIDTHS: Strictly aligned to maximum text character size
  // 1. Reduced Financial Institute/Bank column width to fit text (~100px)
  // 2. Start Date in m/dd/yyyy format
  // 3. Comments and Tax period moved after Principal Amount
  // =========================================================================

  const accColWidths = useMemo(() => {
    const calcMaxContentW = (header: string, values: string[], extraPadding = 22) => {
      const maxLen = Math.max(
        header.length,
        ...values.map((v) => String(v || "").length)
      );
      return Math.ceil(maxLen * 7.4 + extraPadding);
    };

    return [
      calcMaxContentW("Account #", accountDetails.map((a) => a.accountNumber), 26),
      // Reduced Financial Institute/Bank column width to fit text tightly
      100,
      calcMaxContentW("Active Status", accountDetails.map((a) => a.activeStatus), 22),
      calcMaxContentW("Account Type", accountDetails.map((a) => a.accountType), 22),
      calcMaxContentW("~Start Date", accountDetails.map((a) => formatMDDYYYY(a.startDate)), 22),
      calcMaxContentW(
        "Amount from Hand (Principle Amount)",
        [
          ...accountDetails.map((a) => formatCurrency(a.amountFromHand)),
          formatCurrency(totalAmountFromHand),
        ],
        26
      ),
      calcMaxContentW("Comments", accountDetails.map((a) => a.comments || "—"), 22),
      calcMaxContentW("Tax period", accountDetails.map((a) => a.taxPeriod), 24),
    ];
  }, [accountDetails, totalAmountFromHand]);

  const accTotalWidth = useMemo(
    () => accColWidths.reduce((s, w) => s + w, 0),
    [accColWidths]
  );

  // Distinct accounts list
  const accountsList = useMemo(() => {
    return accountDetails.map((a) => a.accountNumber);
  }, [accountDetails]);

  // Table 2 (Deposit Details) - Column widths strictly aligned to max content
  const allDeposits = useMemo(() => {
    return Object.values(depositsByAccount).flat();
  }, [depositsByAccount]);

  const depColWidths = useMemo(() => {
    const calcMaxContentW = (header: string, values: string[], extraPadding = 22) => {
      const maxLen = Math.max(
        header.length,
        ...values.map((v) => String(v || "").length)
      );
      return Math.ceil(maxLen * 7.4 + extraPadding);
    };

    return [
      calcMaxContentW(
        "Account #",
        [...allDeposits.map((d) => d.accountNumber), ...accountsList],
        26
      ),
      calcMaxContentW(
        "Deposit Date",
        allDeposits.map((d) => formatMDDYYYY(d.dateInvested)),
        22
      ),
      // Amount column: includes extra space for inline edit controls & negative sign
      calcMaxContentW(
        "Amount",
        allDeposits.map((d) => formatCurrency(d.amount)),
        32
      ),
      calcMaxContentW(
        "Cumulative Amt",
        allDeposits.map((d) => `Linked -> ${formatCurrency(d.cumulativeAmt)}`),
        24
      ),
      calcMaxContentW(
        "Comments",
        allDeposits.map((d) => d.comments || "—"),
        24
      ),
      76, // Actions column (Edit full & Delete)
    ];
  }, [allDeposits, accountsList]);

  const depTotalWidth = useMemo(
    () => depColWidths.reduce((s, w) => s + w, 0),
    [depColWidths]
  );

  return (
    <div className="section-font-summary space-y-6 pb-12 animate-in fade-in duration-150">
      {/* SECTION 1: ACCOUNT DETAILS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,0.65)]">
        {/* Table Title Bar: Edit Account button placed near Add Account! */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-950/25 bg-[linear-gradient(110deg,#173f68_0%,#245d8f_55%,#1b4b76_100%)] px-3.5 py-1.5 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.07em]">
              Account Details
            </h2>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-blue-100">
              {accountDetails.length} Accounts
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Edit Account button placed near Add Account */}
            <button
              type="button"
              onClick={() => handleOpenEditAccountModal()}
              className="inline-flex items-center gap-1 rounded bg-[#163857] hover:bg-blue-900 border border-blue-400/40 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold normal-case text-white transition shadow-xs active:scale-95"
              title="Edit account details (Institute, Status, Type, Start Date, Comments, Tax Period)"
            >
              <Pencil className="h-3 w-3 text-blue-200" />
              Edit Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAddBank("CS");
                setAddStatus("Active");
                setAddType("Trading Account");
                setAddNumber("");
                setAddStartDate("");
                setAddComments("");
                setAddTaxPeriod("Yearly Tax on Profit in US.");
                setAddInitialAmount("");
                setAddAccModalOpen(true);
              }}
              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold normal-case text-white transition hover:bg-emerald-700 active:scale-95 shadow-xs"
            >
              <Plus className="h-3 w-3" />
              Add Account
            </button>
          </div>
        </div>

        {/* Account Details Spreadsheet Table: strictly fitted to max column width */}
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
              {/* Table 1 Header */}
              <tr className="border-b border-slate-400 bg-[#D9E1F2] text-center font-bold text-[#1F4E79]">
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Account #
                </th>
                {/* Reduced Financial Institute/Bank header with text wrap */}
                <th className="border border-slate-300 px-2 py-1 text-center whitespace-normal leading-tight">
                  <div>Financial Institute/</div>
                  <div>Bank</div>
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Active Status
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Account Type
                </th>
                {/* Start Date in m/dd/yyyy format */}
                <th className="border border-slate-300 px-3 py-1.5 text-center whitespace-nowrap">
                  ~Start Date
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-right whitespace-nowrap bg-[#C6D9F1] text-[#1F4E79] font-bold">
                  Amount from Hand
                  <br />
                  <span className="text-[9.5px] font-normal text-slate-700">
                    (Principle Amount)
                  </span>
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Comments
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Tax period
                </th>
              </tr>
            </thead>
            <tbody>
              {accountDetails.map((acc, idx) => {
                const isEven = idx % 2 === 1;
                const isGreenHighlight = acc.accountNumber === "CS 9271";
                const isSelected = selectedAccNum === acc.accountNumber;

                return (
                  <tr
                    key={acc.id}
                    onClick={() => setSelectedAccNum(acc.accountNumber)}
                    onDoubleClick={() => handleOpenEditAccountModal(acc.accountNumber)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-amber-100/70 ring-1 ring-amber-400 ring-inset"
                        : isEven
                        ? "bg-[#D9E1F2]/40 hover:bg-blue-50/60"
                        : "bg-white hover:bg-blue-50/60"
                    }`}
                    title="Click to select, double-click or use Edit Account above to edit"
                  >
                    {/* Column 1: Account # */}
                    <td className="border border-slate-300 px-3 py-1.5 font-bold text-[#1F4E79] whitespace-nowrap font-mono">
                      {acc.accountNumber}
                    </td>

                    {/* Column 2: Reduced Financial Institute/Bank tightly fitting text */}
                    <td className="border border-slate-300 px-2 py-1.5 font-bold text-center text-slate-800 whitespace-nowrap">
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

                    {/* Column 5: ~Start Date (m/dd/yyyy format) */}
                    <td className="border border-slate-300 px-3 py-1.5 text-center text-slate-700 whitespace-nowrap font-mono text-[11px]">
                      {formatMDDYYYY(acc.startDate)}
                    </td>

                    {/* Column 6: Amount from Hand (Principle Amount) */}
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
                        <span
                          className="text-[9px] text-emerald-700 font-sans"
                          title="Linked from Deposit Details table"
                        >
                          <LinkIcon className="h-2.5 w-2.5 inline" />
                        </span>
                        <span className={acc.amountFromHand < 0 ? "text-red-600" : ""}>
                          {formatCurrency(acc.amountFromHand)}
                        </span>
                      </div>
                    </td>

                    {/* Column 7: Comments (Moved after Principal Amount) */}
                    <td className="border border-slate-300 px-3 py-1.5 text-slate-600 whitespace-nowrap">
                      {acc.comments || "—"}
                    </td>

                    {/* Column 8: Tax period (Moved after Principal Amount) */}
                    <td className="border border-slate-300 px-3 py-1.5 text-slate-700 whitespace-nowrap text-[11px]">
                      {acc.taxPeriod}
                    </td>
                  </tr>
                );
              })}

              {/* Total Row: "Total Amount" */}
              <tr className="bg-[#E2EFDA] font-extrabold text-slate-900 border-t-2 border-slate-400">
                <td
                  colSpan={5}
                  className="border border-slate-400 px-3 py-2 text-right uppercase tracking-wider text-[11px]"
                >
                  Total Amount:
                </td>
                <td className={`border border-slate-400 px-3 py-2 text-right font-mono text-[13px] bg-[#C6E0B4] whitespace-nowrap ${totalAmountFromHand < 0 ? "text-red-700" : "text-emerald-950"}`}>
                  {formatCurrency(totalAmountFromHand)}
                </td>
                <td colSpan={2} className="border border-slate-400 text-center whitespace-nowrap text-slate-400">
                  —
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: DEPOSIT DETAILS TABLE (WITH EDITABLE AMOUNT - ALLOWS NEGATIVE) */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,0.65)]">
        {/* Banner: "Deposit Details" */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-950/25 bg-[linear-gradient(110deg,#173f68_0%,#245d8f_55%,#1b4b76_100%)] px-3.5 py-1.5 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.07em]">
              Deposit Details
            </h2>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-blue-100">
              Linked by Account # Reference
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAllAccounts}
              className="rounded bg-[#163857] hover:bg-blue-900 border border-blue-400/40 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold text-white shadow-xs transition active:scale-95"
              title="Expand all account deposits"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAllAccounts}
              className="rounded bg-[#163857] hover:bg-blue-900 border border-blue-400/40 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold text-white shadow-xs transition active:scale-95"
              title="Collapse all account deposits"
            >
              Collapse All
            </button>
            <button
              type="button"
              onClick={() => handleOpenAddDeposit()}
              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold normal-case text-white transition hover:bg-emerald-700 active:scale-95 shadow-xs"
            >
              <Plus className="h-3 w-3" />
              Add Deposit
            </button>
          </div>
        </div>

        {/* Deposit Details Table: strictly fitted to max column width */}
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
              <tr className="border-b border-slate-400 bg-[#D9E1F2] text-center font-bold text-[#1F4E79]">
                <th className="border border-slate-300 px-3 py-1.5 text-left whitespace-nowrap">
                  Account #
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-center whitespace-nowrap">
                  Deposit Date
                </th>
                {/* Amount column header highlighted in light amber with edit indication */}
                <th className="border border-slate-300 px-3 py-1.5 text-right whitespace-nowrap bg-[#FFF2CC] text-[#78350F] font-bold">
                  <div className="inline-flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <Pencil className="h-2.5 w-2.5 text-amber-600 inline" />
                  </div>
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
                const finalCumulative = deps.length > 0 ? deps[deps.length - 1].cumulativeAmt : 0;
                const isCollapsed = collapsedAccounts.has(accNum);

                return (
                  <React.Fragment key={accNum}>
                    {/* Collapsible Account Group Header Row */}
                    <tr className="bg-[#E7E6E6] border-y border-slate-300 transition-colors">
                      <td colSpan={6} className="border border-slate-300 px-3 py-1">
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => toggleAccountCollapse(accNum)}
                            className="inline-flex items-center gap-1.5 font-bold text-[#1F4E79] hover:text-blue-900 transition text-[11px]"
                            title={isCollapsed ? `Expand deposits for ${accNum}` : `Collapse deposits for ${accNum}`}
                            aria-expanded={!isCollapsed}
                          >
                            {isCollapsed ? (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                            <span className="font-mono">{accNum}</span>
                            <span className="text-[10px] font-normal text-slate-500">
                              ({deps.length} {deps.length === 1 ? "deposit" : "deposits"} · Final: {formatCurrency(finalCumulative)})
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenAddDeposit(accNum)}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium text-[10px] px-2 py-0.5 rounded hover:bg-emerald-50 transition"
                            title={`Add deposit for ${accNum}`}
                          >
                            <Plus className="h-3 w-3" />
                            Add Deposit to {accNum}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Deposit rows shown when expanded */}
                    {!isCollapsed && (
                      deps.length > 0 ? (
                        deps.map((dep, depIdx) => {
                          const isFinalRow = depIdx === deps.length - 1;
                          const isEditingThisAmount = editingAmountId === dep.id;
                          const isNegativeAmount = dep.amount < 0;
                          const isNegativeCumulative = dep.cumulativeAmt < 0;

                          return (
                            <tr
                              key={dep.id}
                              className={`transition-colors hover:bg-blue-50/40 ${
                                isFinalRow ? "font-semibold bg-white" : "bg-white"
                              }`}
                            >
                              {/* Account # */}
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
                                  <span className="text-slate-300 font-normal select-none">
                                    ·
                                  </span>
                                )}
                              </td>

                              {/* Deposit Date in m/dd/yyyy format */}
                              <td className="border border-slate-300 px-3 py-1.5 text-center font-mono text-[11px] whitespace-nowrap text-slate-800">
                                {formatMDDYYYY(dep.dateInvested)}
                              </td>

                              {/* EDITABLE AMOUNT CELL: Direct in-cell edit with double-click or pencil (allows negative) */}
                              <td
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  startInlineEditAmount(dep);
                                }}
                                className={`border border-slate-300 px-2 py-1 text-right font-mono whitespace-nowrap group cursor-pointer transition ${
                                  isEditingThisAmount
                                    ? "bg-amber-50 ring-2 ring-emerald-600 ring-inset"
                                    : "hover:bg-amber-50/50"
                                }`}
                                title="Double-click or click pencil to edit deposit amount (positive or negative)"
                              >
                                {isEditingThisAmount ? (
                                  <div
                                    className="flex items-center justify-end gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="number"
                                      step="any"
                                      autoFocus
                                      value={editingAmountVal}
                                      onChange={(e) => setEditingAmountVal(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleSaveInlineAmount(dep);
                                        }
                                        if (e.key === "Escape") {
                                          cancelInlineEditAmount();
                                        }
                                      }}
                                      disabled={isSavingInline}
                                      placeholder="± Amount"
                                      className="w-24 px-1 py-0.5 bg-white border-2 border-emerald-600 rounded text-right font-mono font-bold text-xs outline-none shadow-xs"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSaveInlineAmount(dep)}
                                      disabled={isSavingInline}
                                      className="p-1 text-emerald-700 hover:bg-emerald-100 rounded"
                                      title="Save Amount (Enter)"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelInlineEditAmount}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                      title="Cancel (Esc)"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startInlineEditAmount(dep);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-700 transition"
                                      title="Edit Amount"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <span
                                      className={`font-semibold ${
                                        isNegativeAmount ? "text-red-600 font-bold" : "text-slate-900"
                                      }`}
                                    >
                                      {formatCurrency(dep.amount)}
                                    </span>
                                  </div>
                                )}
                              </td>

                              {/* Cumulative Amt */}
                              <td
                                className={`border border-slate-300 px-3 py-1.5 text-right font-mono font-bold whitespace-nowrap ${
                                  isFinalRow
                                    ? isNegativeCumulative
                                      ? "bg-red-50 text-red-800"
                                      : "bg-[#E2EFDA] text-emerald-950"
                                    : isNegativeCumulative
                                    ? "text-red-600"
                                    : "text-slate-900"
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
                                      className={`text-[9px] font-sans font-bold ${
                                        isNegativeCumulative ? "text-red-700" : "text-emerald-700"
                                      }`}
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
                                    title="Edit Deposit Details"
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
                          <td colSpan={6} className="border border-slate-300 px-3 py-2 text-slate-400 italic text-[11px] text-center">
                            No deposit records yet for {accNum}. Final Cumulative: $0.00
                          </td>
                        </tr>
                      )
                    )}

                    {/* Separator spacing row between accounts */}
                    {accIdx < accountsList.length - 1 && (
                      <tr
                        key={`sep-${accNum}`}
                        className="bg-slate-200/60 select-none pointer-events-none"
                      >
                        <td
                          colSpan={6}
                          className="h-1 bg-slate-200/60 border-y border-slate-300/80 p-0"
                        />
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>



      {/* MODAL: ADD / EDIT DEPOSIT (ALLOWS NEGATIVE AMOUNTS) */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden flex flex-col">
            <div className="bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-200" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  {editingDeposit
                    ? `Edit Deposit #${editingDeposit.id}`
                    : "Add Deposit - Amount from Hand"}
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
            <form onSubmit={handleSaveDepositModal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Account #
                </label>
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
                <label className="block text-slate-700 font-bold mb-1">
                  Deposit Date (m/dd/yyyy)
                </label>
                <input
                  type="text"
                  value={depDate}
                  onChange={(e) => setDepDate(e.target.value)}
                  placeholder="e.g. 11/06/2024 or 2/22/2024"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Amount ($) <span className="text-[10px] font-normal text-slate-500">(Negative amounts allowed for withdrawals/adjustments)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={depAmount}
                  onChange={(e) => setDepAmount(e.target.value)}
                  placeholder="e.g. 15000.00 or -2500.00"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Comments
                </label>
                <input
                  type="text"
                  value={depComments}
                  onChange={(e) => setDepComments(e.target.value)}
                  placeholder="e.g. Transfer of Securities(In/Out), Transfer of Cash, Savings Money"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                />
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-900">
                <span className="font-bold block mb-0.5">
                  Automatic Account Linking:
                </span>
                The running cumulative sum will be recalculated automatically and
                linked to <strong>Amount from Hand (Principle Amount)</strong> in the
                Account Details table.
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

      {/* MODAL 1: ADD ACCOUNT DETAIL */}
      {addAccModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-200" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  Add Account Detail
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddAccModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAddAccount} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Account #
                  </label>
                  <input
                    type="text"
                    value={addNumber}
                    onChange={(e) => setAddNumber(e.target.value)}
                    placeholder="e.g. CS 9271, RH 8031"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono font-bold text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Financial Institute / Bank
                  </label>
                  <input
                    type="text"
                    value={addBank}
                    onChange={(e) => setAddBank(e.target.value)}
                    placeholder="e.g. CS, RH, ME"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Active Status
                  </label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Account Type
                  </label>
                  <input
                    type="text"
                    value={addType}
                    onChange={(e) => setAddType(e.target.value)}
                    placeholder="e.g. Trading Account, Roth IRA"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ~Start Date (m/dd/yyyy)
                  </label>
                  <input
                    type="text"
                    value={addStartDate}
                    onChange={(e) => setAddStartDate(e.target.value)}
                    placeholder="e.g. 11/01/2023 or Nov-23"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Tax period
                  </label>
                  <input
                    type="text"
                    value={addTaxPeriod}
                    onChange={(e) => setAddTaxPeriod(e.target.value)}
                    placeholder="e.g. Yearly Tax on Profit in US."
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Initial Principle Amount / Deposit ($) <span className="text-[10px] font-normal text-slate-500">(Optional - records initial deposit in Deposit Details)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={addInitialAmount}
                  onChange={(e) => setAddInitialAmount(e.target.value)}
                  placeholder="e.g. 50000.00 or -2000.00 (default: 0.00)"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Comments
                </label>
                <input
                  type="text"
                  value={addComments}
                  onChange={(e) => setAddComments(e.target.value)}
                  placeholder="e.g. Divided by 2."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddAccModalOpen(false)}
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

      {/* MODAL 2: EDIT ACCOUNT DETAIL (PLACED NEAR ADD ACCOUNT) */}
      {editAccModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-200" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  Edit Account Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditAccModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEditAccount} className="p-5 space-y-3.5 text-xs">
              {/* Account Selector Dropdown */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5">
                <label className="block text-blue-950 font-bold mb-1">
                  Select Account to Edit
                </label>
                <select
                  value={editSelectedAccId}
                  onChange={(e) => handleSelectAccountToEdit(Number(e.target.value))}
                  className="w-full bg-white border border-blue-300 rounded p-2 text-xs font-bold text-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79] outline-none"
                >
                  {accountDetails.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNumber} ({acc.financialInstitute} · {acc.accountType}) — Principle: {formatCurrency(acc.amountFromHand)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Account #
                  </label>
                  <input
                    type="text"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    placeholder="e.g. CS 9271, RH 8031"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono font-bold text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Financial Institute / Bank
                  </label>
                  <input
                    type="text"
                    value={editBank}
                    onChange={(e) => setEditBank(e.target.value)}
                    placeholder="e.g. CS, RH, ME"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Active Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Account Type
                  </label>
                  <input
                    type="text"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    placeholder="e.g. Trading Account, Roth IRA"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ~Start Date (m/dd/yyyy)
                  </label>
                  <input
                    type="text"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    placeholder="e.g. 11/01/2023 or 8/01/2024"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Tax period
                  </label>
                  <input
                    type="text"
                    value={editTaxPeriod}
                    onChange={(e) => setEditTaxPeriod(e.target.value)}
                    placeholder="e.g. Yearly Tax on Profit in US."
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Comments
                </label>
                <input
                  type="text"
                  value={editComments}
                  onChange={(e) => setEditComments(e.target.value)}
                  placeholder="e.g. Divided by 2."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDeleteAccountInModal}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded text-xs font-semibold transition"
                  title="Delete this account and its linked deposits"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  Delete Account
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditAccModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#1F4E79] hover:bg-[#163857] text-white rounded font-bold shadow"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
