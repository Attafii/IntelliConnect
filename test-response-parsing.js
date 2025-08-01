// Test script to verify response parsing logic for Generative Engine API
const axios = require('axios');

const GENERATIVE_API_CONFIG = {
  BASE_URL: 'https://api.generative.engine.capgemini.com',
  API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
  MODELS: {
    CLAUDE_SONNET: 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
    NOVA_LITE: 'amazon.nova-lite-v1:0',
    OPENAI_GPT4: 'openai.gpt-4'
  }
};

async function testResponseParsing() {
  try {
    console.log('🧪 Testing Generative Engine API response parsing...');
    
    const payload = {
      action: "run",
      modelInterface: "langchain",
      data: {
        mode: "chain",
        text: "Test message: Please respond with 'Hello, this is a test response from Claude Sonnet model.'",
        files: [],
        modelName: GENERATIVE_API_CONFIG.MODELS.CLAUDE_SONNET,
        provider: "bedrock",
        sessionId: "123e4567-e89b-12d3-a456-426614174003",
        modelKwargs: {
          maxTokens: 100,
          temperature: 0.3,
          streaming: false,
          topP: 0.9
        }
      }
    };

    console.log('📤 Sending test request...');
    
    const response = await axios.post(
      `${GENERATIVE_API_CONFIG.BASE_URL}/v2/llm/invoke`,
      payload,
      {
        headers: {
          'x-api-key': GENERATIVE_API_CONFIG.API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('📥 Response received:');
    console.log('Status:', response.status);
    console.log('Data structure:', JSON.stringify(response.data, null, 2));
    
    // Test the parsing logic (matching aiService.ts)
    const data = response.data;
    let parsedContent = null;
    
    if (data && data.content) {
      parsedContent = data.content;
      console.log('✅ Parsed using data.content');
    } else if (data && data.data && data.data.content) {
      parsedContent = data.data.content;
      console.log('✅ Parsed using data.data.content');
    } else if (typeof data === 'string') {
      parsedContent = data;
      console.log('✅ Parsed as direct string');
    } else {
      console.log('❌ Unable to parse response');
      console.log('Available keys:', Object.keys(data || {}));
    }
    
    console.log('🎯 Final parsed content:', parsedContent);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testResponseParsing();
