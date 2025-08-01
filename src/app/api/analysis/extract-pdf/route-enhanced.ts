import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

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
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('🔍 Extracting text using pdf-parse...');
      
      // Extract text using pdf-parse
      const data = await pdf(buffer, {
        // Normalize whitespace
        normalizeWhitespace: true,
        // Disable image parsing for faster processing
        renderOptions: {
          normalizeWhitespace: true,
          disableCombineTextItems: false
        }
      });

      const extractedText = data.text;
      const pageCount = data.numpages;
      const metadata = data.metadata;

      console.log(`✅ Successfully extracted text from ${pageCount} pages`);
      console.log(`📝 Extracted ${extractedText.length} characters`);
      console.log(`� PDF metadata:`, {
        title: metadata?.Title || 'Unknown',
        author: metadata?.Author || 'Unknown',
        creator: metadata?.Creator || 'Unknown',
        pages: pageCount
      });

      if (!extractedText || extractedText.trim().length < 10) {
        console.warn('⚠️ Very little text extracted, might be a scanned PDF');
        return NextResponse.json({
          text: `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
PAGES: ${pageCount}
EXTRACTION STATUS: Limited text content found

This PDF appears to contain very little extractable text. This could mean:
- The PDF contains scanned images or photos instead of text
- The PDF is password protected or encrypted
- The document has a complex layout or unusual formatting

EXTRACTED CONTENT (${extractedText.length} characters):
${extractedText}

For better analysis, please:
1. Ensure the PDF contains selectable text (not just images)
2. Try copying and pasting key content manually if needed
3. Check if the PDF requires password access

What specific aspects of this document would you like me to analyze?`,
          info: {
            pages: pageCount,
            fileSize: file.size,
            fileName: file.name,
            extractionMethod: 'pdf-parse',
            charactersExtracted: extractedText.length,
            metadata: metadata
          },
          success: true,
          limitedContent: true,
          metadata: {
            extractedContent: true,
            analysisReady: extractedText.length > 50,
            timestamp: new Date().toISOString()
          }
        });
      }

      // Clean and format the extracted text
      const cleanedText = extractedText
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\n\s*\n/g, '\n\n') // Clean up extra line breaks
        .trim();

      const finalText = `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
PAGES: ${pageCount}
EXTRACTION DATE: ${new Date().toLocaleString()}
${metadata?.Title ? `TITLE: ${metadata.Title}` : ''}
${metadata?.Author ? `AUTHOR: ${metadata.Author}` : ''}

EXTRACTED CONTENT:
${cleanedText}

---END OF DOCUMENT---`;

      console.log(`✅ Successfully processed PDF with ${cleanedText.length} characters of clean text`);
      
      return NextResponse.json({
        text: finalText,
        info: {
          pages: pageCount,
          fileSize: file.size,
          fileName: file.name,
          extractionMethod: 'pdf-parse',
          charactersExtracted: cleanedText.length,
          metadata: metadata
        },
        success: true,
        metadata: {
          extractedContent: true,
          analysisReady: true,
          timestamp: new Date().toISOString()
        }
      });

    } catch (pdfError) {
      console.error('💥 PDF parsing error:', pdfError);
      
      // Provide helpful error response
      return NextResponse.json({
        text: `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
EXTRACTION STATUS: Failed to extract text

I was unable to extract text from this PDF file. This could be due to:

1. **Scanned Document**: The PDF contains scanned images rather than selectable text
2. **Password Protection**: The PDF is encrypted or password protected
3. **Corrupted File**: The PDF file may be damaged or corrupted
4. **Complex Format**: The PDF uses an unsupported format or has complex encoding

TROUBLESHOOTING OPTIONS:
- Try saving the PDF in a different format or re-creating it
- Check if the text is selectable when you open the PDF in a viewer
- If it's a scanned document, consider using OCR software first
- Copy and paste the key content manually for analysis

ERROR DETAILS: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}

What specific content from "${file.name}" would you like me to analyze if you can provide it manually?`,
        info: {
          pages: null,
          fileSize: file.size,
          fileName: file.name,
          extractionMethod: 'failed',
          error: pdfError instanceof Error ? pdfError.message : 'Unknown error'
        },
        success: false,
        error: 'PDF text extraction failed',
        metadata: {
          extractedContent: false,
          analysisReady: false,
          timestamp: new Date().toISOString(),
          requiresManualInput: true
        }
      }, { status: 200 }); // Return 200 with error info rather than 500
    }  } catch (error) {
    console.error('💥 PDF extraction API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process PDF file',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}
