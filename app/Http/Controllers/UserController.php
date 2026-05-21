<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        // Build users query with company car and company car's insurance policy
        $usersQuery = User::with(['car', 'car.insurance']);

        if ($search) {
            $usersQuery->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('car', function ($subQuery) use ($search) {
                        $subQuery->where('model', 'LIKE', '%' . $search . '%');
                    });
            });
        }

        $users = $usersQuery->get();

        // Build throughUsers query with company car and insurance policies (hasManyThrough relationship)
        $throughUsersQuery = User::with(['car', 'insurancePolicies']);

        if ($search) {
            $throughUsersQuery->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('car', function ($subQuery) use ($search) {
                        $subQuery->where('model', 'LIKE', '%' . $search . '%');
                    });
            });
        }

        $throughUsers = $throughUsersQuery->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'throughUsers' => $throughUsers,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }
}
