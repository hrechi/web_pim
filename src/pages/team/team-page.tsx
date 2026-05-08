import { useState } from 'react';
import { Trash2, Users, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useStaffQuery, useDeleteStaffMutation } from '@/hooks/queries/use-staff';
import { API_ORIGIN } from '@/lib/env';

export function TeamPage() {
  const staff = useStaffQuery();
  const deleteStaffMutation = useDeleteStaffMutation();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const staffList = Array.isArray(staff.data) ? staff.data : [];

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    
    setIsDeleting(id);
    try {
      await deleteStaffMutation.mutateAsync(id);
    } finally {
      setIsDeleting(null);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ORIGIN}${imagePath}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently added';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Recently added';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Users className="size-5" />}
        title="Team Members"
        description="Manage your farm staff and team members"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Staff Whitelist</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{staffList.length} staff members</p>
          </div>
        </CardHeader>
        <CardContent>
          {staff.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          ) : staffList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-bg/40 p-12 text-center">
              <Users className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-ink mb-2">No staff members added yet</p>
              <p className="text-xs text-muted-foreground">
                Add authorized staff members from the mobile app
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staffList.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col rounded-xl border border-border/60 bg-surface overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Staff Photo */}
                  <div className="relative w-full h-48 bg-muted overflow-hidden">
                    {s.imagePath ? (
                      <img
                        src={getImageUrl(s.imagePath)}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Ccircle cx="12" cy="8" r="4"/%3E%3Cpath d="M12 14c-6 0-8 3-8 3v3h16v-3s-2-3-8-3z"/%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="size-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Staff Details */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-ink text-lg mb-1">{s.name}</h3>
                    
                    {/* Date Added */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="size-3.5" />
                      <span>Added {formatDate(s.createdAt)}</span>
                    </div>

                    {/* Staff Info */}
                    <div className="space-y-2 flex-1 mb-4">
                      <div className="p-2 rounded bg-muted/40">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">Staff ID</p>
                        <p className="text-sm text-ink font-mono">{s.id.slice(0, 8)}...</p>
                      </div>
                      <div className="p-2 rounded bg-muted/40">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">Status</p>
                        <p className="text-sm text-ink">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-center"
                      onClick={() => handleDelete(s.id)}
                      disabled={isDeleting === s.id}
                    >
                      <Trash2 className="size-4 mr-2" />
                      {isDeleting === s.id ? 'Removing...' : 'Remove'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
