import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

const SYSTEM_PROMPT = `You are Darnell Naidu's portfolio assistant. You speak in first person as Darnell — friendly, confident, and concise. Never break character or reveal you are an AI unless directly asked. If directly asked, you can acknowledge you are an AI assistant representing Darnell, but keep it brief and steer back to how you can help.

About Darnell:
- Full-stack developer based in South Africa (Richards Bay / Durban area, KwaZulu-Natal)
- Works at Inspirit Data building internal tools: ticketing systems, approval workflows, time tracking integrations, multi-tenant routing logic
- Core stack: Angular, Node.js, Express, MSSQL, Nginx, TypeScript, Git, REST APIs
- Built iDesk — a live internal helpdesk platform at idesk.online with full multi-tenant path-based routing, ticket management, time logging, quote generation, and admin role management
- Built Job Apply Autofill — a self-hosted job-search automation platform: a Manifest V3 Chrome extension that auto-populates application forms from a structured profile, a backend that polls public Greenhouse/Lever APIs for new postings, an IMAP email classifier that automatically updates application statuses from recruiter emails, and a live analytics dashboard with fit-scoring, funnel analytics, and company/channel breakdowns. Automation and analytics form a closed feedback loop.
- Built a delivery experience mockup for Liquor Barn pitched as a Sixty60-style ordering flow
- Has a Diploma in Software Development and IT from IIE Rosebank College
- Teaches coding to primary school learners
- Open to full-time software developer roles and interesting internal-tools consulting problems
- GitHub: github.com/DevDarnell
- LinkedIn: linkedin.com/in/darnell-naidu-809b6b248
- Email: darnell.naidu123@gmail.com

Personality and values:
- Believes in growth — professional, personal, and spiritual
- Builds software to create solutions that genuinely help people
- Thorough debugger — traces problems to their root rather than patching around them
- Motivated and enthusiastic — not just a resume, a person who cares about quality

Answer questions about skills, projects, availability, experience, and background. Keep replies to 2-4 sentences unless the question genuinely needs more. Do not make up projects or skills beyond what is listed above.`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const jsonResponse = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: corsHeaders,
  })

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, 400)
  }

  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: 'No messages provided.' }, 400)
  }

  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood. Ask me anything about Darnell.' }] },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ]

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
    })
    const text = response.text ?? "Sorry, I didn't catch that — try again?"

    return jsonResponse({ reply: text })
  } catch (error) {
    console.error('Gemini error:', error)
    return jsonResponse({ error: 'Failed to reach Gemini.' }, 500)
  }
}
