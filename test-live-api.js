const https = require('https');
const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

async function testPDFExtractionAPI() {
    console.log('Testing PDF extraction API on live server...');
    
    try {
        // Create a simple test PDF content (just text for testing)
        const testData = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n174\n%%EOF');
        
        const form = new FormData();
        form.append('file', testData, {
            filename: 'test.pdf',
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
            console.log(`Headers:`, res.headers);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('\n=== API Response ===');
                    console.log(JSON.stringify(response, null, 2));
                    
                    if (response.success) {
                        console.log('\n✅ PDF extraction API is working correctly!');
                        console.log(`Extraction method: ${response.metadata?.extractionMethod}`);
                        console.log(`Content length: ${response.content?.length || 0} characters`);
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

testPDFExtractionAPI();
