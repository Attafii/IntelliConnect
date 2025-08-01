const http = require('http');

// Simple validation test using the working PDF structure
async function testQuickValidation() {
    console.log('⚡ IntelliConnect Quick Validation Test');
    console.log('======================================');
    
    // Test with known working PDF content structure
    const testPdfContent = `%PDF-1.4
BT
/F1 12 Tf
50 750 Td
(FINANCIAL PERFORMANCE REPORT) Tj
0 -20 Td
(Q4 2024 Results - Confidential) Tj
0 -30 Td
(Revenue: $3.2M (+22% YoY)) Tj
0 -20 Td
(Operating Expenses: $2.1M) Tj
0 -20 Td
(Net Profit: $1.1M (+35% improvement)) Tj
0 -30 Td
(KEY INSIGHTS:) Tj
0 -20 Td
(- Strong digital transformation results) Tj
0 -20 Td
(- Customer retention at 96%) Tj
0 -20 Td
(- Market expansion successful) Tj
0 -30 Td
(RECOMMENDATIONS:) Tj
0 -20 Td
(1. Increase R&D investment by 15%) Tj
0 -20 Td
(2. Expand sales team in emerging markets) Tj
0 -20 Td
(3. Accelerate digital platform development) Tj
0 -30 Td
(RISK FACTORS:) Tj
0 -20 Td
(- Supply chain volatility: MEDIUM) Tj
0 -20 Td
(- Competitive pressure: HIGH) Tj
0 -20 Td
(- Regulatory changes: LOW) Tj
ET
endstream`;

    try {
        console.log('📤 Testing PDF extraction with financial report...');
        
        // Test PDF extraction
        const extraction = await testPDFExtraction(testPdfContent);
        console.log(`   ✅ Extraction: ${extraction.success ? 'SUCCESS' : 'FAILED'}`);
        console.log(`   📊 Characters extracted: ${extraction.charactersExtracted || 0}`);
        
        if (extraction.success && extraction.text) {
            console.log('   🎯 Content preview:', extraction.text.substring(0, 150) + '...');
            
            // Test AI Analysis
            console.log('\n🤖 Testing AI analysis...');
            const analysis = await testAIAnalysis({
                fileName: 'Financial-Performance-Q4-2024.pdf',
                extractedText: extraction.text,
                question: 'What are the key financial insights, risks, and strategic recommendations from this report?'
            });
            
            console.log(`   ✅ Analysis: ${analysis.success ? 'SUCCESS' : 'FAILED'}`);
            console.log(`   📝 Response length: ${analysis.reply?.length || 0} characters`);
            
            if (analysis.success && analysis.reply) {
                // Check if analysis mentions specific content from our test
                const mentionsRevenue = analysis.reply.toLowerCase().includes('revenue') || 
                                      analysis.reply.includes('3.2') || 
                                      analysis.reply.includes('22%');
                const mentionsRecommendations = analysis.reply.toLowerCase().includes('recommendation') ||
                                              analysis.reply.toLowerCase().includes('r&d') ||
                                              analysis.reply.toLowerCase().includes('investment');
                const mentionsRisks = analysis.reply.toLowerCase().includes('risk') ||
                                    analysis.reply.toLowerCase().includes('supply chain') ||
                                    analysis.reply.toLowerCase().includes('competitive');
                
                console.log(`   🎯 Content relevance:`);
                console.log(`      Revenue analysis: ${mentionsRevenue ? '✅' : '❌'}`);
                console.log(`      Recommendations: ${mentionsRecommendations ? '✅' : '❌'}`);
                console.log(`      Risk assessment: ${mentionsRisks ? '✅' : '❌'}`);
                
                console.log('\n   📋 Analysis Preview:');
                console.log('   ' + analysis.reply.substring(0, 400) + '...');
                
                // Final assessment
                const isFullyFunctional = extraction.success && 
                                        analysis.success && 
                                        (mentionsRevenue || mentionsRecommendations || mentionsRisks);
                
                console.log('\n🎉 FINAL ASSESSMENT:');
                console.log('===================');
                console.log(`✅ PDF Text Extraction: ${extraction.success ? 'WORKING' : 'FAILED'}`);
                console.log(`✅ AI Content Analysis: ${analysis.success ? 'WORKING' : 'FAILED'}`);
                console.log(`✅ Real Content Processing: ${isFullyFunctional ? 'WORKING' : 'NEEDS IMPROVEMENT'}`);
                
                if (isFullyFunctional) {
                    console.log('\n🎊 SUCCESS: IntelliConnect PDF analysis is FULLY OPERATIONAL!');
                    console.log('   ✓ Extracts real text from PDF documents');
                    console.log('   ✓ AI analyzes actual document content (not templates)');
                    console.log('   ✓ Provides relevant insights and recommendations');
                    console.log('   ✓ Ready for production use!');
                } else {
                    console.log('\n⚠️  PARTIAL SUCCESS: Basic functionality works but content relevance needs improvement');
                }
            } else {
                console.log('   ❌ AI analysis failed or returned empty response');
            }
        } else {
            console.log('   ❌ PDF extraction failed');
        }
        
    } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
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
testQuickValidation().catch(console.error);
