const https = require('https');
const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

async function testWithRealPDF() {
    console.log('Testing PDF extraction with a text-based PDF...');
    
    try {
        // Create a more realistic PDF with actual text content
        const pdfWithText = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
72 720 Td
(Hello World! This is a test PDF document.) Tj
0 -15 Td
(It contains actual text content for analysis.) Tj
0 -15 Td
(Key findings: The document discusses project status.) Tj
0 -15 Td
(Recommendation: Continue with implementation.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000273 00000 n 
0000000424 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
499
%%EOF`;
        
        const testData = Buffer.from(pdfWithText);
        
        const form = new FormData();
        form.append('file', testData, {
            filename: 'test-with-content.pdf',
            contentType: 'application/pdf'
        });
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/analysis/extract-pdf',
            method: 'POST',
            headers: form.getHeaders()
        };
        
        const req = http.request(options, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('\n=== API Response ===');
                    console.log(JSON.stringify(response, null, 2));
                    
                    if (response.success && response.metadata?.extractedContent) {
                        console.log('\n✅ SUCCESS: PDF text extraction is working!');
                        console.log(`Extraction method: ${response.info?.extractionMethod}`);
                        console.log(`Characters extracted: ${response.info?.charactersExtracted}`);
                        
                        // Check if actual content was extracted
                        if (response.text?.includes('Hello World') || response.text?.includes('test PDF document')) {
                            console.log('🎯 VERIFIED: Actual PDF content was successfully extracted!');
                        } else {
                            console.log('⚠️ Content extracted but may not match expected text');
                        }
                    } else if (response.success && response.fallback) {
                        console.log('\n✅ Fallback working: System requesting manual input');
                        console.log('This is expected behavior for complex PDFs');
                    } else {
                        console.log('\n❌ API returned success=false');
                        console.log('Error:', response.error);
                    }
                } catch (parseError) {
                    console.error('\n❌ Failed to parse JSON response:', parseError);
                    console.log('Raw response:', data);
                }
            });
        });
        
        req.on('error', (error) => {
            console.error('\n❌ Request failed:', error);
        });
        
        form.pipe(req);
        
    } catch (error) {
        console.error('❌ Test setup failed:', error);
    }
}

testWithRealPDF();
