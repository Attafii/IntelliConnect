const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testPDFExtractionAPI() {
  try {
    console.log('🔍 Testing new PDF extraction API...');
    
    // Create a test PDF using jsPDF
    console.log('📄 Creating test PDF...');
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Add multiple pages with different content
    doc.text('Test PDF Document', 10, 20);
    doc.text('This is page 1 with some sample text.', 10, 30);
    doc.text('Line 2: Testing PDF text extraction capability.', 10, 40);
    doc.text('Line 3: Multiple lines of text to extract.', 10, 50);
    
    // Add a second page
    doc.addPage();
    doc.text('Page 2 Content', 10, 20);
    doc.text('This is the second page of the test document.', 10, 30);
    doc.text('More text content for extraction testing.', 10, 40);
    
    // Get PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log(`📋 Test PDF created: ${pdfBuffer.length} bytes, 2 pages`);
    
    // Save the PDF temporarily for testing
    const tempPdfPath = './test-document.pdf';
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    console.log(`💾 Saved test PDF to: ${tempPdfPath}`);
    
    // Test the API endpoint
    console.log('🌐 Testing API endpoint...');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(tempPdfPath), {
      filename: 'test-document.pdf',
      contentType: 'application/pdf'
    });
    
    const response = await axios.post('http://localhost:3003/api/analysis/extract-pdf', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000
    });
    
    console.log('✅ API Response received!');
    console.log('📊 Status:', response.status);
    console.log('📋 Success:', response.data.success);
    console.log('📄 Pages:', response.data.info?.pages);
    console.log('📝 Text length:', response.data.text?.length);
    console.log('📖 Extracted text preview:');
    console.log('---');
    console.log(response.data.text?.substring(0, 500) + '...');
    console.log('---');
    
    // Clean up
    if (fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
      console.log('🗑️ Cleaned up test file');
    }
    
    return {
      success: response.data.success,
      pages: response.data.info?.pages,
      textLength: response.data.text?.length,
      hasText: response.data.text && response.data.text.length > 50
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📋 Response status:', error.response.status);
      console.error('📋 Response data:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Run the test
testPDFExtractionAPI().then(result => {
  console.log('\n📊 Final Test Result:', result);
  
  if (result.success && result.hasText) {
    console.log('🎉 PDF extraction is working perfectly!');
    process.exit(0);
  } else {
    console.log('⚠️ PDF extraction needs attention');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
