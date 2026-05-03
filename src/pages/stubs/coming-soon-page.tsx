import { Construction } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Construction className="size-5" />}
        title={title}
        description={description ?? 'This module is on the roadmap and will land soon.'}
      />
      <EmptyState
        icon={<Construction className="size-6" />}
        title="Coming soon"
        description="We're polishing the web experience for this module. In the meantime, the mobile app has the full feature set."
      />
    </div>
  );
}
