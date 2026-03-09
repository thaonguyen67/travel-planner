const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function buildPrompt({ destinationName, travelers, durationDays, pacing, interests, budget }) {
  return `You are a Vietnam travel expert. Create a detailed ${durationDays}-day itinerary for ${destinationName}.

Constraints:
- Number of travelers: ${travelers}
- Trip pacing: ${pacing} (Chill = relaxed, Balanced = moderate, Packed = busy)
- Budget level: ${budget}
- Interests: ${interests.join(', ')}

Return ONLY valid JSON in this exact structure (no markdown, no code blocks, no extra text):
{
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "block": "Morning",
          "time": "08:00",
          "title": "Activity name",
          "text": "Brief description (1-2 sentences)",
          "tag1": "Category or duration",
          "tag2": "Secondary tag"
        }
      ]
    }
  ]
}

Include 2-4 activities per day. Use blocks: Morning, Afternoon, Evening, Night. Times in 24h format (e.g. 08:00, 14:30).
Make it practical and specific to ${destinationName}.`
}

function extractJson(text) {
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      return null
    }
  }
  return null
}

export async function generateItinerary(params) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to .env.local')
  }

  const prompt = buildPrompt(params)
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('No response from Gemini')
  }

  const parsed = extractJson(text)
  if (!parsed?.days?.length) {
    throw new Error('Could not parse itinerary from response')
  }

  return parsed.days
}
