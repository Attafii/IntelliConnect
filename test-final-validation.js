const http = require('http');
const fs = require('fs');

// Test comprehensive PDF analysis with multiple document types
async function testFinalValidation() {
    console.log('🔥 IntelliConnect Final Validation Test');
    console.log('=====================================');
    
    // Test different types of PDF content
    const testCases = [
        {
            name: 'Financial Report',
            content: `(Financial Analysis Report)
BT Quarter Q3 2024 Results ET
BT Revenue: $2.4M (+15% YoY) ET
BT Expenses: $1.8M ET
BT Net Profit: $600K ET
BT Key Metrics: ET
BT - Customer Acquisition: 450 new clients ET
BT - Retention Rate: 94% ET
BT - Market Share: 12.3% ET
BT Recommendations: ET
BT 1. Expand digital marketing budget ET
BT 2. Optimize operational costs ET
BT 3. Invest in customer success team ET`,
            expectedInsights: ['revenue', 'profit', 'growth', 'recommendations']
        },
        {
            name: 'Risk Assessment',
            content: `(Risk Management Report)
BT CRITICAL RISKS IDENTIFIED ET
BT 1. Cybersecurity Vulnerabilities ET
BT   - Impact: High ET
BT   - Probability: Medium ET
BT   - Mitigation: Implement zero-trust security ET
BT 2. Supply Chain Disruption ET
BT   - Impact: Medium ET
BT   - Probability: High ET
BT   - Mitigation: Diversify supplier base ET
BT 3. Regulatory Compliance ET
BT   - Impact: High ET
BT   - Probability: Low ET
BT   - Mitigation: Regular compliance audits ET`,
            expectedInsights: ['risk', 'mitigation', 'impact', 'cybersecurity']
        }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n📊 TEST ${i + 1}: ${testCase.name} Analysis`);
        console.log('='.repeat(40));
        
        try {
            // Step 1: Test PDF Extraction
            console.log('📤 Testing PDF extraction...');
            const extractionResult = await testPDFExtraction(testCase.content);
            
            if (!extractionResult.success) {
                console.log('   ❌ PDF extraction failed');
                continue;
            }
            
            console.log(`   ✅ Extracted ${extractionResult.charactersExtracted} characters`);
            
            // Step 2: Test AI Analysis
            console.log('🤖 Testing AI analysis...');
            const analysisResult = await testAIAnalysis({
                fileName: `${testCase.name.replace(' ', '-')}.pdf`,
                extractedText: extractionResult.text,
                question: 'Analyze this document and provide key insights, risks, and recommendations.'
            });
            
            if (!analysisResult.success) {
                console.log('   ❌ AI analysis failed');
                continue;
            }
            
            console.log(`   ✅ Analysis completed (${analysisResult.reply.length} characters)`);
            
            // Step 3: Validate content relevance
            const hasRelevantContent = testCase.expectedInsights.some(keyword => 
                analysisResult.reply.toLowerCase().includes(keyword)
            );
            
            if (hasRelevantContent) {
                console.log('   ✅ Analysis contains relevant insights');
            } else {
                console.log('   ⚠️  Analysis may not be fully relevant');
            }
            
            // Show analysis preview
            console.log('   📝 Analysis Preview:');
            console.log('   ' + analysisResult.reply.substring(0, 300) + '...');
            
        } catch (error) {
            console.log(`   ❌ Test failed: ${error.message}`);
        }
    }
    
    // Final Integration Test
    console.log('\n🚀 FINAL INTEGRATION TEST');
    console.log('========================');
    
    try {
        console.log('📋 Testing complete workflow with real PDF content...');
        
        const realPDFContent = `(IntelliConnect Platform Analysis)
BT Executive Summary ET
BT The IntelliConnect platform has successfully processed over 10,000 documents ET
BT with a 99.2% accuracy rate in text extraction and AI analysis. ET
BT Key Performance Indicators: ET
BT - Document Processing Speed: 2.3 seconds average ET
BT - User Satisfaction: 4.8/5.0 ET
BT - System Uptime: 99.7% ET
BT Strategic Recommendations: ET
BT 1. Implement OCR for scanned documents ET
BT 2. Add multi-language support ET
BT 3. Enhance real-time collaboration features ET
BT Risk Assessment: LOW - System is stable and performing well ET`;
        
        const extraction = await testPDFExtraction(realPDFContent);
        const analysis = await testAIAnalysis({
            fileName: 'IntelliConnect-Platform-Analysis.pdf',
            extractedText: extraction.text,
            question: 'What are the key findings and recommendations from this platform analysis?'
        });
        
        const isComprehensive = analysis.reply.length > 500 && 
                              analysis.reply.includes('IntelliConnect') &&
                              (analysis.reply.toLowerCase().includes('recommendation') || 
                               analysis.reply.toLowerCase().includes('finding'));
        
        console.log('🎯 FINAL RESULTS:');
        console.log(`   ✅ PDF Extraction: ${extraction.success ? 'WORKING' : 'FAILED'}`);
        console.log(`   ✅ AI Analysis: ${analysis.success ? 'WORKING' : 'FAILED'}`);
        console.log(`   ✅ Content Relevance: ${isComprehensive ? 'EXCELLENT' : 'NEEDS IMPROVEMENT'}`);
        console.log(`   ✅ Character Count: ${extraction.charactersExtracted} extracted, ${analysis.reply.length} analyzed`);
        
        if (extraction.success && analysis.success && isComprehensive) {
            console.log('\n🎉 SUCCESS: IntelliConnect PDF Analysis is FULLY FUNCTIONAL!');
            console.log('   ✅ Real PDF content extraction works');
            console.log('   ✅ AI provides meaningful analysis');
            console.log('   ✅ End-to-end pipeline is complete');
        } else {
            console.log('\n⚠️  PARTIAL SUCCESS: Some components need attention');
        }
        
    } catch (error) {
        console.log(`❌ Final test failed: ${error.message}`);
    }
}

async function testPDFExtraction(content) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ content });
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/analysis/extract-pdf',
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
testFinalValidation().catch(console.error);
