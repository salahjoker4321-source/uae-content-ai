export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { business, platform, language, type, topic } = req.body || {};
    if (!business || !platform || !language || !type) return res.status(400).json({ error: 'Missing fields' });
    const prompt = `You are UAE Content AI, a social-media content specialist for UAE creators and small businesses.\nCreate one high-quality ${type} for a ${business} on ${platform}. Language: ${language}. Optional topic/offer: ${topic || 'none'}.\nRequirements: natural, engaging, practical, culturally appropriate for UAE audiences. Do not claim fake discounts, reviews, locations, prices, or facts. If Arabic, write natural modern Arabic. If a script, include a strong first-2-second hook, concise spoken lines, visual directions, and CTA. If hashtags, include relevant UAE hashtags. Return only the finished content, with clear headings.`;
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5.6-luna', input: prompt, max_output_tokens: 900 })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error?.message || 'OpenAI request failed' });
    const text = (data.output || []).flatMap(x => x.content || []).filter(x => x.type === 'output_text').map(x => x.text).join('\n').trim();
    return res.status(200).json({ text: text || 'No content generated.' });
  } catch (e) { return res.status(500).json({ error: e.message || 'Server error' }); }
}
