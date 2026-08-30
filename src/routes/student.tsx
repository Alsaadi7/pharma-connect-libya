import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { DrugSheetProvider } from "@/components/DrugCard";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <DrugSheetProvider>
      <div className="mx-auto min-h-screen w-full max-w-[430px] pb-24">
        <Outlet />
        <BottomNav />
      </div>
    </DrugSheetProvider>
  );
}
