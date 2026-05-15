import type { Metadata } from "next";
import "../styles.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "EventBuilder Pro — Vertical Timeline",
  description: "Compose, categorize, and visualize organizational events on a relational timeline.",
  authors: [{ name: "EventBuilder Pro" }],
  openGraph: {
    title: "EventBuilder Pro",
    description: "Compose, categorize, and visualize organizational events.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@Lovable",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
