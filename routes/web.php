<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('users', function (Request $request) {

    $search = $request->input('search');
    // $users = User::with('car')->when($search, fn($q, $search) =>
    // $q->where('name', 'LIKE', '%' . $search . '%')->orWhereHas('car', fn($subQuery) => $subQuery->where('model', 'LIKE', '%' . $search . '%')))->get();

    $users = User::with('car', 'car.insurance')->get();
    $throughUsers = User::with('car', 'insurancePolicies')->get();


    return view('test', compact('users', 'throughUsers'));
});
