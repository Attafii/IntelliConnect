// Test script for the enhanced DocumentAnalyzer API
const testEnhancedAPI = async () => {
  try {
    console.log('🧪 Testing Enhanced Document Analyzer API...');
    
    // Test sample CSV data
    const testCSVData = `Name,Age,Salary,Department
John Doe,30,50000,Engineering
Jane Smith,25,45000,Marketing
Bob Johnson,35,60000,Engineering
Alice Brown,28,52000,Sales`;

    const testRequest = {
      extractedText: testCSVData,
      message: 'What are the key insights from this employee data?',
      question: 'What are the key insights from this employee data?',
      fileName: 'test-employees.csv',
      fileType: 'text/csv',
      analysisType: 'comprehensive'
    };

    console.log('📤 Sending request to /api/analysis/document-ai');
    console.log('Request data:', testRequest);

    const response = await fetch('http://localhost:3000/api/analysis/document-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest)
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ API Error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    
    // Validate response structure
    if (data.reply) {
      console.log('✅ Analysis reply received:', data.reply.substring(0, 200) + '...');
    }
    
    if (data.suggestions && Array.isArray(data.suggestions)) {
      console.log('✅ Suggestions received:', data.suggestions.length, 'items');
    }
    
    if (data.metadata) {
      console.log('✅ Metadata received:', data.metadata);
    }
    
    console.log('🎉 Enhanced API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testEnhancedAPI();
