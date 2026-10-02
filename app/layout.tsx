import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "wanna be penpals? | the little post office",
  description: "A handwritten hello, from my little corner of the internet to your mailbox.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  robots: {index:false,follow:false},
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
