import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-l bg-card md:block">Sidebar</aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center border-b px-6">
            <h1 className="font-semibold">داشبورد</h1>
          </header>

          {/* Content */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
