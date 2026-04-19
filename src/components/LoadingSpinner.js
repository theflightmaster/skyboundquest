'use client';

import { Plane } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', subMessage = 'Please wait while we process your request' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        
        {/* Inner rotating ring */}
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        
        {/* Airplane icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-bounce">
            <Plane size={24} className="text-blue-600" />
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-700 font-semibold">{message}</p>
        <p className="text-gray-400 text-sm mt-1">{subMessage}</p>
      </div>
    </div>
  );
}