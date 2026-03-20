import { useState, useEffect } from 'react';
import { Check, Camera } from 'lucide-react';
import type { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onThemeChange: (theme: UserProfile['theme']) => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD'];

const DATE_FORMATS: { value: UserProfile['dateFormat']; label: string; example: string }[] = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '03/19/2026' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '19/03/2026' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2026-03-19' },
];

const THEME_OPTIONS: { value: UserProfile['theme']; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const PRESET_AVATARS = [
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Felix&backgroundColor=76DDAA',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Aneka&backgroundColor=FF6584',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Milo&backgroundColor=60a5fa',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Nala&backgroundColor=facc15',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Oscar&backgroundColor=c084fc',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Luna&backgroundColor=f472b6',
];

export function Settings({ profile, onSave, onThemeChange }: Props) {
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(profile);
  const initials =
    draft.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  return (
    <div
      className="max-w-2xl mx-auto"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* ── Profile Card ──────────────────────────────── */}
      <div
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm"
        style={{ padding: '24px' }}
      >
        <p
          className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
          style={{ marginBottom: '20px' }}
        >
          Profile
        </p>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            {draft.avatarUrl ? (
              <img
                src={draft.avatarUrl}
                alt="Avatar"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #76DDAA',
                }}
              />
            ) : (
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #76DDAA, #5BB88A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#fff',
                  border: '3px solid #76DDAA',
                }}
              >
                {initials}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ marginBottom: '8px' }}
            >
              Choose an avatar
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESET_AVATARS.map((url) => (
                <button
                  key={url}
                  onClick={() => update('avatarUrl', url)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: draft.avatarUrl === url ? '2px solid #76DDAA' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <img src={url} alt="" style={{ width: '100%', height: '100%' }} />
                </button>
              ))}
              <button
                onClick={() => update('avatarUrl', '')}
                title="Use initials"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: !draft.avatarUrl ? '2px solid #76DDAA' : '2px solid #e2e8f0',
                  cursor: 'pointer',
                  background: !draft.avatarUrl ? '#f0fdf4' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'border-color 0.15s',
                }}
              >
                <Camera size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={draft.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* ── Preferences Card ──────────────────────────── */}
      <div
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm"
        style={{ padding: '24px' }}
      >
        <p
          className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
          style={{ marginBottom: '20px' }}
        >
          Preferences
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Default Currency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Default Currency
            </label>
            <select
              value={draft.defaultCurrency}
              onChange={(e) => update('defaultCurrency', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
              style={{ maxWidth: '200px' }}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Date Format
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {DATE_FORMATS.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => update('dateFormat', fmt.value)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    draft.dateFormat === fmt.value
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <span>{fmt.label}</span>
                  <span className="block text-xs opacity-60 mt-0.5">{fmt.example}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Theme
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    update('theme', opt.value);
                    onThemeChange(opt.value);
                  }}
                  className={`px-5 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    draft.theme === opt.value
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gemini API Key */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={draft.geminiApiKey || ''}
              onChange={(e) => update('geminiApiKey', e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-slate-700 dark:text-slate-100"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Used for the local AI assistant. Stored securely in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* ── Save Button ───────────────────────────────── */}
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingBottom: '20px' }}
      >
        {saved && (
          <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
            <Check size={16} /> Saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            hasChanges
              ? 'bg-primary-400 hover:bg-primary-500 text-white shadow-sm shadow-primary-200'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
