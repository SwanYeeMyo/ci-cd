import React from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';

export default function Welcome({ laravelVersion, phpVersion }) {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-8 text-center relative">
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-cyan-600 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    SPA Dashboard Active
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-neutral-800">
                    Welcome to your{' '}
                    <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                        Finance Dashboard
                    </span>
                </h1>

                <p className="max-w-xl mx-auto text-base md:text-lg text-neutral-500 font-light leading-relaxed">
                    A single-page application built on Laravel, Inertia.js, and React. Track expenses, define savings goals, and manage your directory.
                </p>

                {/* Quick Shortcuts */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <a 
                        href="/expenses" 
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm shadow-lg hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        Go to Expenses
                    </a>
                    <a 
                        href="/savings" 
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-neutral-250 font-semibold text-sm hover:bg-neutral-50 hover:border-neutral-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-neutral-700 shadow-sm"
                    >
                        View Reports & Savings
                    </a>
                </div>

                {/* Features Quick List */}
                <div className="grid md:grid-cols-3 gap-6 pt-12 text-left">
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-violet-500/30 transition-all duration-300">
                        <h3 className="font-bold text-sm text-neutral-800 mb-2">💸 Expense Tracker</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Log items under custom categories (Food, Utilities, Transport, Shopping, etc.) and filter them instantly.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-fuchsia-500/30 transition-all duration-300">
                        <h3 className="font-bold text-sm text-neutral-800 mb-2">📈 Savings Reports</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Define monthly budgets, set savings benchmarks, and view monthly reports.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-cyan-500/30 transition-all duration-300">
                        <h3 className="font-bold text-sm text-neutral-800 mb-2">👥 Directory</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Browse system users, check relationships, and verify DB queries.
                        </p>
                    </div>
                </div>

                {/* Version footer */}
                <div className="pt-16 text-[10px] text-neutral-400">
                    Laravel v{laravelVersion} (PHP v{phpVersion}) &bull; React HMR Active
                </div>
            </div>
        </DashboardLayout>
    );
}
