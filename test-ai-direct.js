// Direct test of AI service with sample document content
const testAIConnection = async () => {
  console.log('🧪 Testing AI Service Connection...');
  
  const API_CONFIG = {
    API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
    BASE_URL: "https://api.generative.engine.capgemini.com/v1"
  };

  const sampleCSVContent = `Date,Product,Revenue,Units_Sold
2025-01-15,Laptop Pro,125000,250
2025-02-15,Tablet Ultra,88000,440
2025-03-15,Smartphone X,225000,1125`;

  try {
    console.log('📡 Making request to AI service...');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        'x-api-key': API_CONFIG.API_KEY
      },      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI document analyst. Analyze documents and provide specific insights.'
          },
          {
            role: 'user',
            content: `Analyze this CSV data and provide specific insights:

${sampleCSVContent}

What trends do you see in the revenue data?`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Service is working!');
      console.log('🤖 AI Response:', data.choices[0]?.message?.content || 'No content');
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ AI Service Error:');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
      
      // Try to parse as JSON to get more details
      try {
        const errorData = JSON.parse(errorText);
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Raw error text:', errorText);
      }
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return false;
  }
};

// Run the test
testAIConnection();
