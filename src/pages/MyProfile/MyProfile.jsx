import React, { useState } from 'react';
import { User, Lock, Ruler, MapPin, LogOut } from 'lucide-react';

export const MyProfile = ({ setCurrentTab }) => {
  const [activeSection, setActiveSection] = useState('personal');

  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
    { id: 'measurements', label: 'Couture Measurements', icon: <Ruler size={18} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
  ];

  return (
    <div className="bg-[#F8F4EE] min-h-screen py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display-lg text-4xl text-[#7B8467] mb-8 text-center md:text-left">My Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-sm border border-[#C8A34D]/20 overflow-hidden">
            <div className="p-6 border-b border-[#C8A34D]/20 bg-[#fbf9f6]">
              <div className="w-16 h-16 bg-[#7B8467] text-white rounded-full flex items-center justify-center text-2xl font-display-md mx-auto mb-3">
                JD
              </div>
              <h2 className="text-center font-display-md text-xl text-[#2C3522]">Jane Doe</h2>
              <p className="text-center text-sm text-[#7B8467]">jane.doe@example.com</p>
            </div>
            
            <nav className="p-4 flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-label-caps tracking-wider transition-colors ${
                    activeSection === item.id 
                      ? 'bg-[#7B8467] text-white' 
                      : 'text-[#2C3522] hover:bg-[#F8F4EE]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              
              <div className="my-2 border-t border-gray-100"></div>
              
              <button 
                onClick={() => setCurrentTab('shop')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-label-caps tracking-wider text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4 bg-white rounded-2xl shadow-sm border border-[#C8A34D]/20 p-8 md:p-10">
            
            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <div className="animate-fade-in">
                <h3 className="font-display-md text-2xl text-[#2C3522] mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">First Name</label>
                    <input type="text" defaultValue="Jane" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Last Name</label>
                    <input type="text" defaultValue="Doe" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Email Address</label>
                    <input type="email" defaultValue="jane.doe@example.com" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button className="px-8 py-3 bg-[#7B8467] text-white font-label-caps tracking-widest text-[11px] uppercase hover:bg-[#5f6652] transition-colors rounded">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="animate-fade-in">
                <h3 className="font-display-md text-2xl text-[#2C3522] mb-6 border-b border-gray-100 pb-4">Security & Password</h3>
                <div className="max-w-md flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Current Password</label>
                    <input type="password" placeholder="••••••••" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">New Password</label>
                    <input type="password" placeholder="Enter new password" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                </div>
                <div className="mt-8">
                  <button className="px-8 py-3 bg-[#7B8467] text-white font-label-caps tracking-widest text-[11px] uppercase hover:bg-[#5f6652] transition-colors rounded">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Measurements Section */}
            {activeSection === 'measurements' && (
              <div className="animate-fade-in">
                <h3 className="font-display-md text-2xl text-[#2C3522] mb-6 border-b border-gray-100 pb-4">Couture Measurements (in inches)</h3>
                <p className="text-on-surface-variant mb-8 text-sm">Save your exact measurements here to ensure the perfect bespoke fit for all your boutique orders.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Bust / Chest</label>
                    <input type="number" placeholder="34" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Waist</label>
                    <input type="number" placeholder="28" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Hips</label>
                    <input type="number" placeholder="38" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Shoulder width</label>
                    <input type="number" placeholder="15" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Arm Length</label>
                    <input type="number" placeholder="24" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-label-caps tracking-widest text-[#7B8467]">Inseam</label>
                    <input type="number" placeholder="30" className="border border-[#C8A34D]/30 rounded-md p-3 focus:outline-none focus:border-[#7B8467] bg-[#fbf9f6]" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button className="px-8 py-3 bg-[#C8A34D] text-white font-label-caps tracking-widest text-[11px] uppercase hover:bg-[#b08e40] transition-colors rounded">
                    Save Measurements
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Section */}
            {activeSection === 'addresses' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="font-display-md text-2xl text-[#2C3522]">Saved Addresses</h3>
                  <button className="text-sm font-label-caps tracking-widest text-[#7B8467] hover:text-[#C8A34D] uppercase underline">
                    + Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Default Address */}
                  <div className="border border-[#7B8467] rounded-xl p-5 relative bg-[#F8F4EE]/50">
                    <span className="absolute top-4 right-4 text-[10px] font-label-caps tracking-widest bg-[#7B8467] text-white px-2 py-1 rounded">DEFAULT</span>
                    <h4 className="font-display-md text-lg text-[#2C3522] mb-2">Jane Doe</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      123 Luxury Avenue, Suite 400<br/>
                      Beverly Hills, CA 90210<br/>
                      United States<br/>
                      +1 (555) 123-4567
                    </p>
                    <div className="mt-4 flex gap-4 text-sm font-label-caps tracking-widest">
                      <button className="text-[#7B8467] hover:text-[#2C3522]">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
