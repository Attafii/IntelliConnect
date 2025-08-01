const http = require('http');
const fs = require('fs');
const path = require('path');

// Test with real file upload simulation
async function testWithFileUpload() {
    console.log('📁 IntelliConnect File Upload Test');
    console.log('=================================');
    
    try {
        // Create a temporary PDF file for testing
        const testPdfContent = createTestPDF();
        const tempFile = path.join(__dirname, 'temp-test.pdf');
        
        // Write test PDF to file
        fs.writeFileSync(tempFile, testPdfContent, 'binary');
        console.log('📄 Created temporary test PDF file');
        
        // Test file upload to extraction API
        console.log('📤 Testing PDF extraction with file upload...');
        const extractionResult = await uploadAndExtract(tempFile);
        
        console.log(`   ✅ Extraction: ${extractionResult.success ? 'SUCCESS' : 'FAILED'}`);
        console.log(`   📊 Characters: ${extractionResult.charactersExtracted || 0}`);
        
        if (extractionResult.success && extractionResult.text) {
            console.log('   🎯 Preview:', extractionResult.text.substring(0, 200) + '...');
            
            // Test AI Analysis
            console.log('\n🤖 Testing AI analysis...');
            const analysisResult = await testAIAnalysis({
                fileName: 'test-document.pdf',
                extractedText: extractionResult.text,
                question: 'Analyze this document and provide key insights and recommendations.'
            });
            
            console.log(`   ✅ Analysis: ${analysisResult.success ? 'SUCCESS' : 'FAILED'}`);
            console.log(`   📝 Length: ${analysisResult.reply?.length || 0} characters`);
            
            if (analysisResult.success) {
                console.log('   📋 Analysis Preview:');
                console.log('   ' + analysisResult.reply.substring(0, 300) + '...');
                
                console.log('\n🎉 SUCCESS: Complete workflow is functional!');
                console.log('   ✓ PDF file upload and extraction works');
                console.log('   ✓ AI analysis of extracted content works');
                console.log('   ✓ End-to-end pipeline is operational');
            }
        }
        
        // Clean up
        try {
            fs.unlinkSync(tempFile);
            console.log('🧹 Cleaned up temporary file');
        } catch (e) {
            // Ignore cleanup errors
        }
        
    } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
    }
}

function createTestPDF() {
    // Create a minimal but valid PDF with text content
    return `%PDF-1.4
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
/Length 650
>>
stream
BT
/F1 14 Tf
50 750 Td
(PROJECT ANALYSIS REPORT) Tj
0 -30 Td
(Executive Summary) Tj
0 -20 Td
(The Digital Transformation Project has achieved) Tj
0 -20 Td
(significant milestones with 87% completion rate.) Tj
0 -30 Td
(Key Performance Metrics:) Tj
0 -20 Td
(- Budget utilization: 82% of allocated funds) Tj
0 -20 Td
(- Timeline adherence: On track for Q1 delivery) Tj
0 -20 Td
(- Quality metrics: 95% test pass rate) Tj
0 -30 Td
(Critical Success Factors:) Tj
0 -20 Td
(1. Strong stakeholder engagement) Tj
0 -20 Td
(2. Agile development methodology) Tj
0 -20 Td
(3. Effective risk management) Tj
0 -30 Td
(Recommendations:) Tj
0 -20 Td
(- Accelerate user acceptance testing) Tj
0 -20 Td
(- Increase communication frequency) Tj
0 -20 Td
(- Plan for post-launch support) Tj
0 -30 Td
(Risk Assessment: LOW to MEDIUM) Tj
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
0000000274 00000 n 
0000000976 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1053
%%EOF`;
}

async function uploadAndExtract(filePath) {
    return new Promise((resolve, reject) => {
        const boundary = '----formdata-boundary-' + Math.random().toString(36);
        const fileData = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        
        let postData = '';
        postData += `--${boundary}\r\n`;
        postData += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
        postData += `Content-Type: application/pdf\r\n\r\n`;
        
        const postDataBuffer = Buffer.concat([
            Buffer.from(postData, 'utf8'),
            fileData,
            Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8')
        ]);
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/analysis/extract-pdf',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': postDataBuffer.length
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`Parse error: ${error.message}`));
                }
            });
        });
        
        req.on('error', reject);
        req.write(postDataBuffer);
        req.end();
    });
}

async function testAIAnalysis(payload) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(payload);
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/analysis/document-ai',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve({ success: !result.error, ...result });
                } catch (error) {
                    reject(new Error(`Parse error: ${error.message}`));
                }
            });
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Run the test
testWithFileUpload().catch(console.error);
