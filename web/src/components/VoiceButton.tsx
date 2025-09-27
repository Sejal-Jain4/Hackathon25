import React, { useState } from 'react'
import axios from 'axios'

export default function VoiceButton({ onResponse }: { onResponse: (text: string) => void }) {
  const [listening, setListening] = useState(false)

  async function startListen() {
    // Simple Web Speech API fallback (browser must support it)
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognition) {
      alert('SpeechRecognition not available in this browser. Use Chrome or Edge, or configure Azure Speech keys.')
      return
    }

    const r = new SpeechRecognition()
    r.lang = 'en-US'
    r.interimResults = false
    r.maxAlternatives = 1

    r.onstart = () => setListening(true)
    r.onend = () => setListening(false)

    r.onresult = async (ev: any) => {
      const text = ev.results[0][0].transcript
      try {
        const resp = await axios.post('/api/ai/respond', { text })
        const message = resp.data.reply
        // speak the reply
        if ('speechSynthesis' in window) {
          const ut = new SpeechSynthesisUtterance(message)
          window.speechSynthesis.speak(ut)
        }
        onResponse(message)
      } catch (e) {
        console.error(e)
        onResponse('Sorry, something went wrong.')
      }
    }

    r.onerror = (err: any) => {
      console.error(err)
      setListening(false)
    }

    r.start()
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => startListen()}
        className={`px-4 py-2 rounded-full text-white ${listening ? 'bg-red-500' : 'bg-indigo-600'}`}
      >
        {listening ? 'Listening...' : 'Push to talk'}
      </button>
    </div>
  )
}
