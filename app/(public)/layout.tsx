import HeaderPublic from "@/components/header-public";
import { FooterPublic } from "@/components/footer-public";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center">
            <HeaderPublic /><div className="border-b w-full mb-4"></div>
            <div className="px-4 w-full flex justify-center min-h-screen">
                {children}
            </div>
            <div className="border-b w-full mt-4"></div>
            <FooterPublic />
        </div>
    )
}