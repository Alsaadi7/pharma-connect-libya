import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] pb-24">
      <Outlet />
      <BottomNav />
    </div>
  );
}
