// Test script to verify PDF generation functionality
const { jsPDF } = require('jspdf');

console.log('🧪 Testing PDF generation...');

try {
  // Create a sample PDF
  const pdf = new jsPDF();
  
  // Add some content
  pdf.setFontSize(20);
  pdf.text('Test PDF Document', 20, 30);
  
  pdf.setFontSize(12);
  pdf.text('This is a test of the PDF generation functionality.', 20, 50);
  
  // Test text wrapping
  const longText = 'This is a very long text that should be wrapped across multiple lines to test the text wrapping functionality of the PDF generation. It should handle long sentences and paragraphs correctly.';
  const wrappedLines = pdf.splitTextToSize(longText, 170);
  pdf.text(wrappedLines, 20, 70);
  
  console.log('✅ PDF creation successful');
  console.log('📄 PDF has', pdf.internal.getNumberOfPages(), 'page(s)');
  
  // Simulate saving (we can't actually save in Node.js, but we can test the creation)
  console.log('🎯 PDF generation test completed successfully');
  
} catch (error) {
  console.error('❌ PDF generation test failed:', error.message);
}
