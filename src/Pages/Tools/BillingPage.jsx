import React from "react";
import { CreditCard, ArrowRight, CheckCircle, Edit3 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function BillingPage() {
  const { t } = useLanguage();

  // Hardcoded data - will be replaced with real data later
  const planData = {
    name: "Explorer Plan",
    price: 100,
    currency: "$",
    period: "month",
    usersUsed: 3,
    usersTotal: 5,
    billingCycle: "Monthly",
  };

  const paymentMethod = {
    type: "Visa",
    last4: "1234",
    expiry: "08/2024",
  };

  const invoices = [
    { id: "#005", plan: "Basic Plan", amount: 11, status: "Paid", date: "1 December 2020" },
    { id: "#004", plan: "Basic Plan", amount: 11, status: "Paid", date: "1 November 2020" },
    { id: "#003", plan: "Basic Plan", amount: 11, status: "Paid", date: "1 October 2020" },
    { id: "#002", plan: "Basic Plan", amount: 11, status: "Paid", date: "1 September 2020" },
    { id: "#001", plan: "Basic Plan", amount: 11, status: "Paid", date: "1 August 2020" },
  ];

  const progressPercentage = (planData.usersUsed / planData.usersTotal) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Plans</h1>
          <p className="text-gray-500">Manage your subscription and billing details</p>
        </div>

        {/* Billing Details Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{planData.name}</h3>
                  <span className="px-3 py-1 bg-[#dccaf4] text-[#40086d] text-xs font-medium rounded-full border border-[#40086d]">
                    {planData.billingCycle}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{planData.currency}{planData.price}</span>
                    <span className="text-sm text-gray-500">per {planData.period}</span>
                  </div>
                </div>
              </div>

              {/* Users Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {planData.usersUsed} out of {planData.usersTotal} users
                  </span>
                  <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#40086d] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Upgrade Button */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#40086d] border-2 border-[#40086d] rounded-lg hover:bg-[#ede0f8] transition-colors font-medium">
                <span>Upgrade plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment method</h3>
              <p className="text-sm text-gray-500 mb-6">You can edit your card details here.</p>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-[#1434CB] rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {paymentMethod.type} ending in {paymentMethod.last4}
                    </p>
                    <p className="text-xs text-gray-500">Expiry {paymentMethod.expiry}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing history</h2>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-4">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
              </div>
              <div className="col-span-3">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</span>
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice, index) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-4 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-gray-900">Invoice {invoice.id}</p>
                    <p className="text-xs text-gray-500">{invoice.plan}</p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm font-medium text-gray-900">{invoice.amount} USD</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-600">{invoice.date}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <button className="flex items-center gap-1 text-sm text-[#40086d] hover:text-[#5a0a9d] font-medium transition-colors">
                      <span>View</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Recommendation Section */}
        <div className="mt-8 p-6 bg-[#ede0f8] border border-[#dccaf4] rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#40086d] rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Need help managing your subscription?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to assist you with billing questions, plan changes, or any other concerns.
              </p>
              <button className="px-4 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#5a0a9d] transition-colors text-sm font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
