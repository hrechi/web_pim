import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Mail, Star, MessageSquare, LogOut, Users, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/stores/admin-store';
import { adminService, type ContactMessage, type Rating, type AdminStats } from '@/services/admin.service';
import type { AuthUser } from '@/types/auth';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const adminToken = useAdminStore((s) => s.adminToken);
  const clearAdminToken = useAdminStore((s) => s.clearAdminToken);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [accounts, setAccounts] = useState<AuthUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'ratings' | 'accounts'>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [adminToken, navigate]);

  const loadData = async () => {
    try {
      console.log('[AdminDashboard] Loading data...');
      const msgs = adminService.getLocalContactMessages();
      const rats = adminService.getLocalRatings();
      console.log('[AdminDashboard] Calling getFarmerAccounts...');
      const accs = await adminService.getFarmerAccounts();
      console.log('[AdminDashboard] Got accounts:', accs);
      const adminStats = adminService.getLocalStats();

      setMessages(msgs);
      setRatings(rats);
      setAccounts(accs);
      
      // Update stats with actual account count
      setStats({
        ...adminStats,
        totalAccounts: accs.length,
      });
      console.log('[AdminDashboard] Data loaded successfully. Accounts:', accs.length);
      setLoading(false);
    } catch (error) {
      console.error('[AdminDashboard] Failed to load data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleDeleteMessage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      localStorage.setItem('contactMessages', JSON.stringify(updated));
      toast.success('Message deleted');
    }
  };

  const handleDeleteRating = (id: number) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      const updated = ratings.filter((r) => r.id !== id);
      setRatings(updated);
      localStorage.setItem('ratings', JSON.stringify(updated));
      toast.success('Rating deleted');
    }
  };

  const handleDeleteAccount = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete the account for ${userName}? This action cannot be undone.`)) {
      try {
        console.log(`[AdminDashboard] Deleting account: ${userId}`);
        // Try to delete from backend first
        const response = await adminService.deleteFarmerAccountFromBackend(userId);
        console.log(`[AdminDashboard] Delete response:`, response);
        toast.success('Account deleted successfully');
        
        // Reload data to refresh the list
        await loadData();
      } catch (error) {
        console.error(`[AdminDashboard] Delete failed:`, error);
        // Fallback to localStorage deletion
        console.log('Backend deletion failed, using localStorage fallback');
        adminService.deleteFarmerAccount(userId);
        toast.success('Account deleted (local)');
        
        // Update UI
        const updated = accounts.filter((a) => a.id !== userId);
        setAccounts(updated);
      }
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
      toast.success('Data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border/60 bg-surface/60 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4 py-4">
          <h1 className="font-display text-xl font-bold text-ink">Fieldly Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RotateCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={Mail}
              label="Total Messages"
              value={stats.totalMessages}
              subtext={`${stats.unreadMessages} unread`}
              color="primary"
            />
            <StatCard
              icon={MessageSquare}
              label="Contact Inquiries"
              value={stats.unreadMessages}
              subtext="New messages"
              color="accent"
            />
            <StatCard
              icon={Star}
              label="Average Rating"
              value={stats.averageRating.toFixed(1)}
              subtext={`from ${stats.totalRatings} ratings`}
              color="warning"
            />
            <StatCard
              icon={Star}
              label="Total Ratings"
              value={stats.totalRatings}
              subtext="User feedback"
              color="info"
            />
            <StatCard
              icon={Users}
              label="Farmer Accounts"
              value={stats.totalAccounts}
              subtext="Active accounts"
              color="secondary"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-white'
                : 'bg-surface text-muted-foreground hover:text-ink'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'messages'
                ? 'bg-primary text-white'
                : 'bg-surface text-muted-foreground hover:text-ink'
            }`}
          >
            Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'ratings'
                ? 'bg-primary text-white'
                : 'bg-surface text-muted-foreground hover:text-ink'
            }`}
          >
            Ratings ({ratings.length})
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'accounts'
                ? 'bg-primary text-white'
                : 'bg-surface text-muted-foreground hover:text-ink'
            }`}
          >
            Accounts ({accounts.length})
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">Contact Messages</h2>
            {messages.length === 0 ? (
              <div className="rounded-lg border border-border/60 bg-surface p-8 text-center">
                <Mail className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No contact messages yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-lg border border-border/60 bg-surface p-4 hover:shadow-card transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${msg.email}`}
                            className="font-semibold text-ink hover:text-primary truncate"
                          >
                            {msg.email}
                          </a>
                          {msg.status === 'unread' && (
                            <span className="whitespace-nowrap rounded-full bg-primary/20 px-2 py-1 text-xs font-semibold text-primary">
                              Unread
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{msg.message}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">User Ratings</h2>
            {ratings.length === 0 ? (
              <div className="rounded-lg border border-border/60 bg-surface p-8 text-center">
                <Star className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No ratings yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="rounded-lg border border-border/60 bg-surface p-4 hover:shadow-card transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`size-4 ${
                                  i < rating.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-ink">{rating.rating}/5</span>
                        </div>
                        {rating.comment && (
                          <p className="mt-2 text-sm text-muted-foreground">{rating.comment}</p>
                        )}
                        {rating.userEmail && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            From: <a href={`mailto:${rating.userEmail}`} className="hover:text-primary">
                              {rating.userEmail}
                            </a>
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(rating.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRating(rating.id)}
                        className="text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">Farmer Accounts</h2>
            {accounts.length === 0 ? (
              <div className="rounded-lg border border-border/60 bg-surface p-8 text-center">
                <Users className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No farmer accounts yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-lg border border-border/60 bg-surface p-4 hover:shadow-card transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-ink">{account.name}</p>
                          {account.farmName && (
                            <p className="text-sm text-primary font-medium">{account.farmName}</p>
                          )}
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                          {account.email && (
                            <p>
                              Email: <a href={`mailto:${account.email}`} className="text-ink hover:text-primary">{account.email}</a>
                            </p>
                          )}
                          {account.phone && (
                            <p>Phone: {account.phone}</p>
                          )}
                          <p>Role: <span className="font-medium text-ink">{account.role}</span></p>
                          <p>ID: <span className="font-mono text-ink">{account.id}</span></p>
                          {account.createdAt && (
                            <p>Created: {new Date(account.createdAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id, account.name)}
                        className="text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-display text-lg font-bold text-ink">Recent Messages</h2>
              {messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  className="mb-3 rounded-lg border border-border/60 bg-surface p-4 last:mb-0"
                >
                  <p className="font-semibold text-ink">{msg.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-muted-foreground">No messages yet</p>
              )}
            </div>

            <div>
              <h2 className="mb-4 font-display text-lg font-bold text-ink">Recent Ratings</h2>
              {ratings.slice(0, 3).map((rating) => (
                <div
                  key={rating.id}
                  className="mb-3 rounded-lg border border-border/60 bg-surface p-4 last:mb-0"
                >
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < rating.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  {rating.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{rating.comment}</p>
                  )}
                </div>
              ))}
              {ratings.length === 0 && (
                <p className="text-muted-foreground">No ratings yet</p>
              )}
            </div>

            <div>
              <h2 className="mb-4 font-display text-lg font-bold text-ink">Recent Accounts</h2>
              {accounts.slice(0, 3).map((account) => (
                <div
                  key={account.id}
                  className="mb-3 rounded-lg border border-border/60 bg-surface p-4 last:mb-0"
                >
                  <p className="font-semibold text-ink">{account.name}</p>
                  {account.farmName && (
                    <p className="text-sm text-primary">{account.farmName}</p>
                  )}
                  {account.email && (
                    <p className="text-xs text-muted-foreground mt-1">{account.email}</p>
                  )}
                </div>
              ))}
              {accounts.length === 0 && (
                <p className="text-muted-foreground">No accounts yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtext?: string;
  color: 'primary' | 'accent' | 'warning' | 'info' | 'secondary';
}) {
  const colorMap: Record<string, string> = {
    primary: 'from-primary/15 to-accent/15',
    accent: 'from-accent/15 to-info/15',
    warning: 'from-warning/15 to-primary/15',
    info: 'from-info/15 to-secondary/15',
    secondary: 'from-secondary/15 to-primary/15',
  };

  return (
    <div className={`rounded-2xl border border-border/60 bg-gradient-to-br ${colorMap[color]} p-6 shadow-soft`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
          {subtext && <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>}
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-white/50">
          <Icon className="size-5 text-ink/60" />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
