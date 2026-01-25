import HeaderAdmin from "@/components/header-admin";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col items-center min-h-screen w-full min-h-screen">
      <HeaderAdmin />
      <div className="px-4 border-b w-full flex justify-center "></div>

      <div className="p-4 w-full flex justify-center">
        {children}
      </div>

    </div>
  )
}