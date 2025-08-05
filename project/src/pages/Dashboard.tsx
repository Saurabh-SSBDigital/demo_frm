import React, { useEffect, useState } from "react";
import { Eye, X, AlertTriangle } from "lucide-react";

interface Account {
  id: number;
  pacsName: string;
  pacsAccountNo: string;
  memberAccountNo: string;
  memberAccountName: string;
  memberOutstanding: string;
  memberDueDate: string;
  limitSanctioned: string;
  outstandingAmount: string;
  brNo: string;

  // Optional fields for alerts
  memberUnpaidPrinciple?: string;
  memberProdName?: string;
  memberIrregularity?: string;
  memberLimitSanctioned?: string;
  prevYearLimit?: string;
  disbursementDate?: string;
  lastAtmTransaction?: string;
  atmDistance?: string;
  withdrawCount?: number;
  fullWithdrawalCount?: number;
  mobileNo?: string;
  aadhaarNo?: string;

  // Optional fields for account modal
  srNo?: string;
  pacsProductCodeAndName?: string;
  customerNo?: string;
  drawingPower?: string;
  dueDate?: string;
  rateOfIntPacs?: string;
  accruedIntPacs?: string;
  expiryRatePacs?: string;
  memberSrNo?: string;
  memberCustomerNo?: string;
  memberDrawingPower?: string;
  memberRateOfInt?: string;
  memberAccruedInt?: string;
  memberExpiryRate?: string;
}

interface AlertItem {
  id: number;
  type: string;
  description: string;
  status: "Pending" | "Resolved";
  accountNo?: string;
  linkedAccount?: Account;
}

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [distinctPacsNames, setDistinctPacsNames] = useState<string[]>([]);
  const [selectedPacsName, setSelectedPacsName] = useState<string>("");
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [alertToResolve, setAlertToResolve] = useState<AlertItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination for accounts
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Pagination for alerts
  const [alertPage, setAlertPage] = useState(1);
  const alertsPerPage = 5;
  const totalAlertPages = Math.ceil(alerts.length / alertsPerPage);
  const paginatedAlerts = alerts.slice(
    (alertPage - 1) * alertsPerPage,
    alertPage * alertsPerPage
  );

  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [inspectionAccount, setInspectionAccount] = useState<Account | null>(
    null
  );

  function generateAlerts(accounts: Account[]): AlertItem[] {
    const alerts: AlertItem[] = [];
    let idCounter = 1;

    const addAlert = (type: string, description: string, acc: Account) => {
      alerts.push({
        id: idCounter++,
        type,
        description,
        status: "Pending",
        accountNo: acc.memberAccountNo,
        linkedAccount: acc,
      });
    };

    // 🔹 1. Repayment default but fresh KCC sanctioned prior to closure
    accounts.forEach((acc) => {
      if (
        parseFloat(acc.memberOutstanding || "0") > 0 &&
        parseFloat(acc.memberUnpaidPrinciple || "0") > 0
      ) {
        addAlert(
          "KCC CASH",
          `Repayment default: Member ${acc.memberAccountName} has outstanding with new KCC issued.`,
          acc
        );
      }
    });

    // 🔹 2. Repetitive KCC KIND loans in the same season
    const kindLoanMap: Record<string, Account[]> = {};
    accounts.forEach((acc) => {
      if (acc.memberProdName?.toUpperCase().includes("KIND")) {
        kindLoanMap[acc.memberCustomerNo || acc.memberAccountNo] =
          kindLoanMap[acc.memberCustomerNo || acc.memberAccountNo] || [];
        kindLoanMap[acc.memberCustomerNo || acc.memberAccountNo].push(acc);
      }
    });
    Object.entries(kindLoanMap).forEach(([accNo, accList]) => {
      if (accList.length > 1) {
        accList.forEach((acc) =>
          addAlert(
            "KCC KIND",
            `Repetitive KCC Kind loan for account ${accNo} in the same season.`,
            acc
          )
        );
      }
    });

    // 🔹 3. KCC amount not repaid but not marked NPA
    accounts.forEach((acc) => {
      if (
        parseFloat(acc.memberOutstanding || "0") > 0 &&
        parseFloat(acc.memberIrregularity || "0") === 0
      ) {
        addAlert(
          "KCC LOAN",
          `Account ${acc.memberAccountNo} overdue but not marked NPA.`,
          acc
        );
      }
    });

    // 🔹 4. PACS staff as loan beneficiary
    accounts.forEach((acc) => {
      if (acc.memberAccountName?.toUpperCase().includes("STAFF")) {
        addAlert(
          "STAFF LOAN",
          `PACS staff ${acc.memberAccountName} is a loan beneficiary.`,
          acc
        );
      }
    });

    // 🔹 5. KCC limit increase > 15% year on year
    accounts.forEach((acc) => {
      const prevYear = parseFloat(acc.prevYearLimit || "0");
      const current = parseFloat(acc.memberLimitSanctioned || "0");
      if (prevYear > 0 && current > prevYear * 1.15) {
        addAlert(
          "KCC LIMIT INCREASE",
          `KCC limit increased more than 15% year-on-year for ${acc.memberAccountName}.`,
          acc
        );
      }
    });

    // 🔹 6. Disbursement on weekends / holidays (needs `disbursementDate`)
    accounts.forEach((acc) => {
      if (acc.disbursementDate && acc.disbursementDate !== "99/99/9999") {
        const dateParts = acc.disbursementDate.split("/");
        const jsDate = new Date(
          Number(dateParts[2]),
          Number(dateParts[1]) - 1,
          Number(dateParts[0])
        );
        const day = jsDate.getDay(); // 0=Sun,6=Sat
        if (day === 0 || day === 6) {
          addAlert(
            "DISBURSEMENT TIMING",
            `Loan disbursed on weekend for ${acc.memberAccountName}.`,
            acc
          );
        }
      }
    });

    // 🔹 7. KCC disbursed but no savings bank activity (requires SB txn data)
    accounts.forEach((acc) => {
      if (
        acc.memberProdName?.toUpperCase().includes("KCC") &&
        parseFloat(acc.memberOutstanding || "0") > 0 &&
        acc.lastAtmTransaction === undefined
      ) {
        addAlert(
          "NO SB ACTIVITY",
          `KCC account ${acc.memberAccountNo} has no linked SB activity.`,
          acc
        );
      }
    });

    // 🔹 8. ATM usage > 20,000 at distance > 50 km
    accounts.forEach((acc) => {
      if (
        parseFloat(acc.atmDistance || "0") > 50 &&
        parseFloat(acc.outstandingAmount || "0") > 20000
      ) {
        addAlert(
          "ATM DISTANCE",
          `High-value ATM usage (>20k) at distance >50 km for ${acc.memberAccountName}.`,
          acc
        );
      }
    });

    // 🔹 9. Frequent full withdrawals (>2 in a month)
    accounts.forEach((acc) => {
      if ((acc.fullWithdrawalCount || 0) > 2) {
        addAlert(
          "FREQUENT FULL WITHDRAWAL",
          `Frequent full withdrawals for ${acc.memberAccountName}.`,
          acc
        );
      }
    });

    // 🔹 10. Sudden activity in dormant account (>6 months)
    // Requires lastAtmTransaction or lastTxnDate in real data
    accounts.forEach((acc) => {
      if (acc.lastAtmTransaction && acc.lastAtmTransaction !== "99/99/9999") {
        const lastDate = new Date(acc.lastAtmTransaction);
        const diffMonths =
          (new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24 * 30);
        if (diffMonths > 6 && parseFloat(acc.memberOutstanding || "0") > 0) {
          addAlert(
            "DORMANT ACCOUNT ACTIVE",
            `Dormant account ${acc.memberAccountNo} suddenly active.`,
            acc
          );
        }
      }
    });

    // 🔹 11. High-value single cash deposit > 50,000
    accounts.forEach((acc) => {
      if (parseFloat(acc.outstandingAmount || "0") > 50000) {
        addAlert(
          "HIGH CASH DEPOSIT",
          `High-value cash deposit for ${acc.memberAccountName}.`,
          acc
        );
      }
    });

    // 🔹 12. Mobile number shared across 5+ accounts
    const mobileMap: Record<string, Account[]> = {};
    accounts.forEach((acc) => {
      if (acc.mobileNo) {
        mobileMap[acc.mobileNo] = mobileMap[acc.mobileNo] || [];
        mobileMap[acc.mobileNo].push(acc);
      }
    });
    Object.entries(mobileMap).forEach(([mobile, list]) => {
      if (list.length >= 5) {
        list.forEach((acc) =>
          addAlert(
            "SHARED MOBILE",
            `Mobile number ${mobile} used in ${list.length} accounts.`,
            acc
          )
        );
      }
    });

    // 🔹 13. Same Aadhaar number across multiple accounts
    const aadhaarMap: Record<string, Account[]> = {};
    accounts.forEach((acc) => {
      if (acc.aadhaarNo) {
        aadhaarMap[acc.aadhaarNo] = aadhaarMap[acc.aadhaarNo] || [];
        aadhaarMap[acc.aadhaarNo].push(acc);
      }
    });
    Object.entries(aadhaarMap).forEach(([aadhaar, list]) => {
      if (list.length > 1) {
        list.forEach((acc) =>
          addAlert(
            "SHARED AADHAAR",
            `Aadhaar ${aadhaar} linked to ${list.length} accounts.`,
            acc
          )
        );
      }
    });

    return alerts;
  }

  useEffect(() => {
    setLoading(true);
    fetch("http://192.168.1.36:8080/pacs/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch accounts");
        return res.json();
      })
      .then((data: Account[]) => {
        setAccounts(data);
        setLoading(false);

        // Extract distinct PACS names
        const names = Array.from(new Set(data.map((acc) => acc.pacsName)));
        setDistinctPacsNames(names);
      })
      .catch((err) => {
        console.error("Error loading accounts:", err);
        setLoading(false);
      });
  }, []);

  // Filter accounts when PACS selected
  useEffect(() => {
    if (selectedPacsName) {
      const filtered = accounts.filter(
        (acc) => acc.pacsName === selectedPacsName
      );
      setFilteredAccounts(filtered);

      const alertsGenerated = generateAlerts(filtered);
      setAlerts(alertsGenerated);
    } else {
      setFilteredAccounts([]);
      setAlerts([]);
    }
  }, [selectedPacsName, accounts]);

  const formatCurrency = (amount: string | undefined) => {
    const num = parseFloat(amount || "0");
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(num);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">PACS Dashboard</h1>

      {/* PACS Dropdown */}
      <div>
        <label
          htmlFor="pacsSelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select PACS
        </label>
        <select
          id="pacsSelect"
          className="border border-gray-300 rounded-lg px-4 py-2 w-120 md:w-120 focus:ring-2 focus:ring-blue-500 outline-none"
          value={selectedPacsName}
          onChange={(e) => setSelectedPacsName(e.target.value)}
        >
          <option value="">-- Select PACS --</option>
          {distinctPacsNames.map((name, idx) => (
            <option key={idx} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && <p className="text-blue-600">Loading accounts...</p>}

      {/* Accounts Table */}
      {selectedPacsName && filteredAccounts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="px-6 py-4 bg-gray-50 border-b font-bold text-lg">
            Accounts of {selectedPacsName}
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Member Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Outstanding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.map((acc, idx) => (
                  <tr
                    key={acc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-sm">
                      {startIndex + idx + 1}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {acc.memberAccountName}
                    </td>
                    <td className="px-6 py-3 text-sm">{acc.memberAccountNo}</td>
                    <td className="px-6 py-3 text-sm text-red-600">
                      {formatCurrency(acc.memberOutstanding)}
                    </td>
                    <td className="px-6 py-3 text-sm">{acc.memberDueDate}</td>
                    <td className="px-6 py-3 flex gap-2">
                      {/* View Button */}
                      <button
                        type="button"
                        aria-label={`View account details for ${acc.memberAccountName}`}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                        onClick={() => setSelectedAccount(acc)}
                      >
                        <Eye size={18} aria-hidden="true" />
                      </button>

                      {/* Inspection Button */}
                      <button
                        type="button"
                        aria-label={`Inspect account ${acc.memberAccountName}`}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg"
                        onClick={() => {
                          setInspectionOpen(true);
                          setInspectionAccount(acc);
                        }}
                      >
                        Inspection
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Page {currentPage} of {totalPages} ({filteredAccounts.length}{" "}
                accounts)
              </span>
              <div className="flex items-center space-x-1">
                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  ←
                </button>

                {/* Dots + Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">…</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inspection Dialog */}
      {inspectionOpen && inspectionAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              Inspection for {inspectionAccount.memberAccountName}
            </h3>
            <textarea
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              rows={4}
              placeholder="Enter inspection notes..."
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setInspectionOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={() => {
                  alert(
                    `Inspection submitted for ${inspectionAccount.memberAccountName}:\n${inspectionNotes}`
                  );
                  setInspectionNotes("");
                  setInspectionOpen(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Table */}
      {selectedPacsName && alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="px-6 py-4 bg-gray-50 border-b font-bold text-lg flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" /> PACS DMR Alerts
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAlerts.map((alert, idx) => (
                  <tr
                    key={alert.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-sm">
                      {(alertPage - 1) * alertsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-3 text-sm">{alert.type}</td>
                    <td className="px-6 py-3 text-sm">{alert.description}</td>
                    <td className="px-6 py-3 text-sm">
                      {alert.accountNo || "-"}
                    </td>
                    <td className="px-6 py-3 text-sm">{alert.status}</td>
                    <td className="px-6 py-3 flex items-center gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-900 underline"
                        onClick={() => setAlertToResolve(alert)}
                      >
                        Resolve
                      </button>
                      {alert.linkedAccount && (
                        <button
                          type="button"
                          aria-label={`View account details for ${alert.linkedAccount.memberAccountName}`}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                          onClick={() =>
                            setSelectedAccount(alert.linkedAccount)
                          }
                        >
                          <Eye size={18} aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalAlertPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Showing {(alertPage - 1) * alertsPerPage + 1} to{" "}
                {Math.min(alertPage * alertsPerPage, alerts.length)} of{" "}
                {alerts.length} alerts
              </span>
              <div className="flex items-center space-x-1">
                {/* Previous */}
                <button
                  onClick={() => setAlertPage((p) => Math.max(p - 1, 1))}
                  disabled={alertPage === 1}
                  className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  ←
                </button>

                {/* Dots + Pages */}
                {Array.from({ length: totalAlertPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalAlertPages ||
                      (page >= alertPage - 1 && page <= alertPage + 1)
                  )
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">…</span>
                      )}
                      <button
                        onClick={() => setAlertPage(page)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          page === alertPage
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setAlertPage((p) => Math.min(p + 1, totalAlertPages))
                  }
                  disabled={alertPage === totalAlertPages}
                  className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Account Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Account Details
              </h3>
              <button
                type="button"
                aria-label="Close account details"
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedAccount(null)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Account Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
              {Object.entries(selectedAccount).map(([key, value]) => (
                <p key={key} className="break-words">
                  <strong className="text-gray-900">
                    {key
                      .replace(/([A-Z])/g, " $1") // add space before capital letters
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </strong>{" "}
                  {value || "-"}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alert Resolution Dialog */}
      {alertToResolve && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold">Resolve Alert</h3>
            <p className="text-gray-600">{alertToResolve.description}</p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter resolution notes..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setAlertToResolve(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => {
                  setAlerts((prev) =>
                    prev.map((a) =>
                      a.id === alertToResolve.id
                        ? { ...a, status: "Resolved" }
                        : a
                    )
                  );
                  setAlertToResolve(null);
                }}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
