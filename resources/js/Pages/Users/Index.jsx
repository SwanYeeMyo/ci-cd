import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

export default function Index({ users, throughUsers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // Debounce search input to avoid querying on every keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    '/users',
                    { search: search },
                    {
                        preserveState: true,
                        replace: true,
                    }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                
                {/* Header title */}
                <div className="border-b border-neutral-200 pb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800">
                        Users Directory
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Verify system users, assigned cars, and insurance relationships.
                    </p>
                </div>

                {/* Search & Actions Panel */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                    <div className="w-full md:max-w-md relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search users by name, email, or car model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all placeholder-neutral-400 text-sm text-neutral-800"
                        />
                    </div>
                    
                    <div className="text-xs text-neutral-500 font-semibold self-end md:self-center">
                        Showing {users.length} results
                    </div>
                </div>

                {/* Grid showing both relationship styles side-by-side */}
                <div className="grid lg:grid-cols-2 gap-8">
                    
                    {/* Panel 1: Nested Eager Loading (Car -> Insurance) */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-violet-750">
                                Nested Relationship Queries
                            </h2>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                Loaded using: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-600">User::with('car', 'car.insurance')</code>
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-neutral-100">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">User Details</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Company Car</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Insurance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-sm text-neutral-500">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-semibold text-sm text-neutral-800">{user.name}</div>
                                                    <div className="text-xs text-neutral-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.car ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-700">
                                                            🚘 {user.car.model}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-neutral-450">None assigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.car?.insurance ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-violet-50 border border-violet-200 text-violet-700">
                                                            🛡️ {user.car.insurance.provider}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-neutral-455">No policy</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Panel 2: HasManyThrough Eager Loading (Direct insurancePolicies) */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-cyan-750">
                                HasManyThrough Relationship
                            </h2>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                Loaded using: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-600">User::with('insurancePolicies')</code>
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-neutral-100">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">User Details</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Policies List</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white">
                                    {throughUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-10 text-center text-sm text-neutral-500">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        throughUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-semibold text-sm text-neutral-800">{user.name}</div>
                                                    <div className="text-xs text-neutral-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-2">
                                                        {user.insurance_policies && user.insurance_policies.length > 0 ? (
                                                            user.insurance_policies.map((policy) => (
                                                                <span key={policy.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-50 border border-cyan-200 text-cyan-700">
                                                                    🛡️ {policy.provider}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-neutral-450">No policies listed</span>
                                                        )}
                                                    </div>
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
