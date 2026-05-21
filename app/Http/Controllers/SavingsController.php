<?php

namespace App\Http\Controllers;

use App\Models\SavingsConfig;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SavingsController extends Controller
{
    public function index(Request $request): Response
    {
        $todayMonth = date('Y-m');
        
        // Fetch or initialize config
        $config = SavingsConfig::first();
        $fixedAmount = $config ? (float) $config->fixed_amount : 0.00;
        $startMonth = $config ? $config->start_month : $todayMonth;

        // Default target month: December of current year, or target parameter
        $targetMonth = $request->input('month');
        if (!$targetMonth) {
            $targetMonth = date('Y') . '-12';
            // If start month is after December of current year, make it start month + 6 months
            if ($startMonth > $targetMonth) {
                $startDateObj = \DateTime::createFromFormat('Y-m-d', $startMonth . '-01');
                if ($startDateObj) {
                    $startDateObj->modify('+6 months');
                    $targetMonth = $startDateObj->format('Y-m');
                }
            }
        }

        // Calculate months elapsed
        $monthsElapsedCurrent = $this->calculateMonthsDifference($startMonth, $todayMonth);
        $monthsElapsedTarget = $this->calculateMonthsDifference($startMonth, $targetMonth);

        $currentBalance = $monthsElapsedCurrent * $fixedAmount;
        $upcomingBalance = $monthsElapsedTarget * $fixedAmount;

        // Build chronological timeline from startMonth to targetMonth
        $timeline = [];
        $startPeriod = \DateTime::createFromFormat('Y-m-d', $startMonth . '-01');
        $endPeriod = \DateTime::createFromFormat('Y-m-d', $targetMonth . '-01');

        if ($startPeriod && $endPeriod && $startPeriod <= $endPeriod) {
            $tempDate = clone $startPeriod;
            $cumulative = 0.0;
            $maxMonths = 120; // 10 years max projection to prevent memory overflow
            $count = 0;
            while ($tempDate <= $endPeriod && $count < $maxMonths) {
                $mStr = $tempDate->format('Y-m');
                $cumulative += $fixedAmount;

                $timeline[] = [
                    'month' => $mStr,
                    'label' => $tempDate->format('M Y'),
                    'deposit' => $fixedAmount,
                    'balance' => $cumulative,
                    'isCurrent' => ($mStr === $todayMonth),
                ];

                $tempDate->modify('+1 month');
                $count++;
            }
        }

        return Inertia::render('Savings/Index', [
            'config' => [
                'fixed_amount' => $fixedAmount,
                'start_month' => $startMonth,
            ],
            'selectedMonth' => $targetMonth,
            'todayMonth' => $todayMonth,
            'stats' => [
                'currentBalance' => $currentBalance,
                'upcomingBalance' => $upcomingBalance,
                'selectedMonthDeposit' => $fixedAmount,
            ],
            'timeline' => $timeline,
        ]);
    }

    public function updateOrCreate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fixed_amount' => 'required|numeric|min:0',
            'start_month' => 'required|string|regex:/^\d{4}-\d{2}$/',
        ]);

        SavingsConfig::updateOrCreate(
            [], // Empty array updates/creates the first row
            [
                'fixed_amount' => $validated['fixed_amount'],
                'start_month' => $validated['start_month'],
            ]
        );

        return redirect()->back();
    }

    private function calculateMonthsDifference(string $start, string $end): int
    {
        $startDate = \DateTime::createFromFormat('Y-m-d', $start . '-01');
        $endDate = \DateTime::createFromFormat('Y-m-d', $end . '-01');

        if (!$startDate || !$endDate) {
            return 0;
        }

        if ($endDate < $startDate) {
            return 0;
        }

        $diff = $startDate->diff($endDate);
        return (($diff->y) * 12) + ($diff->m) + 1; // Inclusive
    }
}
