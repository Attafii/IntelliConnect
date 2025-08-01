const fs = require('fs');
const path = require('path');

async function testPDFExtraction() {
  try {
    console.log('🔍 Testing PDF extraction...');
    
    // Test if pdf-parse can be imported
    console.log('📦 Importing pdf-parse...');
    const pdfParse = await import('pdf-parse');
    console.log('✅ pdf-parse imported successfully');
    
    // Create a simple test PDF using jsPDF if available
    try {
      console.log('📄 Creating test PDF...');
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.text('This is a test PDF document.', 10, 10);
      doc.text('Line 2: Testing PDF text extraction.', 10, 20);
      doc.text('Line 3: This should be extractable.', 10, 30);
      
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      console.log(`📋 Test PDF created, size: ${pdfBuffer.length} bytes`);
      
      // Test extraction
      console.log('🔍 Extracting text from test PDF...');
      const data = await pdfParse.default(pdfBuffer);
      
      console.log('✅ Extraction successful!');
      console.log(`📖 Pages: ${data.numpages}`);
      console.log(`📝 Text length: ${data.text.length}`);
      console.log(`📄 Extracted text: "${data.text}"`);
      
      return { success: true, text: data.text };
      
    } catch (pdfError) {
      console.error('❌ PDF creation/extraction failed:', pdfError);
      return { success: false, error: pdfError.message };
    }
    
  } catch (importError) {
    console.error('❌ Failed to import pdf-parse:', importError);
    return { success: false, error: importError.message };
  }
}

// Run the test
testPDFExtraction().then(result => {
  console.log('\n📊 Test Result:', result);
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
