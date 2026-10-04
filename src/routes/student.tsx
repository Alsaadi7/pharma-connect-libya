import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav, SideNav } from "@/components/BottomNav";
import { DrugSheetProvider } from "@/components/DrugCard";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <DrugSheetProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] md:max-w-6xl md:gap-6 md:px-6">
        <SideNav />
        <div className="min-w-0 flex-1 overflow-x-hidden pb-24 md:pb-10">
          <div className="mx-auto w-full md:max-w-3xl">
            <Outlet />
          </div>
        </div>
        <BottomNav />
      </div>
    </DrugSheetProvider>
  );
}
