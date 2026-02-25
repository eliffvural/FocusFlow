import QueryProvider from "@/components/providers/query-provider";
import SupabaseProvider from "@/components/providers/supabase-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FocusFlow | Next-Level Planner",
    description: "Next-Level Personal & Business Planner for high productivity.",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={cn(inter.className, "antialiased min-h-screen")}>
                <SupabaseProvider>
                    <QueryProvider>
                        {children}
                    </QueryProvider>
                </SupabaseProvider>
            </body>
        </html>
    );
}
