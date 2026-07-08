import "./globals.css";
import DashboardWrapper from "./components/DashboardWrapper";

export const metadata = {
  title: "CRM | Ensemble Scolaire Jean XXIII",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <DashboardWrapper>{children}</DashboardWrapper>
      </body>
    </html>
  );
}
