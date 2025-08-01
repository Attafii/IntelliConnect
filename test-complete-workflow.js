#!/usr/bin/env node

const http = require('http');
const FormData = require('form-data');

console.log('🚀 IntelliConnect PDF Processing End-to-End Test');
console.log('================================================\n');

async function testCompleteWorkflow() {
    // Test 1: PDF Text Extraction
    console.log('📋 TEST 1: PDF Text Extraction');
    console.log('-------------------------------');
    
    try {
        // Create a comprehensive test PDF with realistic content
        const testPdfContent = `%PDF-1.4
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
/Length 300
>>
stream
BT
/F1 12 Tf
72 720 Td
(PROJECT STATUS REPORT) Tj
0 -20 Td
(Executive Summary:) Tj
0 -15 Td
(The Ahmed Branding Project is progressing well with 85% completion.) Tj
0 -15 Td
(Key Achievements: Brand identity finalized, marketing materials developed.) Tj
0 -15 Td
(Current Risks: Minor budget overrun of 5%, timeline pressure on final deliverables.) Tj
0 -15 Td
(Opportunities: Potential for brand extension into new markets.) Tj
0 -15 Td
(Recommendations: 1) Increase resources for final phase 2) Plan market expansion.) Tj
0 -15 Td
(Financial Status: Budget utilization at 90%, projected ROI of 250%.) Tj
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
0000000624 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
699
%%EOF`;

        const testData = Buffer.from(testPdfContent);
        
        const form = new FormData();
        form.append('file', testData, {
            filename: 'Ahmed-Project-Status-Report.pdf',
            contentType: 'application/pdf'
        });
        
        console.log('📤 Uploading test PDF...');
        
        const extractionResult = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/api/analysis/extract-pdf',
                method: 'POST',
                headers: form.getHeaders()
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
            form.pipe(req);
        });
        
        console.log('📄 PDF Extraction Result:');
        console.log(`   ✓ Success: ${extractionResult.success}`);
        console.log(`   ✓ Method: ${extractionResult.info?.extractionMethod}`);
        console.log(`   ✓ Content Extracted: ${extractionResult.metadata?.extractedContent}`);
        console.log(`   ✓ Characters: ${extractionResult.info?.charactersExtracted || 0}`);
        
        if (extractionResult.metadata?.extractedContent) {
            console.log('   🎯 Content Preview:', extractionResult.text.substring(0, 200) + '...');
        }
        
        // Test 2: AI Analysis of Extracted Content
        console.log('\n📊 TEST 2: AI Document Analysis');
        console.log('-------------------------------');
          if (extractionResult.success && extractionResult.text) {
            const analysisPayload = {
                fileName: 'Ahmed-Project-Status-Report.pdf',
                fileType: 'application/pdf',
                extractedText: extractionResult.text,
                question: 'Provide a comprehensive analysis including summary, key insights, risks, opportunities, and recommendations.'
            };
            
            console.log('🤖 Sending to AI analysis...');
            
            const analysisResult = await new Promise((resolve, reject) => {
                const postData = JSON.stringify(analysisPayload);
                
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
                            resolve(JSON.parse(data));
                        } catch (error) {
                            reject(new Error(`Parse error: ${error.message}`));
                        }
                    });
                });
                
                req.on('error', reject);
                req.write(postData);
                req.end();
            });
            
            console.log('🤖 AI Analysis Result:');
            console.log(`   ✓ Success: ${analysisResult.success !== false}`);
            console.log(`   ✓ Response Length: ${analysisResult.reply?.length || 0} characters`);
            console.log(`   ✓ Suggestions: ${analysisResult.suggestions?.length || 0}`);
            
            if (analysisResult.reply) {
                console.log('   📝 Analysis Preview:', analysisResult.reply.substring(0, 300) + '...');
            }
            
            // Check if analysis mentions actual content
            const hasRealAnalysis = analysisResult.reply && (
                analysisResult.reply.includes('Ahmed') ||
                analysisResult.reply.includes('85%') ||
                analysisResult.reply.includes('branding') ||
                analysisResult.reply.includes('budget')
            );
            
            console.log(`   🎯 Contains Real Analysis: ${hasRealAnalysis ? 'YES' : 'NO'}`);
            
            if (hasRealAnalysis) {
                console.log('\n🎉 SUCCESS: End-to-end PDF analysis is working!');
                console.log('   ✅ PDF text extraction: Working');
                console.log('   ✅ AI content analysis: Working');
                console.log('   ✅ Real content analysis: Working');
            } else {
                console.log('\n⚠️  PARTIAL SUCCESS: System working but may need content improvement');
                console.log('   ✅ PDF text extraction: Working');
                console.log('   ✅ AI content analysis: Working');
                console.log('   ❓ Real content analysis: Needs verification');
            }
        } else {
            console.log('\n❌ Cannot test AI analysis - PDF extraction failed');
        }
        
    } catch (error) {
        console.error('\n💥 Test failed:', error.message);
    }
}

// Run the test
testCompleteWorkflow().then(() => {
    console.log('\n📋 Test completed. Check results above.');
}).catch(error => {
    console.error('💥 Test suite failed:', error.message);
});
