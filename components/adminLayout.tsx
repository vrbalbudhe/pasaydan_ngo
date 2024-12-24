export const metadata = {
  title: "Admin Panel - Pasaydan",
  description: "Admin Management Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-white">
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
