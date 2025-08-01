// Test the new document analysis endpoint
const testDocumentAnalysis = async () => {
  console.log('🧪 Testing Document Analysis API...');
  
  const sampleCSVData = `Date,Product,Revenue,Units_Sold,Region
2025-01-15,Laptop Pro,125000,250,North America
2025-02-15,Tablet Ultra,88000,440,Europe
2025-03-15,Smartphone X,225000,1125,Asia Pacific`;

  try {
    const response = await fetch('http://localhost:3000/api/analysis/document-new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        extractedText: sampleCSVData,
        question: 'What trends can you identify in this sales data?',
        fileName: 'sales-data.csv',
        fileType: 'text/csv'
      })
    });

    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Document Analysis is working!');
      console.log('📝 Analysis Result:');
      console.log(data.reply);
      console.log('\n💡 Suggestions:', data.suggestions);
      return true;
    } else {
      const errorData = await response.text();
      console.log('❌ API error:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Make sure the development server is running: npm run dev');
    return false;
  }
};

console.log('🚀 Testing Document Analytics Implementation...');
console.log('='.repeat(60));
testDocumentAnalysis();
