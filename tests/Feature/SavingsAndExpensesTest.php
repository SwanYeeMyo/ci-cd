<?php

namespace Tests\Feature;

use App\Models\Expense;
use App\Models\SavingsConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavingsAndExpensesTest extends TestCase
{
    use RefreshDatabase;

    public function test_savings_page_calculates_balances_with_default_config()
    {
        $response = $this->get('/savings');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Savings/Index')
            ->has('config')
            ->has('stats')
            ->where('config.fixed_amount', 0)
            ->where('stats.currentBalance', 0)
            ->where('stats.upcomingBalance', 0)
        );
    }

    public function test_can_update_savings_config()
    {
        $response = $this->post('/savings', [
            'fixed_amount' => 500000.00,
            'start_month' => '2026-01',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('savings_configs', [
            'fixed_amount' => 500000.00,
            'start_month' => '2026-01',
        ]);
    }

    public function test_savings_projections_are_calculated_correctly()
    {
        // Set fixed monthly savings starting in Jan 2026
        SavingsConfig::create([
            'fixed_amount' => 200000.00,
            'start_month' => '2026-01',
        ]);

        $response = $this->get('/savings?month=2026-12');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Savings/Index')
            ->where('config.fixed_amount', 200000)
            ->where('config.start_month', '2026-01')
            ->where('stats.upcomingBalance', 2400000)
        );
    }

    public function test_can_filter_expenses_by_year_and_month()
    {
        // Create matching expense
        Expense::create([
            'description' => 'Target Expense',
            'amount' => 15000,
            'category' => 'Food',
            'date' => '2026-06-15',
        ]);

        // Create non-matching expense (wrong year)
        Expense::create([
            'description' => 'Old Expense',
            'amount' => 25000,
            'category' => 'Utilities',
            'date' => '2025-06-15',
        ]);

        // Create non-matching expense (wrong month)
        Expense::create([
            'description' => 'July Expense',
            'amount' => 35000,
            'category' => 'Transport',
            'date' => '2026-07-15',
        ]);

        $response = $this->get('/expenses?year=2026&month=06');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Expenses/Index')
            ->has('expenses', 1)
            ->where('expenses.0.description', 'Target Expense')
            ->where('stats.filteredTotal', 15000)
        );
    }

    public function test_can_store_expense_with_girlfriend_flag()
    {
        $response = $this->post('/expenses', [
            'description' => 'Cinema Date with GF',
            'amount' => 30000,
            'category' => 'Entertainment',
            'date' => '2026-06-15',
            'with_girlfriend' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('expenses', [
            'description' => 'Cinema Date with GF',
            'amount' => 30000.00,
            'with_girlfriend' => true,
        ]);
    }

    public function test_girlfriend_expenses_page_filters_spends_correctly()
    {
        // 1. GF spend
        Expense::create([
            'description' => 'Dinner Date',
            'amount' => 45000,
            'category' => 'Food',
            'date' => '2026-06-11',
            'with_girlfriend' => true,
        ]);

        // 2. Regular spend
        Expense::create([
            'description' => 'Electric bill',
            'amount' => 80000,
            'category' => 'Utilities',
            'date' => '2026-06-11',
            'with_girlfriend' => false,
        ]);

        $response = $this->get('/girlfriend-expenses');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Expenses/Girlfriend')
            ->has('expenses', 1)
            ->where('expenses.0.description', 'Dinner Date')
            ->where('stats.totalAmount', 45000)
        );
    }

    public function test_daily_expenses_page_excludes_girlfriend_spends()
    {
        // 1. GF spend
        Expense::create([
            'description' => 'Dinner Date with GF',
            'amount' => 45000,
            'category' => 'Food',
            'date' => '2026-06-11',
            'with_girlfriend' => true,
        ]);

        // 2. Regular spend
        Expense::create([
            'description' => 'Electric bill',
            'amount' => 80000,
            'category' => 'Utilities',
            'date' => '2026-06-11',
            'with_girlfriend' => false,
        ]);

        $response = $this->get('/expenses');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Expenses/Index')
            ->has('expenses', 1)
            ->where('expenses.0.description', 'Electric bill')
            ->where('stats.totalAmount', 80000)
        );
    }

    public function test_can_store_regular_expense_with_girlfriend_flag_defaulting_to_false()
    {
        $response = $this->post('/expenses', [
            'description' => 'Daily Coffee',
            'amount' => 3500,
            'category' => 'Food',
            'date' => '2026-06-15',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('expenses', [
            'description' => 'Daily Coffee',
            'amount' => 3500.00,
            'with_girlfriend' => false,
        ]);
    }
}
