import { NextRequest, NextResponse } from 'next/server';

// Helper function for basic fallback content
function getBasicFallbackContent(file: File, buffer: Buffer): string {
  const fileContent = buffer.toString('binary');
  const slideMarkers = fileContent.match(/ppt\/slides\//g);
  const slideCount = slideMarkers ? slideMarkers.length : 0;
  
  const textMatches = fileContent.match(/[\x20-\x7E]{15,}/g) || [];
  const potentialText = textMatches
    .filter((text: string) => text.length > 15 && !text.includes('<?xml') && !text.includes('xmlns'))
    .slice(0, 30)
    .join('\n');
  
  return `POWERPOINT ANALYSIS (Basic Extraction):
File Structure: ${file.type}
Estimated Slides: ${slideCount || 'Unable to determine'}
File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB

EXTRACTED TEXT CONTENT:
${potentialText || 'Limited text content detected'}

RECOMMENDED ANALYSIS APPROACH:
For comprehensive PowerPoint analysis, please:

1. **Export as PDF**: Save your PowerPoint as PDF for text extraction
2. **Copy Text Content**: Manually copy and paste key slide content
3. **Export Speaker Notes**: If available, export speaker notes separately
4. **Describe Content**: Tell me what specific aspects you'd like analyzed

SAMPLE QUESTIONS FOR POWERPOINT ANALYSIS:
- "Analyze the main themes from my presentation slides"
- "What are the key points covered in this presentation?"
- "Summarize the conclusions and recommendations"
- "Extract the data and statistics mentioned"

What specific content from "${file.name}" would you like me to analyze?`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📊 PowerPoint extraction API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if file is PowerPoint format
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.template' // .potx
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error('❌ File is not a PowerPoint file:', file.type);
      return NextResponse.json({ error: 'File must be a PowerPoint file (.pptx or .ppt)' }, { status: 400 });
    }

    console.log(`📋 Processing PowerPoint: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('🔍 Parsing PowerPoint file with enhanced extraction...');
      
      let extractedContent = '';
      let slideCount = 0;
      
      try {
        // Try to use pptx-parser if available, otherwise fall back to basic extraction
        let pptxParser: any;
        try {
          pptxParser = require('pptx-parser');
        } catch (importError) {
          console.warn('pptx-parser not available, using basic extraction');
          pptxParser = null;
        }
        
        if (pptxParser) {
          try {
            const result = await pptxParser.parseBuffer(buffer);
            
            if (result && result.slides) {
              slideCount = result.slides.length;
              
              extractedContent = `POWERPOINT ANALYSIS:
File Structure: ${file.type}
Total Slides: ${slideCount}
File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
Presentation Title: ${result.title || 'Not specified'}
Author: ${result.author || 'Not specified'}

EXTRACTED SLIDE CONTENT:\n`;

              result.slides.forEach((slide: any, index: number) => {
                let slideText = `\n=== SLIDE ${index + 1} ===\n`;
                
                if (slide.title) {
                  slideText += `TITLE: ${slide.title}\n`;
                }
                
                if (slide.content && slide.content.length > 0) {
                  slideText += `CONTENT:\n`;
                  slide.content.forEach((item: any) => {
                    if (typeof item === 'string') {
                      slideText += `- ${item}\n`;
                    } else if (item && item.text) {
                      slideText += `- ${item.text}\n`;
                    } else if (item && item.value) {
                      slideText += `- ${item.value}\n`;
                    }
                  });
                }
                
                if (slide.notes) {
                  slideText += `SPEAKER NOTES: ${slide.notes}\n`;
                }
                
                extractedContent += slideText;
              });
              
              // Add summary
              extractedContent += `\n=== PRESENTATION SUMMARY ===\n`;
              extractedContent += `This PowerPoint presentation contains ${slideCount} slides with extracted text content.\n`;
              extractedContent += `You can ask questions about the content, themes, or specific information presented.\n`;
              
            } else {
              throw new Error('Unable to parse PowerPoint structure');
            }
          } catch (parseError) {
            console.warn('Advanced parsing failed:', parseError);
            throw parseError;
          }
        } else {
          throw new Error('PowerPoint parser not available');
        }

      } catch (parseError) {
        console.warn('Advanced PowerPoint parsing failed, using basic extraction:', parseError);
        
        // Fallback: Basic text extraction using JSZip for PPTX files
        if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
          try {
            const JSZip = require('jszip');
            const zip = await JSZip.loadAsync(buffer);
            
            // Count slides by looking for slide files
            const slideFiles = Object.keys(zip.files).filter(name => name.match(/^ppt\/slides\/slide\d+\.xml$/));
            slideCount = slideFiles.length;
            
            let allSlideText = '';
            
            // Extract text from each slide
            for (const slideFile of slideFiles.slice(0, 10)) { // Limit to first 10 slides
              try {
                const slideXml = await zip.files[slideFile].async('text');                // Basic XML text extraction
                const textMatches = slideXml.match(/>([^<>{}\[\]]{3,})</g) || [];
                const slideTexts = textMatches
                  .map((match: string) => match.slice(1, -1).trim())
                  .filter((text: string) => text.length > 3 && !text.match(/^[a-z]+$/))
                  .slice(0, 20);
                
                if (slideTexts.length > 0) {
                  allSlideText += `\n=== SLIDE ${slideFiles.indexOf(slideFile) + 1} ===\n`;
                  allSlideText += slideTexts.join('\n') + '\n';
                }
              } catch (slideError) {
                console.warn(`Error processing slide ${slideFile}:`, slideError);
              }
            }
            
            extractedContent = `POWERPOINT ANALYSIS (Enhanced Extraction):
File Structure: ${file.type}
Total Slides: ${slideCount}
File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB

EXTRACTED SLIDE CONTENT:
${allSlideText}

=== ANALYSIS CAPABILITIES ===
I can help you analyze:
- Main themes and topics
- Key points and takeaways
- Data and statistics mentioned
- Conclusions and recommendations
- Structure and organization

What specific aspects of "${file.name}" would you like me to analyze?`;
              } catch (zipError) {
            console.warn('JSZip extraction failed:', zipError);
            // Final fallback
            extractedContent = getBasicFallbackContent(file, buffer);
          }
        } else {
          // For .ppt files or when JSZip fails
          extractedContent = getBasicFallbackContent(file, buffer);
        }
      }

      const finalText = `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
FILE TYPE: PowerPoint Presentation
ESTIMATED SLIDES: ${slideCount || 'Unknown'}
EXTRACTION DATE: ${new Date().toLocaleString()}

${extractedContent}

---END OF DOCUMENT---`;

      console.log(`✅ Successfully processed PowerPoint file`);
      
      return NextResponse.json({
        text: finalText,
        info: {
          slides: slideCount,
          fileSize: file.size,
          fileName: file.name,
          extractionMethod: 'pptx-basic',
          charactersExtracted: finalText.length
        },
        success: true,
        metadata: {
          extractedContent: true,
          analysisReady: true,
          timestamp: new Date().toISOString(),
          dataType: 'presentation',
          requiresManualInput: true // PowerPoint extraction is limited
        }
      });

    } catch (pptError) {
      console.error('💥 PowerPoint parsing error:', pptError);
      
      return NextResponse.json({
        text: `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
EXTRACTION STATUS: Failed to parse PowerPoint file

I was unable to extract content from this PowerPoint file. This could be due to:

1. **File Corruption**: The PowerPoint file may be damaged or corrupted
2. **Password Protection**: The file is encrypted or password protected
3. **Unsupported Format**: The file uses an unsupported PowerPoint version
4. **Complex Features**: The file contains complex animations, macros, or embedded objects

ALTERNATIVE APPROACHES:
- Export your PowerPoint as PDF and upload the PDF version
- Copy and paste key slide text content for analysis
- Save slides as images and describe the content you want analyzed
- Export speaker notes as a text file

ERROR DETAILS: ${pptError instanceof Error ? pptError.message : 'Unknown error'}

What specific content from "${file.name}" would you like me to analyze if you can provide it in a different format?`,
        info: {
          slides: null,
          fileSize: file.size,
          fileName: file.name,
          extractionMethod: 'failed',
          error: pptError instanceof Error ? pptError.message : 'Unknown error'
        },
        success: false,
        error: 'PowerPoint parsing failed',
        metadata: {
          extractedContent: false,
          analysisReady: false,
          timestamp: new Date().toISOString(),
          requiresManualInput: true
        }
      }, { status: 200 });
    }

  } catch (error) {
    console.error('💥 PowerPoint extraction API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process PowerPoint file',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}
