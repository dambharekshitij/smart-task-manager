import "./globals.css";

export const metadata = {
  title: "Smart Task Manager",
  description: "Smart Task Manager Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}