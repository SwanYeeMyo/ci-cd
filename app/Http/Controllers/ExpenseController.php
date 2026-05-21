<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $year = $request->input('year');
        $month = $request->input('month');

        // Query for daily expenses (excluding girlfriend spends)
        $query = Expense::where('with_girlfriend', false);

        if ($search) {
            $query->where('description', 'LIKE', '%' . $search . '%');
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($year && $year !== 'all') {
            $query->whereYear('date', $year);
        }

        if ($month && $month !== 'all') {
            $query->whereMonth('date', $month);
        }

        $expenses = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate general dashboard stats for daily spends (overall - unfiltered)
        $totalAmount = Expense::where('with_girlfriend', false)->sum('amount');

        Log::info('herre');

        // Calculate filtered category breakdown
        $categoryBreakdown = [];
        foreach ($expenses as $expense) {
            $cat = $expense->category;
            if (!isset($categoryBreakdown[$cat])) {
                $categoryBreakdown[$cat] = 0.0;
            }
            $categoryBreakdown[$cat] += (float) $expense->amount;
        }

        // Ensure all possible categories are present in breakdown (default to 0)
        $defaultCategories = ['Food', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'Other'];
        $chartData = [];
        foreach ($defaultCategories as $cat) {
            $chartData[] = [
                'name' => $cat,
                'value' => (float) ($categoryBreakdown[$cat] ?? 0.0),
            ];
        }

        // Filtered sum
        $filteredTotal = $expenses->sum('amount');

        // Available years for filter dropdown (only for daily spends)
        $currentYear = (int) date('Y');
        $dbYears = Expense::where('with_girlfriend', false)->pluck('date')->map(function ($date) {
            return date('Y', strtotime($date));
        })->unique()->map(function ($yr) {
            return (int) $yr;
        })->toArray();

        $years = array_unique(array_merge([$currentYear, $currentYear - 1, $currentYear - 2], $dbYears));
        sort($years);
        $years = array_reverse($years); // descending

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
                'year' => $year ?? 'all',
                'month' => $month ?? 'all',
            ],
            'stats' => [
                'totalAmount' => (float) $totalAmount,
                'filteredTotal' => (float) $filteredTotal,
                'categoryBreakdown' => $chartData,
            ],
            'availableYears' => $years,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|in:Food,Utilities,Transport,Entertainment,Shopping,Other',
            'date' => 'required|date',
            'with_girlfriend' => 'nullable|boolean',
        ]);

        Expense::create([
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'date' => $validated['date'],
            'with_girlfriend' => filter_var($validated['with_girlfriend'] ?? false, FILTER_VALIDATE_BOOLEAN),
        ]);

        return redirect()->back();
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $expense->delete();

        return redirect()->back();
    }

    public function girlfriendIndex(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $year = $request->input('year');
        $month = $request->input('month');

        // Query only girlfriend-specific expenses
        $query = Expense::where('with_girlfriend', true);

        if ($search) {
            $query->where('description', 'LIKE', '%' . $search . '%');
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($year && $year !== 'all') {
            $query->whereYear('date', $year);
        }

        if ($month && $month !== 'all') {
            $query->whereMonth('date', $month);
        }

        $expenses = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate girlfriend-specific stats (overall vs filtered)
        $totalGirlfriendAmount = Expense::where('with_girlfriend', true)->sum('amount');
        $filteredTotal = $expenses->sum('amount');

        // Calculate filtered category breakdown for girlfriend
        $categoryBreakdown = [];
        foreach ($expenses as $expense) {
            $cat = $expense->category;
            if (!isset($categoryBreakdown[$cat])) {
                $categoryBreakdown[$cat] = 0.0;
            }
            $categoryBreakdown[$cat] += (float) $expense->amount;
        }

        // Ensure all possible categories are present in breakdown
        $defaultCategories = ['Food', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'Other'];
        $chartData = [];
        foreach ($defaultCategories as $cat) {
            $chartData[] = [
                'name' => $cat,
                'value' => (float) ($categoryBreakdown[$cat] ?? 0.0),
            ];
        }

        // Dynamic years for girlfriend expenses
        $currentYear = (int) date('Y');
        $dbYears = Expense::where('with_girlfriend', true)->pluck('date')->map(function ($date) {
            return date('Y', strtotime($date));
        })->unique()->map(function ($yr) {
            return (int) $yr;
        })->toArray();

        $years = array_unique(array_merge([$currentYear, $currentYear - 1, $currentYear - 2], $dbYears));
        sort($years);
        $years = array_reverse($years);

        return Inertia::render('Expenses/Girlfriend', [
            'expenses' => $expenses,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
                'year' => $year ?? 'all',
                'month' => $month ?? 'all',
            ],
            'stats' => [
                'totalAmount' => (float) $totalGirlfriendAmount,
                'filteredTotal' => (float) $filteredTotal,
                'categoryBreakdown' => $chartData,
            ],
            'availableYears' => $years,
        ]);
    }
}
