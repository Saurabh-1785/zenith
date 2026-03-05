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

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ name: '', required_skills: '', estimated_effort: '', minimum_capacity_needed: '', priority: '', deadline: '' })
  const [message, setMessage] = useState('')

  const fetchTasks = () => {
    fetch(`${API}/tasks`)
      .then(r => r.json())
      .then(setTasks)
      .catch(err => console.error('Failed to fetch tasks:', err))
  }

  useEffect(() => { fetchTasks() }, [])

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          required_skills: form.required_skills.split(',').map(s => s.trim()),
          estimated_effort: parseInt(form.estimated_effort),
          minimum_capacity_needed: parseInt(form.minimum_capacity_needed),
          priority: parseInt(form.priority),
          deadline: form.deadline
        })
      })
      const data = await res.json()
      if (data.id) {
        setMessage('Task created')
        setForm({ name: '', required_skills: '', estimated_effort: '', minimum_capacity_needed: '', priority: '', deadline: '' })
        fetchTasks()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(data.error || 'Failed to create task')
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
  }

  const priorityLabel = (p) => {
    if (p >= 5) return 'Critical'
    if (p >= 3) return 'High'
    return 'Medium'
  }

  const priorityStyle = (p) => {
    if (p >= 5) return { color: 'var(--status-error)', background: 'var(--status-error-bg)' }
    if (p >= 3) return { color: 'var(--status-warning)', background: 'var(--status-warning-bg)' }
    return { color: 'var(--status-success)', background: 'var(--status-success-bg)' }
  }

  const statusStyle = (s) => {
    if (s === 'ALLOCATED') return { color: 'var(--status-success)', background: 'var(--status-success-bg)' }
    return { color: 'var(--status-warning)', background: 'var(--status-warning-bg)' }
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 'var(--space-1)' }}>
          Tasks
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
          Create and manage tasks for allocation
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
            Add task
          </h2>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Task name</label>
            <input style={inputStyle} placeholder="e.g. Build Login API" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Required skills</label>
            <input style={inputStyle} placeholder="e.g. javascript, nodejs" value={form.required_skills}
              onChange={e => setForm({ ...form, required_skills: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div>
              <label style={labelStyle}>Effort (hrs)</label>
              <input style={inputStyle} placeholder="10" type="number" value={form.estimated_effort}
                onChange={e => setForm({ ...form, estimated_effort: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Min. capacity</label>
              <input style={inputStyle} placeholder="10" type="number" value={form.minimum_capacity_needed}
                onChange={e => setForm({ ...form, minimum_capacity_needed: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <div>
              <label style={labelStyle}>Priority (1–5)</label>
              <input style={inputStyle} placeholder="5" type="number" value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Deadline</label>
              <input style={inputStyle} type="date" value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
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
            Add task
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
              All tasks
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              {tasks.length} total
            </span>
          </div>

          {tasks.length === 0 ? (
            <p style={{ padding: 'var(--space-8) var(--space-6)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              No tasks created yet
            </p>
          ) : (
            <div>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.5fr 80px 80px 90px 80px',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-6)',
                borderBottom: '1px solid var(--border-default)',
                background: 'var(--bg-primary)',
              }}>
                {['Name', 'Skills', 'Effort', 'Priority', 'Deadline', 'Status'].map(h => (
                  <span key={h} style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>{h}</span>
                ))}
              </div>
              {/* Table rows */}
              {tasks.map((t, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1.5fr 80px 80px 90px 80px',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-6)',
                  borderBottom: i < tasks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {t.name}
                  </span>
                  <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                    {safeParseArray(t.required_skills).map((skill, j) => (
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
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                    {t.estimated_effort} hrs
                  </span>
                  <span style={{
                    display: 'inline-block',
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    width: 'fit-content',
                    ...priorityStyle(t.priority),
                  }}>
                    {priorityLabel(t.priority)}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(t.deadline).toLocaleDateString()}
                  </span>
                  <span style={{
                    display: 'inline-block',
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    width: 'fit-content',
                    ...statusStyle(t.status),
                  }}>
                    {t.status}
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