export default async function handler(req, res) {
  const chaosSeed = Date.now() % 1000;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a digital prophet of entropy.'
          },
          {
            role: 'user',
            content: `Based on chaos seed ${chaosSeed}, whisper a short cryptic command in 1-2 sentences.`
          }
        ],
        temperature: 0.95,
        max_tokens: 50
      })
    });

    const data = await response.json();

    // ✅ Catch bad responses from OpenAI
    if (!response.ok) {
      console.error('OpenAI error:', data);
      return res.status(500).json({ error: data });
    }

    res.status(200).json({ whisper: data.choices[0].message.content });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server failed.' });
  }
}
