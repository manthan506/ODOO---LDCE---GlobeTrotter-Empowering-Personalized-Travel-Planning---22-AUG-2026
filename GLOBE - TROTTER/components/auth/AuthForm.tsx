'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Compass,
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  MapPin,
  Globe,
  Camera,
  FileText,
  CheckCircle2,
  Sparkles,
  Upload,
  Link2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTripSync } from '@/context/TripSyncContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
];

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { updateUserProfile } = useTripSync();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Login & Shared State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Screen 2 Registration Specific State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const isSignup = mode === 'signup';

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Compress and resize image using canvas for instant display and storage
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatar(dataUrl);
          updateUserProfile({ avatar: dataUrl });
          toast.success('Profile photo uploaded successfully! ✨');
        }
        setUploadingPhoto(false);
      };

      img.onerror = () => {
        toast.error('Could not process image file.');
        setUploadingPhoto(false);
      };

      if (typeof readerEvent.target?.result === 'string') {
        img.src = readerEvent.target.result;
      }
    };

    reader.readAsDataURL(file);
    // Reset file input value so selecting the same file again triggers onChange
    e.target.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        if (!firstName.trim()) {
          toast.error('Please enter your first name');
          setLoading(false);
          return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        const res = await signUp({
          name: fullName,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          city: city.trim(),
          country: country.trim(),
          avatar,
          additionalInfo: additionalInfo.trim(),
        });

        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success('Account created successfully! Welcome to GlobeTrotter ✨');
      } else {
        const res = await signIn(email.trim(), password);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success('Welcome back to GlobeTrotter! 👋');
      }
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-4 py-10 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className={`w-full ${isSignup ? 'max-w-2xl' : 'max-w-md'} relative z-10 transition-all duration-300`}>
        {/* Brand Header */}
        <Link href="/" className="mb-6 flex flex-col items-center justify-center gap-2 group">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
            <Compass size={28} strokeWidth={2.2} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">GlobeTrotter</span>
          <span className="text-xs text-blue-200/70 font-medium -mt-1">
            Empowering Personalized Travel Planning
          </span>
        </Link>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {/* Wireframe Top Photo Circle */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div
                onClick={() => {
                  if (isSignup) fileInputRef.current?.click();
                }}
                className={`h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center relative ${
                  isSignup ? 'cursor-pointer hover:ring-4 hover:ring-blue-400/40 transition' : ''
                }`}
                title={isSignup ? 'Click to upload your profile photo' : 'User Account'}
              >
                {isSignup ? (
                  <img
                    src={avatar}
                    alt="User Photo"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <UserIcon size={40} strokeWidth={1.75} />
                  </div>
                )}

                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <Loader2 size={24} className="animate-spin text-blue-400" />
                  </div>
                )}
              </div>

              {isSignup && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white border-2 border-white shadow-md hover:bg-blue-700 cursor-pointer transition active:scale-95"
                  title="Upload profile photo from computer"
                >
                  <Camera size={14} />
                </button>
              )}

              {/* Hidden File Input with explicit ref */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {isSignup && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Upload size={12} />
                  <span>Upload Photo</span>
                </button>

                <span className="text-slate-300">•</span>

                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>{showAvatarPicker ? 'Hide Presets' : 'Choose Preset'}</span>
                </button>

                <span className="text-slate-300">•</span>

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter public image URL for your profile photo:', avatar);
                    if (url && url.trim()) {
                      setAvatar(url.trim());
                      updateUserProfile({ avatar: url.trim() });
                      toast.success('Profile photo updated from URL!');
                    }
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Link2 size={12} />
                  <span>Image URL</span>
                </button>
              </div>
            )}

            {/* Avatar Preset Tray */}
            {isSignup && showAvatarPicker && (
              <div className="mt-3 flex items-center justify-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatar(preset);
                      toast.success(`Selected Avatar #${idx + 1}`);
                    }}
                    className={`h-9 w-9 rounded-full overflow-hidden border-2 transition ${
                      avatar === preset ? 'border-blue-600 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {isSignup ? 'Create Your Account ✨' : 'Welcome Back! 👋'}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 font-medium text-center">
              {isSignup
                ? 'Fill out your travel details to start planning personalized journeys.'
                : 'Enter your credentials to access your trips and itineraries.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* LOGIN FIELDS */}
            {!isSignup && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Email Address / Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info('Password reset instructions sent to your email address (Demo)');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </>
            )}

            {/* REGISTRATION FIELDS */}
            {isSignup && (
              <>
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">First Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <UserIcon size={17} />
                      </div>
                      <input
                        required
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <UserIcon size={17} />
                      </div>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email Address & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Mail size={17} />
                      </div>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Phone size={17} />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: City & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">City</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <MapPin size={17} />
                      </div>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="Ahmedabad"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Country</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Globe size={17} />
                      </div>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="India"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Additional Information (Textarea) */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Additional Information / Preferences
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                      <FileText size={17} />
                    </div>
                    <textarea
                      rows={3}
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none"
                      placeholder="Travel style (backpacker, luxury, solo), dietary preferences, favorite destinations..."
                    />
                  </div>
                </div>

                {/* Row 5: Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Lock size={17} />
                    </div>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:opacity-95 hover:shadow-blue-500/35 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Log In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Switch Link */}
          <p className="mt-6 text-center text-xs text-slate-500 font-medium">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              href={isSignup ? '/login' : '/signup'}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
