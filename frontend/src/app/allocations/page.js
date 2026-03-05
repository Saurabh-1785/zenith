'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Play } from 'lucide-react'

const API = 'http://localhost:5000'

export default function Allocations() {
  const [allocations, setAllocations] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [metrics, setMetrics] = useState(null)

  const fetchData = () => {
    fetch(`${API}/allocations`).then(r => r.json()).then(setAllocations).catch(err => console.error('Failed to fetch allocations:', err))
    fetch(`${API}/resources`).then(r => r.json()).then(setResources).catch(err => console.error('Failed to fetch resources:', err))
  }

  useEffect(() => { fetchData() }, [])

  const runAllocation = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API}/allocate`, { method: 'POST' })
      const data = await res.json()

      if (data.error) {
        setMessage(`Error: ${data.error}`)
      } else {
        setMessage(`${data.allocations.length} tasks allocated, ${data.unallocated.length} unallocated`)
        setMetrics(data.metrics)
        fetchData()
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
    setLoading(false)
  }

  const chartData = resources.map(r => ({
    name: r.name,
    used: r.total_capacity - r.available_capacity,
    available: r.available_capacity
  }))

  const isError = message.startsWith('Error')

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 'var(--space-1)' }}>
          Allocations
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
          Run the engine and inspect allocation results
        </p>
      </div>

      {/* Action bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-6)',
        marginBottom: 'var(--space-6)',
      }}>
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>
            Allocation engine
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Assigns pending tasks to the best available resources
          </p>
        </div>
        <button onClick={runAllocation} disabled={loading} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          background: loading ? 'var(--bg-tertiary)' : 'var(--text-primary)',
          color: loading ? 'var(--text-tertiary)' : 'var(--text-inverse)',
          border: 'none',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-sans)',
          transition: 'background 120ms ease',
        }}>
          <Play size={13} />
          {loading ? 'Running...' : 'Run allocator'}
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-6)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          background: isError ? 'var(--status-error-bg)' : 'var(--status-success-bg)',
          color: isError ? 'var(--status-error)' : 'var(--status-success)',
          border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
        }}>
          {message}
        </div>
      )}

      {/* Metrics */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--border-default)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 'var(--space-6)',
        }}>
          {[
            { label: 'Total capacity', value: metrics.total_capacity + ' hrs' },
            { label: 'Used capacity', value: metrics.used_capacity + ' hrs' },
            { label: 'Utilization', value: metrics.utilization_percentage },
          ].map(m => (
            <div key={m.label} style={{
              background: 'var(--bg-secondary)',
              padding: 'var(--space-5) var(--space-6)',
            }}>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 500,
                marginBottom: 'var(--space-1)',
              }}>{m.label}</p>
              <p style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>

        {/* Chart */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
        }}>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Resource capacity
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a3a3a3" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              />
              <Bar dataKey="used" name="Used" stackId="a" fill="#4f46e5" radius={[0, 0, 2, 2]} />
              <Bar dataKey="available" name="Available" stackId="a" fill="#e5e5e5" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation list */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>
              All allocations
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              {allocations.length} total
            </span>
          </div>

          {allocations.length === 0 ? (
            <p style={{ padding: 'var(--space-8) var(--space-6)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              No allocations yet — run the engine
            </p>
          ) : (
            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {allocations.map((a, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3) var(--space-6)',
                  borderBottom: i < allocations.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{a.task_name}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '1px' }}>
                      Priority {a.priority} · {new Date(a.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                  }}>{a.resource_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}