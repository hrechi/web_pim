import { Bell } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Bell className="size-5" />}
        title="Notifications"
        description="Real-time alerts from your farm."
      />
      <EmptyState
        icon={<Bell className="size-6" />}
        title="Push notifications go to your devices"
        description="Fieldly sends alerts via mobile push (FCM). A web inbox view is coming soon."
      />
    </div>
  );
}
