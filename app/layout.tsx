import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'NeuroGaze Lab', description: 'On-device BCI and gaze control laboratory' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
