import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import to avoid compilation issues
    const pdfParse = await import('pdf-parse');
    
    // Extract text from PDF
    const data = await pdfParse.default(buffer);
    
    return NextResponse.json({
      text: data.text,
      info: {
        pages: data.numpages,
        info: data.info
      }
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract text from PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
