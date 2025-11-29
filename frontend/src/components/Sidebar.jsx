import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, FolderOpen, Settings, Crown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: FolderOpen, label: 'Projects', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Crown, label: 'Pro Plan', path: '/pro' },
  ];

  return (
    <div 
      className={clsx(
        'bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo and Toggle Button */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="w-8 h-8 text-primary-600 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">AI Studio</span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
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
              className={clsx(
                'sidebar-link',
                isActive && 'active',
                isCollapsed && 'justify-center'
              )}
              data-testid={`sidebar-${item.label.toLowerCase().replace(' ', '-')}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* New Project Button */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/projects/new"
          className={clsx(
            'flex items-center gap-2 w-full btn-primary',
            isCollapsed ? 'justify-center px-2' : 'justify-center'
          )}
          data-testid="new-project-button"
          title={isCollapsed ? 'New Project' : ''}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>New Project</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
