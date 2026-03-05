'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, ListTodo, Zap } from 'lucide-react'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resources', label: 'Resources', icon: Users },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/allocations', label: 'Allocations', icon: Zap },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-6) var(--space-3)',
      borderRight: '1px solid var(--border-default)',
      background: 'var(--bg-secondary)',
    }}>
      <div style={{
        padding: '0 var(--space-3)',
        marginBottom: 'var(--space-10)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}>
        <div style={{
          width: 22,
          height: 22,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>Z</span>
        </div>
        <span style={{
          fontSize: 'var(--text-md)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}>
          Zenith
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {links.map(link => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: '7px 10px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-tertiary)' : 'transparent',
              transition: 'background 120ms ease, color 120ms ease',
            }}>
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              {link.label}
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto', padding: '0 var(--space-3)' }}>
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          Zenith v1.0
        </div>
      </div>
    </nav>
  )
}