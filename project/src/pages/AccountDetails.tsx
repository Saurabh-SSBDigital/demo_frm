import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardState {
  selectedPacsName?: string;
  currentPage?: number;
  alertPage?: number;
}

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
  srNo?: string;
  pacsProductCodeAndName?: string;
  customerNo?: string;
  drawingPower?: string;
  dueDate?: string;
  rateOfIntPacs?: string;
  accruedIntPacs?: string;
  expiryRatePacs?: string;
  irregularity?: string;
  memberSrNo?: string;
  memberProdName?: string;
  memberCustomerNo?: string;
  memberLimitSanctioned?: string;
  memberDrawingPower?: string;
  memberUnpaidPrinciple?: string;
  memberRateOfInt?: string;
  memberAccruedInt?: string;
  memberExpiryRate?: string;
  memberIrregularity?: string;
}

const formatCurrency = (amount: string | undefined) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(parseFloat(amount || "0"));

const AccountDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { account, dashboardState } = (location.state || {}) as {
    account: Account;
    dashboardState?: DashboardState;
  };

  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState("");

  if (!account) {
    return (
      <div className="p-6">
        <p>No account selected.</p>
        <button
          onClick={() => navigate("/dashboard", { state: dashboardState || {} })}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

  const handleInspectionSubmit = () => {
    alert(`Inspection Submitted: ${inspectionNotes}`);
    setInspectionOpen(false);
    setInspectionNotes("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl shadow p-4 border">
        <h3 className="text-2xl font-bold text-gray-800">
          Account Details: {account.memberAccountName}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setInspectionOpen(true)}
            className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
          >
            Inspection
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard", { state: dashboardState || {} })}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>
      </div>

      {/* Account Info Grid */}
      <div className="bg-white rounded-xl shadow-md p-6 border grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
        {[
          ["ID", account.id],
          ["Sr No", account.srNo],
          ["PACS Product", account.pacsProductCodeAndName],
          ["Customer No", account.customerNo],
          ["PACS Account No", account.pacsAccountNo],
          ["PACS Name", account.pacsName],
          ["Limit Sanctioned", formatCurrency(account.limitSanctioned)],
          ["Drawing Power", formatCurrency(account.drawingPower)],
          ["Due Date", account.dueDate],
          ["Rate of Interest PACS", `${account.rateOfIntPacs}%`],
          ["Accrued Interest PACS", formatCurrency(account.accruedIntPacs)],
          ["Expiry Rate PACS", `${account.expiryRatePacs}%`],
          ["Outstanding Amount", formatCurrency(account.outstandingAmount)],
          ["Irregularity", formatCurrency(account.irregularity)],
          ["Member Sr No", account.memberSrNo],
          ["Member Product Name", account.memberProdName],
          ["Member Customer No", account.memberCustomerNo],
          ["Member Account No", account.memberAccountNo],
          ["Member Account Name", account.memberAccountName],
          ["Branch No", account.brNo],
          ["Member Limit Sanctioned", formatCurrency(account.memberLimitSanctioned)],
          ["Member Drawing Power", formatCurrency(account.memberDrawingPower)],
          ["Member Due Date", account.memberDueDate],
          ["Member Unpaid Principle", formatCurrency(account.memberUnpaidPrinciple)],
          ["Member Rate of Interest", `${account.memberRateOfInt}%`],
          ["Member Accrued Interest", formatCurrency(account.memberAccruedInt)],
          ["Member Expiry Rate", `${account.memberExpiryRate}%`],
          ["Member Outstanding", formatCurrency(account.memberOutstanding)],
          ["Member Irregularity", formatCurrency(account.memberIrregularity)],
        ].map(([label, value], idx) => (
          <p key={idx}>
            <strong>{label}:</strong> {value || "-"}
          </p>
        ))}
      </div>

      {/* ✅ Inspection Dialog */}
      {inspectionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 border">
            <h3 className="text-xl font-bold text-gray-800">
              Inspection Notes
            </h3>
            <textarea
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              rows={5}
              placeholder="Enter inspection details..."
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
                onClick={handleInspectionSubmit}
              >
                Submit Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
