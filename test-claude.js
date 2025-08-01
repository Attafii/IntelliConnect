// Quick test for Claude model
const testClaude = async () => {
  const API_CONFIG = {
    API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
    BASE_URL: "https://api.generative.engine.capgemini.com/v1"
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        'x-api-key': API_CONFIG.API_KEY
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet',
        messages: [{ role: 'user', content: 'Analyze this data: Revenue: $100k' }],
        max_tokens: 100
      })
    });

    console.log('Claude test status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Claude works!');
      console.log('Response:', data.choices?.[0]?.message?.content || data);
    } else {
      const error = await response.text();
      console.log('❌ Claude error:', error);
    }
  } catch (error) {
    console.log('Network error:', error.message);
  }
};

testClaude();
