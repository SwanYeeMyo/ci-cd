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

// Donut Pie Chart Component
function PieChart({ data, total }) {
    if (total <= 0) {
        return (
            <div className="flex items-center justify-center h-48 text-neutral-500 text-xs">
                No data to display chart
            </div>
        );
    }

    const radius = 50;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius; // ~314.16
    let accumulatedPercentage = 0;

    const colors = {
        Food: '#73877B',          // Sage Dark
        Utilities: '#839788',     // Sage
        Transport: '#9CAFA3',     // Mid Sage
        Entertainment: '#BDBBB6', // Warm Gray
        Shopping: '#F5E4D7',      // Peach
        Other: '#D7CFC9',         // Grayish Peach
    };

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
                    {data.map((item) => {
                        if (item.value <= 0) return null;
                        
                        const pct = item.value / total;
                        const strokeLength = pct * circumference;
                        const strokeOffset = -accumulatedPercentage * circumference;
                        
                        accumulatedPercentage += pct;

                        return (
                            <circle
                                key={item.name}
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="transparent"
                                stroke={colors[item.name] || '#ffffff'}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${strokeLength} ${circumference}`}
                                strokeDashoffset={strokeOffset}
                                strokeLinecap="round"
                                className="transition-all duration-300 ease-out hover:stroke-[14px]"
                            />
                        );
                    })}
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center px-4">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Spent</span>
                    <span className="text-xs font-black text-neutral-850 mt-0.5 truncate max-w-[120px]">
                        {formatMMK(total).replace(' MMK', '')}
                    </span>
                    <span className="text-[8px] text-neutral-500 font-bold">MMK</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[10px] text-neutral-550 font-medium w-full">
                {data.filter(item => item.value > 0).map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[item.name] }} />
                        <span className="truncate">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Vertical/Horizontal Bar Chart Component
function BarChart({ data }) {
    const maxValue = Math.max(...data.map(item => item.value), 0);
    
    if (maxValue <= 0) {
        return (
            <div className="flex items-center justify-center h-48 text-neutral-500 text-xs">
                No data to display chart
            </div>
        );
    }

    const colors = {
        Food: 'from-palette-sage-dark to-palette-sage',
        Utilities: 'from-palette-sage to-[#9CAFA3]',
        Transport: 'from-[#9CAFA3] to-palette-gray',
        Entertainment: 'from-palette-gray to-[#D7CFC9]',
        Shopping: 'from-palette-peach to-[#F9ECE2]',
        Other: 'from-[#D7CFC9] to-palette-gray',
    };

    return (
        <div className="space-y-3 py-1">
            {data.map((item) => {
                const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                return (
                    <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-neutral-600">{item.name}</span>
                            <span className="text-neutral-800">{formatMMK(item.value)}</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200/50">
                            <div
                                className={`bg-gradient-to-r ${colors[item.name] || 'from-violet-600 to-cyan-400'} h-full rounded-full transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Index({ expenses, filters, stats, availableYears }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [year, setYear] = useState(filters.year || 'all');
    const [month, setMonth] = useState(filters.month || 'all');
    
    // Modal visibility state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        with_girlfriend: false,
    });

    const applyFilters = () => {
        router.get(
            '/expenses',
            {
                search: search,
                category: category,
                year: year,
                month: month,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    useEffect(() => {
        applyFilters();
    }, [category, year, month]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                applyFilters();
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const handleClearFilters = () => {
        setSearch('');
        setCategory('all');
        setYear('all');
        setMonth('all');
        router.get('/expenses', {}, { replace: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/expenses', {
            onSuccess: () => {
                reset('description', 'amount', 'category', 'with_girlfriend');
                setIsModalOpen(false); // Close modal on success
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(`/expenses/${id}`);
        }
    };

    const categoryColors = {
        Food: 'bg-palette-sage-dark/10 border-palette-sage-dark/30 text-palette-sage',
        Utilities: 'bg-palette-sage/10 border-palette-sage/30 text-palette-sage',
        Transport: 'bg-palette-gray/10 border-palette-gray/30 text-palette-gray',
        Entertainment: 'bg-palette-peach/10 border-palette-peach/30 text-palette-peach',
        Shopping: 'bg-palette-peach/20 border-palette-peach/40 text-palette-peach',
        Other: 'bg-neutral-800 border-neutral-700 text-neutral-300',
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                
                {/* Dashboard Title & Add Button */}
                <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-800 via-neutral-900 to-palette-sage-dark bg-clip-text text-transparent">
                            Expenses Tracker
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Track, monitor, and log your daily expenditures.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-palette-sage-dark hover:bg-palette-sage text-white font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-palette-sage-dark/15"
                        >
                            <span>➕</span> Add Expense
                        </button>
                    </div>
                </div>

                {/* Filters Bar at the Top */}
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-100 pb-3">
                        <div>
                            <h3 className="font-bold text-base text-neutral-800 flex items-center gap-2">
                                <span>🔍</span> Filter & Search Expenses
                            </h3>
                            <p className="text-[10px] text-neutral-500">Refine your expense records by details, categories, years, and months.</p>
                        </div>
                        {(search || category !== 'all' || year !== 'all' || month !== 'all') && (
                            <button 
                                onClick={handleClearFilters}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors cursor-pointer self-start sm:self-auto"
                            >
                                ✕ Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Search Description</label>
                            <input
                                type="text"
                                placeholder="e.g. groceries, electric..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-all placeholder-neutral-400 text-neutral-800"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-all text-neutral-800"
                            >
                                <option value="all">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Transport">Transport</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Year Dropdown */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-all text-neutral-800"
                            >
                                <option value="all">All Years</option>
                                {availableYears.map((yr) => (
                                    <option key={yr} value={yr}>{yr}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month Dropdown */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Month</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-all text-neutral-800"
                            >
                                <option value="all">All Months</option>
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Modal Box for Adding Expense */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity cursor-pointer"
                            onClick={() => setIsModalOpen(false)}
                        />
                        
                        {/* Modal Body */}
                        <div className="relative w-full max-w-md p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xl space-y-4 z-10 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <h3 className="font-bold text-lg text-neutral-900">Add New Expense</h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-neutral-400 hover:text-neutral-600 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-neutral-600">Description</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Weekly Grocery Run"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-colors text-neutral-850"
                                        required
                                    />
                                    {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-neutral-600">Amount (MMK)</label>
                                        <input
                                            type="number"
                                            step="1"
                                            min="1"
                                            placeholder="25000"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-colors text-neutral-850"
                                            required
                                        />
                                        {errors.amount && <p className="text-xs text-red-400">{errors.amount}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-neutral-600">Category</label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-colors text-neutral-800"
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.category && <p className="text-xs text-red-400">{errors.category}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-neutral-600">Date</label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="block w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:border-palette-sage focus:ring-1 focus:ring-palette-sage focus:outline-none transition-colors text-neutral-800"
                                        required
                                    />
                                    {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm font-semibold text-neutral-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2.5 rounded-lg bg-palette-sage-dark text-white font-bold text-sm hover:bg-palette-sage active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? 'Saving...' : 'Add Expense'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Stats Dashboard Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Stat Card 1: Total Spent */}
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Spent (All-Time)</div>
                        <div className="mt-4 text-3xl font-extrabold bg-gradient-to-r from-palette-sage-dark to-neutral-700 bg-clip-text text-transparent">
                            {formatMMK(stats.totalAmount)}
                        </div>
                        <div className="mt-2 text-xs text-neutral-500">Accumulated total across all categories</div>
                    </div>

                    {/* Stat Card 2: Filtered Total */}
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Filtered Spent</div>
                        <div className="mt-4 text-3xl font-extrabold bg-gradient-to-r from-palette-sage-dark to-[#73877B] bg-clip-text text-transparent">
                            {formatMMK(stats.filteredTotal)}
                        </div>
                        <div className="mt-2 text-xs text-neutral-500">Based on your current filter criteria</div>
                    </div>

                    {/* Stat Card 3: Highest Category */}
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Highest Category</div>
                        {(() => {
                            const highest = [...stats.categoryBreakdown].sort((a, b) => b.value - a.value)[0];
                            return highest && highest.value > 0 ? (
                                <>
                                    <div className="mt-4 text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
                                        <span>{highest.name}</span>
                                        <span className="text-xs font-medium text-neutral-500">({formatMMK(highest.value)})</span>
                                    </div>
                                    <div className="mt-2 text-xs text-neutral-500">Category with the most expenditures</div>
                                </>
                            ) : (
                                <>
                                    <div className="mt-4 text-xl font-bold text-neutral-600">No data</div>
                                    <div className="mt-2 text-xs text-neutral-500">Log an expense to see category stats</div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Visual Analytics */}
                {stats.totalAmount > 0 && (
                    <div className="grid md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
                        {/* Pie Chart Card */}
                        <div className="space-y-4 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-100 pb-6 md:pb-0 md:pr-6">
                            <div className="text-center md:text-left w-full">
                                <h3 className="font-bold text-base text-neutral-900">Category Shares (Pie Chart)</h3>
                                <p className="text-[10px] text-neutral-500 mt-0.5">Percentage distribution of expenditures.</p>
                            </div>
                            <PieChart data={stats.categoryBreakdown} total={stats.filteredTotal} />
                        </div>

                        {/* Bar Chart Card */}
                        <div className="space-y-4 flex flex-col justify-between md:pl-6">
                            <div className="w-full">
                                <h3 className="font-bold text-base text-neutral-900">Spending Volume (Bar Chart)</h3>
                                <p className="text-[10px] text-neutral-500 mt-0.5">Direct comparative volumes across categories.</p>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <BarChart data={stats.categoryBreakdown} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Dashboard Secondary Layout: Categories and Actions */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Panel: Category Breakdown Progress Bars */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Category Progress Panel */}
                        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
                            <h3 className="font-bold text-lg text-neutral-900">Category Breakdown</h3>
                            <div className="space-y-3">
                                {stats.categoryBreakdown.map((item) => {
                                    const percentage = stats.filteredTotal > 0 
                                        ? (item.value / stats.filteredTotal) * 100 
                                        : 0;

                                    return (
                                        <div key={item.name} className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-neutral-700">{item.name}</span>
                                                <span className="text-neutral-500">{formatMMK(item.value)} ({percentage.toFixed(0)}%)</span>
                                            </div>
                                            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200/50">
                                                <div 
                                                    className="bg-gradient-to-r from-palette-sage-dark to-palette-sage h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Expenses List */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Expenses Table */}
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-neutral-100">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Expense</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</th>
                                        <th scope="col" className="relative px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-sm text-neutral-500">
                                                No expenses logged matching this criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        expenses.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-neutral-50/50 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-semibold text-sm text-neutral-800 flex items-center gap-2">
                                                        {expense.description}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${categoryColors[expense.category] || 'bg-neutral-100 border-neutral-200 text-neutral-600'}`}>
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500">
                                                    {new Date(expense.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-neutral-800">
                                                    {formatMMK(expense.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                                                    <button
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                        title="Delete Expense"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
