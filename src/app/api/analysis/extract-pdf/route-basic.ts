import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📄 PDF extraction API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      console.error('❌ File is not a PDF:', file.type);
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    console.log(`📋 Processing PDF: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    try {
      // Convert file to buffer and try basic text extraction
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log('🔍 Attempting basic PDF text extraction...');
      
      // Convert buffer to string and look for text patterns
      const pdfString = buffer.toString('latin1');
      
      // Method 1: Look for text between BT/ET markers (text objects)
      const textObjectRegex = /BT\s+(.*?)\s+ET/gs;
      const textObjects = Array.from(pdfString.matchAll(textObjectRegex));
      
      // Method 2: Look for text in parentheses
      const textInParens = Array.from(pdfString.matchAll(/\(([^)]+)\)/g));
      
      // Method 3: Look for text in square brackets  
      const textInBrackets = Array.from(pdfString.matchAll(/\[([^\]]+)\]/g));
      
      // Combine all extracted text
      let extractedText = '';
      
      // Process text objects
      textObjects.forEach((match, index) => {
        const textContent = match[1];
        // Extract text from Tj commands
        const tjMatches = textContent.match(/\(([^)]*)\)\s*Tj/g);
        if (tjMatches) {
          tjMatches.forEach(tj => {
            const text = tj.match(/\(([^)]*)\)/);
            if (text && text[1]) {
              extractedText += text[1] + ' ';
            }
          });
        }
      });
      
      // Process parentheses text
      textInParens.forEach(match => {
        const text = match[1];
        if (text && text.length > 1 && /[a-zA-Z]/.test(text)) {
          extractedText += text + ' ';
        }
      });
      
      // Process bracket text
      textInBrackets.forEach(match => {
        const text = match[1];
        if (text && text.length > 1 && /[a-zA-Z]/.test(text)) {
          extractedText += text + ' ';
        }
      });
      
      // Clean up the extracted text
      extractedText = extractedText
        .replace(/\\[rn]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.,!?;:()\-'"]/g, ' ')
        .trim();
      
      console.log(`📝 Raw extraction found ${extractedText.length} characters`);
      
      if (extractedText && extractedText.length > 20) {
        // We found some text!
        const finalText = `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
EXTRACTION DATE: ${new Date().toLocaleString()}

EXTRACTED CONTENT:
${extractedText}

---END OF DOCUMENT---

This content has been extracted from the PDF and is ready for AI analysis.`;

        console.log(`✅ Successfully extracted text: ${extractedText.length} characters`);
        
        return NextResponse.json({
          text: finalText,
          info: {
            pages: Math.ceil(file.size / 50000),
            fileSize: file.size,
            fileName: file.name,
            extractionMethod: 'basic-pdf-parsing',
            charactersExtracted: extractedText.length
          },
          success: true,
          metadata: {
            extractedContent: true,
            analysisReady: true,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        throw new Error('No readable text found in PDF');
      }
      
    } catch (extractionError) {
      console.warn('⚠️ Text extraction failed:', extractionError);
      
      // Fallback with guidance for manual input
      return NextResponse.json({
        text: `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
EXTRACTION STATUS: Automatic text extraction was not successful

I was unable to automatically extract text from this PDF. This commonly happens with:
- Scanned documents or image-based PDFs
- Password-protected files
- Complex layouts or special formatting
- Encrypted or restricted PDFs

TO GET AI ANALYSIS:
Please copy and paste the key content from your PDF that you'd like me to analyze. I can then provide:

📊 **Comprehensive Analysis** including:
- Document summary and key insights
- Trend identification and pattern analysis  
- Risk assessment and opportunities
- Strategic recommendations and action items
- Performance metrics evaluation

📋 **Specific Analysis Types**:
- Financial data interpretation
- Project status and milestone tracking
- Market research and competitive analysis
- Technical documentation review
- Compliance and regulatory assessment

Just paste the content below and ask me to analyze it, and I'll provide detailed insights based on the actual document content.

What specific sections from "${file.name}" would you like me to analyze?`,
        info: {
          pages: Math.ceil(file.size / 50000),
          fileSize: file.size,
          fileName: file.name,
          extractionMethod: 'manual-input-required',
          error: extractionError instanceof Error ? extractionError.message : 'Unknown error'
        },
        success: true,
        fallback: true,
        metadata: {
          extractedContent: false,
          analysisReady: true, // Still ready for analysis with manual input
          timestamp: new Date().toISOString(),
          requiresManualInput: true
        }
      });
    }

  } catch (error) {
    console.error('💥 PDF extraction API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process PDF file',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}
