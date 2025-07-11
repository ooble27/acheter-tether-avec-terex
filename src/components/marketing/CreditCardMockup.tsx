
import { Smartphone, Wifi, CreditCard } from 'lucide-react';

export function CreditCardMockup() {
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Card Container */}
      <div className="relative">
        {/* Main Card */}
        <div className="relative w-80 h-48 bg-gradient-to-br from-terex-accent via-terex-accent to-terex-accent/80 rounded-2xl shadow-2xl overflow-hidden">
          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Card Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
            {/* Top Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Terex Card</span>
              </div>
              <Wifi className="w-5 h-5 opacity-70" />
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <div className="text-lg font-mono tracking-wider">
                4532 •••• •••• 8901
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-70">Titulaire</div>
                  <div className="text-sm font-medium">AHMED DIALLO</div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Expire</div>
                  <div className="text-sm font-medium">12/28</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Card (behind) */}
        <div className="absolute -top-2 -right-2 w-80 h-48 bg-gradient-to-br from-terex-darker to-terex-gray rounded-2xl shadow-xl -z-10 opacity-60"></div>
        
        {/* Third Card (further behind) */}
        <div className="absolute -top-4 -right-4 w-80 h-48 bg-gradient-to-br from-terex-gray to-terex-darker rounded-2xl shadow-lg -z-20 opacity-30"></div>
      </div>

      {/* Payment Methods Icons */}
      <div className="flex justify-center items-center space-x-6 mt-8">
        <div className="flex items-center justify-center w-12 h-8 bg-white rounded-md shadow">
          <div className="text-xs font-bold text-blue-600">VISA</div>
        </div>
        <div className="flex items-center justify-center w-12 h-8 bg-white rounded-md shadow">
          <div className="text-xs font-bold text-red-600">MC</div>
        </div>
        <div className="flex items-center justify-center w-12 h-8 bg-terex-accent rounded-md shadow">
          <Smartphone className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
