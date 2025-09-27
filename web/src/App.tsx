import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VoiceButton from './components/VoiceButton'

type Goal = { id: number; name: string; target: number; current: number }

export default function App() {
  const [balance, setBalance] = useState<number | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    fetchBalance()
    fetchGoals()
  }, [])

  async function fetchBalance() {
    try {
      const r = await axios.get('/api/balance')
      setBalance(r.data.balance)
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchGoals() {
    try {
      const r = await axios.get('/api/goals')
      setGoals(r.data.goals)
    } catch (e) {
      console.error(e)
    }
  }

  async function onSimulate(amount: number, label: string) {
    try {
      const r = await axios.post('/api/simulate_purchase', { amount, description: label })
      setMessage(r.data.message)
      setBalance(r.data.newBalance)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Centsi — AI Finance Coach (Demo)</h1>
        <p className="text-sm text-gray-600">Voice-first, gamified finance coach for students</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 bg-sky-50 p-4 rounded">
            <h2 className="text-lg font-semibold">Balance</h2>
            <p className="text-3xl font-bold">${balance ?? '—'}</p>
            <button
              className="mt-3 rounded bg-green-500 text-white px-3 py-1"
              onClick={() => fetchBalance()}
            >
              Refresh
            </button>
          </div>

          <div className="col-span-2 bg-amber-50 p-4 rounded">
            <h2 className="text-lg font-semibold">Talk to Centsi</h2>
            <p className="text-sm text-gray-700">Push-to-talk and ask affordability, goals, or get advice.</p>
            <VoiceButton onResponse={(text) => setMessage(text)} />
            <p className="mt-3 text-gray-800">AI reply: {message}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Goals</h2>
          <div className="mt-2 space-y-3">
            {goals.map((g) => (
              <div key={g.id} className="p-3 bg-white border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-sm text-gray-500">${g.current} / ${g.target}</div>
                </div>
                <div className="w-48">
                  <div className="h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-green-400 rounded" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Quick simulate</h2>
          <div className="mt-2 flex gap-2">
            <input id="amount" placeholder="Amount" className="border p-2 rounded" />
            <input id="label" placeholder="Label" className="border p-2 rounded" />
            <button
              className="rounded bg-blue-600 text-white px-3 py-1"
              onClick={() => {
                const amt = Number((document.getElementById('amount') as HTMLInputElement).value)
                const label = (document.getElementById('label') as HTMLInputElement).value
                onSimulate(amt, label)
              }}
            >
              Simulate
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
