/**
 * Multi-Engine AI Provider Setup
 * Primary: Gemini 1.5 Flash / Groq
 * Fallback: OpenRouter / Ollama Local
 */

export async function generateDecisionBrief(prompt, userConstraints) {
  const systemPrompt = `You are Search.ai Decision Engine. Evaluate user query against 8 signals (Cost, Privacy, Latency, Stack Fit, Ecosystem, Support, Scalability, Complexity). Return structured JSON only.`;

  // 1. Try Primary Engine (Gemini / Groq)
  try {
    if (process.env.GEMINI_API_KEY) {
      return await callGeminiFlash(prompt, systemPrompt);
    } else if (process.env.GROQ_API_KEY) {
      return await callGroq(prompt, systemPrompt);
    }
  } catch (primaryErr) {
    console.warn('Primary AI Engine failed, switching to OpenRouter fallback...', primaryErr);
  }

  // 2. Try Fallback Engine (OpenRouter)
  try {
    if (process.env.OPENROUTER_API_KEY) {
      return await callOpenRouter(prompt, systemPrompt);
    }
  } catch (fallbackErr) {
    console.warn('OpenRouter fallback failed, switching to local Ollama...', fallbackErr);
  }

  // 3. Try Local Ollama (Local Dev mode)
  return await callOllamaLocal(prompt, systemPrompt);
}

async function callGeminiFlash(prompt, systemPrompt) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Query: ${prompt}` }] }]
    })
  });
  return await res.json();
}

async function callGroq(prompt, systemPrompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }]
    })
  });
  return await res.json();
}

async function callOpenRouter(prompt, systemPrompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }]
    })
  });
  return await res.json();
}

async function callOllamaLocal(prompt, systemPrompt) {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: `${systemPrompt}\n\nQuery: ${prompt}`,
      stream: false
    })
  });
  return await res.json();
}
