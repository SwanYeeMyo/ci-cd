import React from 'react';

export default function DashboardLayout({ children }) {
    // Basic helper to determine if current path is active
    const isCurrentPath = (path) => {
        if (typeof window !== 'undefined') {
            if (path === '/') {
                return window.location.pathname === '/';
            }
            return window.location.pathname.startsWith(path);
        }
        return false;
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'Expenses Tracker', path: '/expenses', icon: '💸' },
        { name: 'Girlfriend Spends', path: '/girlfriend-expenses', icon: '💖' },
        { name: 'Savings & Projections', path: '/savings', icon: '📈' },
        { name: 'Users Directory', path: '/users', icon: '👥' },
    ];

    return (
        <div className="min-h-screen bg-[#F7F6F3] text-neutral-800 flex flex-col md:flex-row font-sans overflow-x-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-[#EFEFEA]/65 border-b md:border-b-0 md:border-r border-neutral-200/80 backdrop-blur-md flex flex-col shrink-0 z-30">
                {/* Logo Section */}
                <div className="px-6 py-6 border-b border-neutral-200/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-palette-sage-dark to-palette-sage flex items-center justify-center font-black text-lg shadow-lg shadow-palette-sage-dark/20 text-white animate-pulse">
                        $
                    </div>
                    <span className="font-extrabold text-lg tracking-tight text-neutral-800">
                        FinancePortal
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const active = isCurrentPath(item.path);
                        return (
                            <a
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group border ${
                                    active
                                        ? 'bg-white border-neutral-200 text-neutral-900 shadow-sm shadow-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/40 border-transparent'
                                }`}
                            >
                                <span className={`text-base transition-transform group-hover:scale-110 duration-200`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </a>
                        );
                    })}
                </nav>

                {/* Sidebar Footer info */}
                <div className="p-6 border-t border-neutral-200/60 text-[10px] text-neutral-400">
                    <div>Finance SPA Portal v1.0</div>
                    <div className="mt-1">Powered by Laravel + Inertia</div>
                </div>
            </aside>

            {/* Main Application Area */}
            <div className="flex-1 flex flex-col relative min-h-screen min-w-0">
                {/* Ambient background glows */}
                <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full bg-palette-sage-dark/8 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-palette-rose/8 blur-[110px] pointer-events-none" />

                {/* Page Content Panel */}
                <div className="flex-1 relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
