import './globals.css'
import Sidebar from './components/Sidebar'

export const metadata = {
  title: 'Zenith — Resource Allocator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{
          marginLeft: 'var(--sidebar-width)',
          padding: 'var(--space-10) var(--space-12)',
          width: '100%',
          maxWidth: '1120px',
        }}>
          {children}
        </main>
      </body>
    </html>
  )
}