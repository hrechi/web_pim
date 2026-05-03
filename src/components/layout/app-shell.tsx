import { Outlet } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useUiStore } from '@/stores/ui-store';

export function AppShell() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

  return (
    <div className="flex min-h-dvh bg-bg">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-h-dvh flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
