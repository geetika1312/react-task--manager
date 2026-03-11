import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, Users, Bell, Search, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '#my-tasks' },
    { icon: Bell, label: 'Inbox', path: '#inbox' },
    { icon: Users, label: 'Team', path: '#team' },
    { icon: Settings, label: 'Settings', path: '#settings' },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col h-screen overflow-y-auto">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50">
        <img 
          src={`${import.meta.env.BASE_URL}images/logo.png`} 
          alt="TaskFlow Logo" 
          className="w-8 h-8 rounded shadow-lg shadow-primary/20"
        />
        <span className="ml-3 font-display font-bold text-xl text-white tracking-wide">
          Task<span className="text-primary">Flow</span>
        </span>
      </div>

      {/* Search mock */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search team..."
            className="w-full bg-sidebar-accent/50 border border-sidebar-border text-sm rounded-lg pl-9 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-2">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Favorites</p>
        
        {navItems.map((item, idx) => {
          const isLink = item.path === '/';
          const content = (
            <>
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">{item.label}</span>
            </>
          );
          
          const className = cn(
            "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group",
            isLink ? "text-primary bg-primary/10" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          );

          return isLink ? (
            <NavLink key={idx} to={item.path} className={className}>
              {content}
            </NavLink>
          ) : (
            <a key={idx} href={item.path} className={className}>
              {content}
            </a>
          );
        })}
      </nav>

      {/* User profile mock */}
      <div className="p-4 border-t border-sidebar-border/50">
        <button className="flex items-center w-full px-2 py-2 rounded-xl hover:bg-sidebar-accent transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-primary flex items-center justify-center text-white font-bold text-xs shadow-md">
            JS
          </div>
          <div className="ml-3 text-left">
            <p className="text-sm font-medium text-foreground">John Smith</p>
            <p className="text-xs text-muted-foreground">Pro Plan</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
