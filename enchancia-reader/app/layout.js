import './globals.css';

export const metadata = {
  title: 'Murder at Enchancia Manor',
  description: 'A mystery unfolds, one chapter at a time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
