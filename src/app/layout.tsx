import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jobflow.ai"),
  title: "JobFlow AI",
  description: "Optimize your career with JobFlow AI. Create ATS-friendly resumes, automate your job search, and get personalized career outreach — all powered by advanced AI.",
  openGraph: {
    title: "JobFlow AI",
    description: "Optimize your career with JobFlow AI. Create ATS-friendly resumes, automate your job search, and get personalized career outreach — all powered by advanced AI.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="author" content="Shahroz" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
