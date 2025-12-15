import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Palette, Shield, Globe, CreditCard, Zap } from 'lucide-react';
import YouTubeConnectionCard from '../components/YouTube/YouTubeConnectionCard';

const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your account, integrations, and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="space-y-8">
          {/* Integrations Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-600" />
                Integrations
              </h2>
              <p className="text-sm text-gray-600 mt-1">Connect external services to enhance your workflow</p>
            </div>
            
            {/* YouTube Integration - Most Important */}
            <YouTubeConnectionCard />
          </section>

          {/* Account Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Account
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage your personal information and account settings</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile */}
              <div className="group card hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile</h3>
                    <p className="text-sm text-gray-600">Update your personal information, avatar, and display name</p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="group card hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Security</h3>
                    <p className="text-sm text-gray-600">Change password, enable 2FA, and manage security settings</p>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="group card hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Privacy</h3>
                    <p className="text-sm text-gray-600">Control your data, privacy preferences, and visibility</p>
                  </div>
                </div>
              </div>

              {/* Billing */}
              <div className="group card hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Billing</h3>
                    <p className="text-sm text-gray-600">Manage subscription, payment methods, and invoices</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary-600" />
                Preferences
              </h2>
              <p className="text-sm text-gray-600 mt-1">Customize your experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Appearance */}
              <div className="group card hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Palette className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Appearance</h3>
                    <p className="text-sm text-gray-600">Customize theme, colors, and visual preferences</p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="group card hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Notifications</h3>
                    <p className="text-sm text-gray-600">Configure notification preferences and alerts</p>
                  </div>
                </div>
              </div>

              {/* Language & Region */}
              <div className="group card hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Language & Region</h3>
                    <p className="text-sm text-gray-600">Set language, timezone, and regional preferences</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
