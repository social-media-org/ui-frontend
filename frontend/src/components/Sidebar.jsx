import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, FolderOpen, Settings, Crown, Plus } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: FolderOpen, label: 'Projects', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Crown, label: 'Pro Plan', path: '/pro' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">AI Studio</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx('sidebar-link', isActive && 'active')}
              data-testid={`sidebar-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* New Project Button */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/projects/new"
          className="flex items-center gap-2 w-full btn-primary justify-center"
          data-testid="new-project-button"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
