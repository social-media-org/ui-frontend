import React from 'react';
import { Crown, Check, Zap } from 'lucide-react';

const ProPlanPage = () => {
  const features = [
    'Unlimited video generation',
    'Priority processing',
    '4K resolution support',
    'Advanced AI voices',
    'Custom templates',
    'Commercial license',
    'Priority support',
    'Early access to new features',
  ];

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pro Plan</h1>
        <p className="text-gray-600">Unlock the full potential of AI Studio.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Studio Pro</h2>
          <p className="text-gray-600 mb-8">
            Everything you need to create professional AI-generated videos at scale.
          </p>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-8 mb-8">
            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="text-5xl font-bold text-gray-900">$29</span>
              <span className="text-xl text-gray-600 mb-2">/month</span>
            </div>
            <p className="text-gray-600">or $290/year (save 16%)</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="btn-primary w-full md:w-auto px-8 py-4 text-lg flex items-center justify-center gap-2 mx-auto">
            <Zap className="w-5 h-5" />
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProPlanPage;
