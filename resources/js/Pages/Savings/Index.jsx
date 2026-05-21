import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

// Global formatter for MMK (Myanmar Kyat)
const formatMMK = (amount) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount) + ' MMK';
};

// Donut Pie Chart Component showing Current vs Projected Proportions
function SavingsProjectionPieChart({ currentBalance, upcomingBalance }) {
    const total = upcomingBalance;
    if (total <= 0) {
        return (
            <div className="flex items-center justify-center h-48 text-neutral-500 text-xs">
                Configure savings to display analytics chart
            </div>
        );
    }

    const radius = 50;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius; // ~314.16

    const current = Math.min(currentBalance, total);
    const projectedRemaining = Math.max(0, total - currentBalance);

    const currentPct = current / total;
    const projectedPct = projectedRemaining / total;

    const currentStroke = currentPct * circumference;
    const projectedStroke = projectedPct * circumference;

    const currentOffset = 0;
    const projectedOffset = -currentPct * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#f4f4f2"
                        strokeWidth={strokeWidth}
                    />
                    {/* Current Savings (Sage) */}
                    {current > 0 && (
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="transparent"
                            stroke="#839788"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${currentStroke} ${circumference}`}
                            strokeDashoffset={currentOffset}
                            strokeLinecap="round"
                            className="transition-all duration-300 ease-out hover:stroke-[14px]"
                        />
                    )}
                    {/* Upcoming / Projected Growth (Rose) */}
                    {projectedRemaining > 0 && (
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="transparent"
                            stroke="#E5D1D0"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${projectedStroke} ${circumference}`}
                            strokeDashoffset={projectedOffset}
                            strokeLinecap="round"
                            className="transition-all duration-300 ease-out hover:stroke-[14px]"
                        />
                    )}
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center px-4">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Projected Total</span>
                    <span className="text-xs font-black text-neutral-800 mt-0.5 truncate max-w-[120px]">
                        {formatMMK(total).replace(' MMK', '')}
                    </span>
                    <span className="text-[8px] text-neutral-500 font-bold">MMK</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-1.5 text-[10px] text-neutral-500 font-medium w-full">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-palette-sage shrink-0" />
                        <span className="text-neutral-600">Right Now Balance ({(currentPct * 100).toFixed(0)}%)</span>
                    </div>
                    <span className="font-bold text-neutral-800">{formatMMK(current)}</span>
                </div>
                {projectedRemaining > 0 && (
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-palette-rose shrink-0" />
                            <span className="text-neutral-600">Future Projections ({(projectedPct * 100).toFixed(0)}%)</span>
                        </div>
                        <span className="font-bold text-neutral-800">{formatMMK(projectedRemaining)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Bar Chart showing cumulative savings growth over time
function GrowthBarChart({ timeline }) {
    const maxBalance = Math.max(...timeline.map(item => item.balance), 0);
    
    if (maxBalance <= 0 || timeline.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-neutral-500 text-xs">
                Configure savings to display growth timeline
            </div>
        );
    }

    return (
        <div className="space-y-3 py-1 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
            {timeline.map((item) => {
                const pct = maxBalance > 0 ? (item.balance / maxBalance) * 100 : 0;
                return (
                    <div key={item.month} className={`space-y-1 p-1.5 rounded-lg transition-all ${item.isCurrent ? 'bg-palette-sage-dark/10 border border-palette-sage-dark/20' : 'border border-transparent'}`}>
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="flex items-center gap-1.5">
                                <span className="text-neutral-600">{item.label}</span>
                                {item.isCurrent && (
                                    <span className="bg-palette-sage/20 text-palette-sage border border-palette-sage/35 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                                        Right Now
                                    </span>
                                )}
                            </span>
                            <span className="text-neutral-500 font-bold">
                                {formatMMK(item.balance)} 
                                <span className="text-[10px] font-medium text-neutral-400 ml-1.5">(+{formatMMK(item.deposit)})</span>
                            </span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200/50">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    item.isCurrent 
                                        ? 'bg-gradient-to-r from-palette-sage to-palette-rose' 
                                        : 'bg-gradient-to-r from-palette-sage-dark to-palette-gray'
                                }`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Index({ config, selectedMonth, todayMonth, stats, timeline }) {
    const [month, setMonth] = useState(selectedMonth);

    const { data, setData, post, processing, errors } = useForm({
        fixed_amount: config.fixed_amount || '',
        start_month: config.start_month || '',
    });

    useEffect(() => {
        setData({
            fixed_amount: config.fixed_amount || '',
            start_month: config.start_month || '',
        });
    }, [config]);

    const handleMonthChange = (newMonth) => {
        setMonth(newMonth);
        router.get('/savings', { month: newMonth }, { preserveState: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/savings');
    };

    const readableSelectedMonth = new Date(selectedMonth + '-02').toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });

    const readableStartMonth = new Date(config.start_month + '-02').toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                
                {/* Dashboard Title & Month Picker */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800">
                            Savings & Projections
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Define your fixed monthly savings amount and track projections for any upcoming month.
                        </p>
                    </div>

                    {/* Month Picker */}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
                        <label className="text-xs font-semibold text-neutral-500">Target Month:</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-800 focus:border-palette-sage focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Primary Ledger Cards (RIGHT NOW vs UPCOMING BALANCE) */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Cumulative Savings Right Now */}
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-3xl opacity-30 group-hover:opacity-50 transition-opacity">💰</div>
                        <div>
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">How Much Money I Have Right Now</div>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                                Accumulated savings up to today ({new Date(todayMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })})
                            </p>
                        </div>
                        <div className="mt-6">
                            <div className="text-4xl font-black text-palette-sage-dark">
                                {formatMMK(stats.currentBalance)}
                            </div>
                        </div>
                        <div className="mt-4 text-[10px] text-neutral-400 border-t border-neutral-100 pt-3">
                            Based on fixed monthly savings from starting month: <span className="font-semibold text-neutral-700">{readableStartMonth}</span>
                        </div>
                    </div>

                    {/* Upcoming Projection Balance */}
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-3xl opacity-30 group-hover:opacity-50 transition-opacity">🚀</div>
                        <div>
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">How Much Money I Will Have In The Upcoming</div>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                                Projected savings balance up to selected target month ({readableSelectedMonth})
                            </p>
                        </div>
                        <div className="mt-6">
                            <div className="text-4xl font-black text-[#c2aeac]">
                                {formatMMK(stats.upcomingBalance)}
                            </div>
                        </div>
                        <div className="mt-4 text-[10px] text-neutral-400 border-t border-neutral-100 pt-3 flex items-center justify-between">
                            <span>Target Month: <span className="font-semibold text-neutral-700">{readableSelectedMonth}</span></span>
                            <span>Monthly Saved: <span className="font-semibold text-neutral-700">{formatMMK(stats.selectedMonthDeposit)}</span></span>
                        </div>
                    </div>
                </div>

                {/* Secondary Layout: Update Form & Visual Charts */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Log Deposit Form */}
                    <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm h-fit">
                        <h3 className="font-bold text-lg text-neutral-800 mb-1">Savings Settings</h3>
                        <p className="text-xs text-neutral-500 mb-4">Set your fixed monthly savings amount and when your savings timeline starts.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-600">Fixed Monthly Savings (MMK)</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    placeholder="500000"
                                    value={data.fixed_amount}
                                    onChange={(e) => setData('fixed_amount', e.target.value)}
                                    className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:border-palette-sage focus:outline-none text-neutral-800"
                                    required
                                />
                                {errors.fixed_amount && <p className="text-xs text-red-400">{errors.fixed_amount}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-600">Starting Savings Month</label>
                                <input
                                    type="month"
                                    value={data.start_month}
                                    onChange={(e) => setData('start_month', e.target.value)}
                                    className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:border-palette-sage focus:outline-none text-neutral-800"
                                    required
                                />
                                {errors.start_month && <p className="text-xs text-red-400">{errors.start_month}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 rounded-lg bg-palette-sage-dark text-white font-bold text-sm hover:bg-palette-sage active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? 'Saving...' : 'Update Settings'}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Visual Charts (Pie & Bar) */}
                    <div className="lg:col-span-2 space-y-6">
                        {timeline.length > 0 && stats.upcomingBalance > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                                
                                {/* Donut Pie Chart: Proportions */}
                                <div className="space-y-4 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-100 pb-6 md:pb-0 md:pr-6">
                                    <div className="text-center md:text-left w-full">
                                        <h3 className="font-bold text-base text-neutral-900">Savings Breakdown</h3>
                                        <p className="text-[10px] text-neutral-500 mt-0.5">Ratio of current accumulated savings to future target projections.</p>
                                    </div>
                                    <SavingsProjectionPieChart currentBalance={stats.currentBalance} upcomingBalance={stats.upcomingBalance} />
                                </div>

                                {/* Bar Chart: Chronological timeline */}
                                <div className="space-y-4 flex flex-col justify-between md:pl-6">
                                    <div className="w-full">
                                        <h3 className="font-bold text-base text-neutral-900">Projected Accumulation Timeline</h3>
                                        <p className="text-[10px] text-neutral-500 mt-0.5">Running balance showing chronological growth from start to target.</p>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <GrowthBarChart timeline={timeline} />
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="p-12 text-center border border-neutral-200 rounded-2xl bg-neutral-50 text-neutral-400 text-sm">
                                Enter a fixed savings amount and start month on the left to activate charts and visual projections.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
