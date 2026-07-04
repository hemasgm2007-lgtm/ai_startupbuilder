import { motion } from 'framer-motion';
import {
  Bell, Bot, Copy, Key, Palette, RefreshCw, Save, Upload, User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ACCENT_COLORS, AI_MODELS } from '../utils/constants';
import { copyToClipboard } from '../utils/helpers';

interface SettingsPageProps {
  onNavigate: (path: string) => void;
}

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Preferences', icon: Bot },
  { id: 'api', label: 'API Keys', icon: Key },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [accent, setAccent] = useState(ACCENT_COLORS[0].value);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [aiLimit, setAiLimit] = useState(100);
  const [defaultModel, setDefaultModel] = useState(AI_MODELS[0]);
  const [creativity, setCreativity] = useState(70);
  const [apiKey] = useState('sk-asb-' + Math.random().toString(36).slice(2, 18));

  const handleSave = async () => {
    await updateUser({ name, email, bio });
    showToast('success', 'Settings saved successfully.');
  };

  const handleCopyKey = async () => {
    const ok = await copyToClipboard(apiKey);
    showToast(ok ? 'success' : 'error', ok ? 'API key copied to clipboard.' : 'Failed to copy.');
  };

  const handleRegenerateKey = () => {
    showToast('info', 'API key regeneration is a placeholder in this demo.');
  };

  return (
    <DashboardLayout onNavigate={onNavigate} currentPath="/settings">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6 border-b border-slate-200 dark:border-slate-800">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
        >
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <img src={user?.avatarUrl} alt={user?.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                    Upload new
                  </Button>
                </div>
              </div>
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
              <Button onClick={handleSave} leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button>
            </div>
          )}

          {/* Theme */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Appearance</label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {(['light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        theme === t
                          ? 'border-primary-500 bg-primary-500/5'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-16 rounded-lg mb-2 ${t === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
                        <div className="flex h-full items-center justify-center text-xs text-slate-500">
                          {t === 'light' ? 'Light' : 'Dark'}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{t} mode</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Accent color</label>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAccent(c.value)}
                      className={`h-10 w-10 rounded-xl transition-all ${accent === c.value ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : ''}`}
                      style={{ background: c.value }}
                      aria-label={c.name}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <ToggleRow
                label="Email notifications"
                description="Receive emails about your account activity and project updates."
                checked={emailNotif}
                onChange={setEmailNotif}
              />
              <ToggleRow
                label="Push notifications"
                description="Get real-time notifications in your browser."
                checked={pushNotif}
                onChange={setPushNotif}
              />
              <ToggleRow
                label="Product updates"
                description="Be the first to know about new features and improvements."
                checked={productUpdates}
                onChange={setProductUpdates}
              />
              <ToggleRow
                label="Marketing emails"
                description="Receive tips, offers, and promotional content."
                checked={marketingEmails}
                onChange={setMarketingEmails}
              />
              <Button onClick={handleSave} leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button>
            </div>
          )}

          {/* AI Preferences */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Monthly AI usage limit: {aiLimit} requests
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={aiLimit}
                  onChange={(e) => setAiLimit(Number(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10</span>
                  <span>500</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default AI model</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {AI_MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => setDefaultModel(model)}
                      className={`p-3 rounded-xl border text-left text-sm transition-all ${
                        defaultModel === model
                          ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Creativity level: {creativity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={creativity}
                  onChange={(e) => setCreativity(Number(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
              <Button onClick={handleSave} leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button>
            </div>
          )}

          {/* API Keys */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">API Key</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-sm text-slate-700 dark:text-slate-300 truncate">
                    {apiKey}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyKey} leftIcon={<Copy className="h-4 w-4" />}>
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Keep your API key secure. Do not share it publicly.</p>
              </div>
              <Button variant="outline" onClick={handleRegenerateKey} leftIcon={<RefreshCw className="h-4 w-4" />}>
                Regenerate Key
              </Button>
              <div className="mt-6 p-4 rounded-xl bg-warning-500/10 border border-warning-500/20">
                <p className="text-sm text-warning-700 dark:text-warning-400">
                  This is a placeholder API key for demonstration purposes only. No real API access is granted.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({
  label, description, checked, onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
