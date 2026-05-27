import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { User, Mail, Phone, MapPin, Lock, Shield, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const showToast = useToast();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [activeTab, setActiveTab] = useState('personal');

  // React Hook Form instances for separate concerns
  const personalForm = useForm({
    defaultValues: { name: '', email: '', phone: '' }
  });
  
  const addressForm = useForm({
    defaultValues: { address: '' }
  });
  
  const passwordForm = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  // Fetch full profile info on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await api.user.getProfile();
        setProfileData(data);
        
        // Reset forms with loaded values
        personalForm.reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
        
        addressForm.reset({
          address: data.address || ''
        });
      } catch (err) {
        showToast(err.message || 'Failed to fetch profile details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [personalForm, addressForm]);

  const onUpdatePersonal = async (data) => {
    setSavingPersonal(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: addressForm.getValues('address')
      };
      
      const updated = await api.user.updateProfile(payload);
      setProfileData(updated);
      updateUser({ name: updated.name, email: updated.email });
      showToast('Personal information updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update personal details.', 'error');
    } finally {
      setSavingPersonal(false);
    }
  };

  const onUpdateAddress = async (data) => {
    setSavingAddress(true);
    try {
      const payload = {
        name: personalForm.getValues('name'),
        email: personalForm.getValues('email'),
        phone: personalForm.getValues('phone'),
        address: data.address
      };
      
      const updated = await api.user.updateProfile(payload);
      setProfileData(updated);
      showToast('Shipping address updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update shipping address.', 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  const onUpdatePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    
    setSavingPassword(true);
    try {
      const payload = {
        name: personalForm.getValues('name'),
        email: personalForm.getValues('email'),
        phone: personalForm.getValues('phone'),
        address: addressForm.getValues('address'),
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      };
      
      await api.user.updateProfile(payload);
      passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center">
        <div className="border-3 border-black border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
        <span className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Loading details...</span>
      </div>
    );
  }

  const joinDate = profileData?.createdAt 
    ? new Date(profileData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="bg-[#fcfcfd] min-h-screen px-6 py-12 max-w-[90rem] mx-auto">
      {/* Title section */}
      <div className="border-b border-neutral-100 pb-6 mb-10 text-left">
        <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
          ACCOUNT SETTINGS
        </span>
        <h1 className="text-3xl md:text-4xl font-serif-editorial text-black tracking-tight mt-2 uppercase">
          My Account
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left Side: Avatar Card & Tab buttons */}
        <div className="lg:col-span-1 space-y-8">
          <div className="border border-neutral-200/60 rounded-sm p-6 bg-white shadow-xxs flex flex-col items-center text-center">
            {/* Avatar Circle */}
            <div className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center rounded-full text-lg font-bold tracking-wider mb-4 select-none">
              {getInitials(profileData?.name)}
            </div>
            
            <h2 className="text-sm font-bold text-black uppercase tracking-tight truncate max-w-full">
              {profileData?.name}
            </h2>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider truncate max-w-full mb-3">
              {profileData?.email}
            </p>
            
            {/* Role Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded-sm border border-black bg-black text-white">
              {profileData?.role === 'ROLE_ADMIN' ? (
                <>
                  <Shield size={9} />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <User size={9} />
                  <span>Customer</span>
                </>
              )}
            </span>

            <div className="w-full border-t border-neutral-100 mt-6 pt-4 text-left">
              <div className="flex items-center gap-2 text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">
                <Calendar size={12} className="text-neutral-400 shrink-0" />
                <span>Member Since:</span>
              </div>
              <p className="text-xs font-semibold text-neutral-800 mt-1 uppercase">
                {joinDate}
              </p>
            </div>
          </div>

          {/* Navigation Sidebar List */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible border border-neutral-200/60 rounded-sm p-1.5 gap-1 shadow-xxs bg-white scrollbar-none">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 text-left px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer border-0 ${
                activeTab === 'personal'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-transparent text-neutral-400 hover:text-black hover:bg-neutral-50'
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`flex-1 text-left px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer border-0 ${
                activeTab === 'address'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-transparent text-neutral-400 hover:text-black hover:bg-neutral-50'
              }`}
            >
              Shipping Address
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 text-left px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer border-0 ${
                activeTab === 'password'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-transparent text-neutral-400 hover:text-black hover:bg-neutral-50'
              }`}
            >
              Password Security
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-3">
          <div className="border border-neutral-200/60 rounded-sm p-6 md:p-8 bg-white shadow-xxs min-h-[400px]">
            
            {/* PERSONAL DETAILS TAB */}
            {activeTab === 'personal' && (
              <div className="animate-fadeIn">
                <div className="border-b border-neutral-100 pb-4 mb-6 text-left">
                  <h3 className="text-base font-bold uppercase text-black tracking-wider">Personal Details</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 font-semibold uppercase tracking-widest">
                    Update your account contact information
                  </p>
                </div>
                
                <form onSubmit={personalForm.handleSubmit(onUpdatePersonal)} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                          <User size={14} />
                        </div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          {...personalForm.register('name', { required: 'Name is required' })}
                          className={`w-full nike-input pl-10 ${
                            personalForm.formState.errors.name ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {personalForm.formState.errors.name && (
                        <span className="text-red-500 text-xs mt-1 block font-semibold">
                          {personalForm.formState.errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                          <Mail size={14} />
                        </div>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          {...personalForm.register('email', {
                            required: 'Email address is required',
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                              message: 'Please enter a valid email address'
                            }
                          })}
                          className={`w-full nike-input pl-10 ${
                            personalForm.formState.errors.email ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {personalForm.formState.errors.email && (
                        <span className="text-red-500 text-xs mt-1 block font-semibold">
                          {personalForm.formState.errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Phone size={14} />
                      </div>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 000-0000"
                        {...personalForm.register('phone')}
                        className="w-full nike-input pl-10"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingPersonal}
                      className="nike-btn-black flex items-center space-x-2 text-xs cursor-pointer min-w-[140px] justify-center"
                    >
                      {savingPersonal ? (
                        <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SHIPPING ADDRESS TAB */}
            {activeTab === 'address' && (
              <div className="animate-fadeIn">
                <div className="border-b border-neutral-100 pb-4 mb-6 text-left">
                  <h3 className="text-base font-bold uppercase text-black tracking-wider">Shipping Address</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 font-semibold uppercase tracking-widest">
                    Provide a default shipping address for checkout speed
                  </p>
                </div>

                <form onSubmit={addressForm.handleSubmit(onUpdateAddress)} className="space-y-5 text-left">
                  <div>
                    <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                      Full Shipping Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-neutral-400">
                        <MapPin size={14} />
                      </div>
                      <textarea
                        rows="5"
                        placeholder="Street address, apartment, city, state, postal code, country"
                        {...addressForm.register('address')}
                        className="w-full nike-input pl-10 min-h-[120px] resize-y"
                      ></textarea>
                    </div>
                    <p className="text-[9px] text-neutral-400 mt-1.5 font-semibold uppercase tracking-wider">
                      This address will be automatically selected as your shipping destination on your next checkout.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="nike-btn-black flex items-center space-x-2 text-xs cursor-pointer min-w-[140px] justify-center"
                    >
                      {savingAddress ? (
                        <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
                      ) : (
                        <span>Save Address</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'password' && (
              <div className="animate-fadeIn">
                <div className="border-b border-neutral-100 pb-4 mb-6 text-left">
                  <h3 className="text-base font-bold uppercase text-black tracking-wider">Password Security</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 font-semibold uppercase tracking-widest">
                    Change your profile security password credentials
                  </p>
                </div>

                <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-5 text-left">
                  <div>
                    <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Lock size={14} />
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
                        className={`w-full nike-input pl-10 ${
                          passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <span className="text-red-500 text-xs mt-1 block font-semibold">
                        {passwordForm.formState.errors.currentPassword.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                          <Lock size={14} />
                        </div>
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...passwordForm.register('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'New password must be at least 6 characters'
                            }
                          })}
                          className={`w-full nike-input pl-10 ${
                            passwordForm.formState.errors.newPassword ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <span className="text-red-500 text-xs mt-1 block font-semibold">
                          {passwordForm.formState.errors.newPassword.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                          <Lock size={14} />
                        </div>
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...passwordForm.register('confirmPassword', {
                            required: 'Confirming your new password is required'
                          })}
                          className={`w-full nike-input pl-10 ${
                            passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <span className="text-red-500 text-xs mt-1 block font-semibold">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="nike-btn-black flex items-center space-x-2 text-xs cursor-pointer min-w-[140px] justify-center"
                    >
                      {savingPassword ? (
                        <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}
