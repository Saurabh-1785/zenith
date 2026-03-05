'use client'
import { useEffect, useState } from 'react'

const API = 'http://localhost:5000'

function safeParseArray(value) {
  if (Array.isArray(value)) return value
  try { return JSON.parse(value) } catch { return [] }
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-default)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: 'var(--text-sm)',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 120ms ease',
}

const labelStyle = {
  display: 'block',
  fontSize: 'var(--text-xs)',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: 'var(--space-1)',
}

export default function Resources() {
  const [resources, setResources] = useState([])
  const [form, setForm] = useState({ name: '', skills: '', total_capacity: '' })
  const [message, setMessage] = useState('')

  const fetchResources = () => {
    fetch(`${API}/resources`)
      .then(r => r.json())
      .then(setResources)
      .catch(err => console.error('Failed to fetch resources:', err))
  }

  useEffect(() => { fetchResources() }, [])

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          skills: form.skills.split(',').map(s => s.trim()),
          total_capacity: parseInt(form.total_capacity)
        })
      })
      const data = await res.json()
      if (data.id) {
        setMessage('Resource created')
        setForm({ name: '', skills: '', total_capacity: '' })
        fetchResources()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(data.error || 'Failed to create resource')
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 'var(--space-1)' }}>
          Resources
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
          Manage engineers and their capacity
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>

        {/* Form */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
        }}>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
            Add resource
          </h2>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} placeholder="e.g. Alice" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Skills</label>
            <input style={inputStyle} placeholder="e.g. javascript, nodejs" value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })} />
          </div>

          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={labelStyle}>Capacity (hours)</label>
            <input style={inputStyle} placeholder="e.g. 40" type="number" value={form.total_capacity}
              onChange={e => setForm({ ...form, total_capacity: e.target.value })} />
          </div>

          <button onClick={handleSubmit} style={{
            width: '100%',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            border: 'none',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-sans)',
          }}>
            Add resource
          </button>

          {message && (
            <p style={{
              marginTop: 'var(--space-3)',
              fontSize: 'var(--text-xs)',
              color: message.includes('Error') || message.includes('Failed') ? 'var(--status-error)' : 'var(--status-success)',
              fontWeight: 500,
            }}>{message}</p>
          )}
        </div>

        {/* Table */}
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
              All resources
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              {resources.length} total
            </span>
          </div>

          {resources.length === 0 ? (
            <p style={{ padding: 'var(--space-8) var(--space-6)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              No resources added yet
            </p>
          ) : (
            <div>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 120px',
                gap: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-6)',
                borderBottom: '1px solid var(--border-default)',
                background: 'var(--bg-primary)',
              }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</span>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</span>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Capacity</span>
              </div>
              {/* Table rows */}
              {resources.map((r, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 120px',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-6)',
                  borderBottom: i < resources.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</span>
                  <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                    {safeParseArray(r.skills).map((skill, j) => (
                      <span key={j} style={{
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-default)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 450,
                      }}>{skill}</span>
                    ))}
                  </div>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {r.available_capacity}/{r.total_capacity} hrs
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}