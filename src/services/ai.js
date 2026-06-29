import { API_KEY, MODEL } from '../config/api.js'

export async function callAI(systemPrompt, userMessage) {
  if (API_KEY === '[PUT_API_KEY_HERE]' || MODEL === '[PUT_MODEL_NAME_HERE]') {
    throw new Error('لطفاً API_KEY و MODEL را در فایل .env یا src/config/api.js تنظیم کنید.')
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`خطای API: ${response.status} — ${errorBody}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}
