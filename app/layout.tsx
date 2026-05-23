import type { Metadata } from 'next';
import './globals.css';
import Providers from '../components/Providers';
export const metadata: Metadata = {
  title: 'Kenya Civic Voice',
  description: 'A platform for Kenyan citizens to voice their thoughts about government',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
