'use client'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowRight } from 'lucide-react'

const API = 'http://localhost:5000'
const COLORS = ['var(--accent)', 'var(--border-default)']

export default function Dashboard() {
  const [resources, setResources] = useState([])
  const [tasks, setTasks] = useState([])
  const [allocations, setAllocations] = useState([])

  useEffect(() => {
    fetch(`${API}/resources`).then(r => r.json()).then(setResources).catch(err => console.error('Failed to fetch resources:', err))
    fetch(`${API}/tasks`).then(r => r.json()).then(setTasks).catch(err => console.error('Failed to fetch tasks:', err))
    fetch(`${API}/allocations`).then(r => r.json()).then(setAllocations).catch(err => console.error('Failed to fetch allocations:', err))
  }, [])

  const totalCapacity = resources.reduce((sum, r) => sum + r.total_capacity, 0)
  const usedCapacity = resources.reduce((sum, r) => sum + (r.total_capacity - r.available_capacity), 0)
  const utilizationPercent = totalCapacity ? ((usedCapacity / totalCapacity) * 100).toFixed(1) : 0

  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length
  const allocatedTasks = tasks.filter(t => t.status === 'ALLOCATED').length

  const chartData = [
    { name: 'Used', value: usedCapacity },
    { name: 'Available', value: totalCapacity - usedCapacity },
  ]

  const stats = [
    { label: 'Resources', value: resources.length },
    { label: 'Total tasks', value: tasks.length },
    { label: 'Pending', value: pendingTasks },
    { label: 'Allocated', value: allocatedTasks },
  ]

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 'var(--space-1)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
          System overview and allocation metrics
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        background: 'var(--border-default)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: 'var(--space-8)',
      }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
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
            }}>{stat.label}</p>
            <p style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Allocations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Utilization */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-6)',
          }}>Capacity utilization</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={88}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={index === 0 ? '#4f46e5' : '#e5e5e5'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
            <span style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>{utilizationPercent}%</span>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
              {usedCapacity} / {totalCapacity} hrs used
            </p>
          </div>
        </div>

        {/* Recent Allocations */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-6)',
          }}>Recent allocations</h2>
          {allocations.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>No allocations yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {allocations.slice(0, 6).map((a, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3) 0',
                  borderBottom: i < Math.min(allocations.length, 6) - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 450 }}>
                    {a.task_name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <ArrowRight size={12} color="var(--text-tertiary)" />
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-tertiary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500,
                    }}>
                      {a.resource_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}