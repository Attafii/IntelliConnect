// Test script to create a simple PDF and test the extraction API
const { jsPDF } = require('jspdf');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function createAndTestPDF() {
  try {
    console.log('📝 Creating test PDF...');
    
    // Create a simple test PDF
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Test Document for PDF Analysis', 20, 30);
    pdf.setFontSize(12);
    pdf.text('This is a test PDF document created for testing the document analysis feature.', 20, 50);
    pdf.text('It contains sample text to verify that PDF text extraction is working correctly.', 20, 65);
    pdf.text('', 20, 80);
    pdf.text('Key Points:', 20, 95);
    pdf.text('• This is a test document', 30, 110);
    pdf.text('• PDF extraction should work', 30, 125);
    pdf.text('• Analysis should provide insights', 30, 140);
    
    // Save the PDF to file system
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    const pdfPath = './test-document.pdf';
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    console.log('✅ Test PDF created:', pdfPath);
    console.log('📤 Testing PDF extraction API...');
    
    // Test the PDF extraction API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath), {
      filename: 'test-document.pdf',
      contentType: 'application/pdf'
    });
    
    try {
      const response = await axios.post('http://localhost:3002/api/analysis/extract-pdf', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 10000
      });
      
      console.log('📥 API Response Status:', response.status);
      console.log('📄 Extracted Text Length:', response.data.text?.length || 0);
      console.log('📋 First 200 characters:', response.data.text?.substring(0, 200) || 'No text');
      console.log('✅ PDF extraction test completed successfully');
      
    } catch (apiError) {
      console.error('❌ API test failed:', apiError.response?.status || apiError.message);
      if (apiError.response?.data) {
        console.error('Error details:', apiError.response.data);
      }
    }
    
    // Clean up
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log('🧹 Cleaned up test file');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

createAndTestPDF();
