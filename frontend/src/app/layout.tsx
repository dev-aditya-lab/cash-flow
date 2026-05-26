import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/store/auth-context";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: { default: "CashFlow", template: "%s | CashFlow" },
	description:
		"Premium personal finance tracker — track income, expenses and grow your savings.",
	keywords: ["finance", "expense tracker", "budget", "savings"],
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} h-full`}
		>
			<head>
				<link
					rel="icon"
					type="image/png"
					href="/favicon-96x96.png"
					sizes="96x96"
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link rel="manifest" href="/manifest.json" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="CashFlow" />
			</head>
			<body className="min-h-full antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange={false}
				>
					<AuthProvider>
						<ServiceWorkerRegistration />
						{children}
						<Toaster
							position="top-right"
							toastOptions={{
								classNames: {
									toast: "bg-card border border-border text-foreground shadow-lg rounded-[var(--radius-lg)]",
									description:
										"text-muted-foreground text-xs",
									actionButton:
										"bg-primary text-primary-foreground",
									cancelButton:
										"bg-secondary text-secondary-foreground",
								},
							}}
						/>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
