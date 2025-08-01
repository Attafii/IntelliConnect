import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    console.log('📊 Excel extraction API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if file is Excel format
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template' // .xltx
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error('❌ File is not an Excel file:', file.type);
      return NextResponse.json({ error: 'File must be an Excel file (.xlsx or .xls)' }, { status: 400 });
    }

    console.log(`📋 Processing Excel: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('🔍 Parsing Excel file...');
      
      // Parse Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer', cellText: true, cellDates: true });
      
      let extractedData = '';
      let totalCells = 0;
      let sheetCount = 0;
      
      // Process each worksheet
      workbook.SheetNames.forEach((sheetName, index) => {
        const worksheet = workbook.Sheets[sheetName];
        sheetCount++;
        
        // Convert sheet to JSON for analysis
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          defval: '',
          raw: false 
        });
        
        // Get sheet range for metadata
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
        const cellCount = (range.e.r - range.s.r + 1) * (range.e.c - range.s.c + 1);
        totalCells += cellCount;
        
        extractedData += `\n\n=== SHEET ${index + 1}: "${sheetName}" ===\n`;
        extractedData += `Dimensions: ${range.e.r - range.s.r + 1} rows × ${range.e.c - range.s.c + 1} columns\n`;
        extractedData += `Cell range: ${worksheet['!ref'] || 'Empty'}\n\n`;
        
        if (jsonData.length > 0) {
          // Show headers (first row)
          if (jsonData[0] && Array.isArray(jsonData[0])) {
            const headers = jsonData[0] as any[];
            extractedData += `HEADERS: ${headers.join(' | ')}\n\n`;
          }
          
          // Show sample data (first 20 rows)
          const sampleSize = Math.min(20, jsonData.length);
          extractedData += `SAMPLE DATA (first ${sampleSize} rows):\n`;
          
          for (let i = 0; i < sampleSize; i++) {
            const row = jsonData[i];
            if (Array.isArray(row)) {
              extractedData += `Row ${i + 1}: ${row.map(cell => 
                cell === null || cell === undefined ? '[EMPTY]' : String(cell)
              ).join(' | ')}\n`;
            }
          }
          
          if (jsonData.length > 20) {
            extractedData += `\n... (${jsonData.length - 20} more rows not shown)\n`;
          }
          
          // Basic statistics for numeric data
          const numericData = jsonData.slice(1).map((row: any) => {
            if (Array.isArray(row)) {
              return row.filter(cell => {
                const num = Number(cell);
                return !isNaN(num) && isFinite(num);
              }).map(Number);
            }
            return [];
          }).flat();
          
          if (numericData.length > 0) {
            const sum = numericData.reduce((a, b) => a + b, 0);
            const avg = sum / numericData.length;
            const min = Math.min(...numericData);
            const max = Math.max(...numericData);
            
            extractedData += `\nNUMERIC ANALYSIS:\n`;
            extractedData += `- Total numeric values: ${numericData.length}\n`;
            extractedData += `- Sum: ${sum.toLocaleString()}\n`;
            extractedData += `- Average: ${avg.toFixed(2)}\n`;
            extractedData += `- Range: ${min.toLocaleString()} to ${max.toLocaleString()}\n`;
          }
        } else {
          extractedData += 'Sheet appears to be empty\n';
        }
      });

      const finalText = `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
FILE TYPE: Excel Spreadsheet
SHEETS: ${sheetCount}
TOTAL CELLS: ${totalCells.toLocaleString()}
EXTRACTION DATE: ${new Date().toLocaleString()}

EXTRACTED CONTENT:
${extractedData}

---END OF DOCUMENT---`;

      console.log(`✅ Successfully processed Excel file with ${sheetCount} sheets`);
      
      return NextResponse.json({
        text: finalText,
        info: {
          sheets: sheetCount,
          totalCells: totalCells,
          fileSize: file.size,
          fileName: file.name,
          extractionMethod: 'xlsx',
          charactersExtracted: finalText.length
        },
        success: true,
        metadata: {
          extractedContent: true,
          analysisReady: true,
          timestamp: new Date().toISOString(),
          dataType: 'spreadsheet'
        }
      });

    } catch (excelError) {
      console.error('💥 Excel parsing error:', excelError);
      
      return NextResponse.json({
        text: `DOCUMENT: ${file.name}
FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB
EXTRACTION STATUS: Failed to parse Excel file

I was unable to extract data from this Excel file. This could be due to:

1. **File Corruption**: The Excel file may be damaged or corrupted
2. **Password Protection**: The file is encrypted or password protected
3. **Unsupported Format**: The file uses an unsupported Excel version or format
4. **Complex Features**: The file contains macros, pivot tables, or other complex features

TROUBLESHOOTING OPTIONS:
- Try opening and re-saving the file in Excel
- Remove password protection if applicable
- Save as a standard .xlsx format
- Export data as CSV if the Excel file won't process

ERROR DETAILS: ${excelError instanceof Error ? excelError.message : 'Unknown error'}

What specific data from "${file.name}" would you like me to analyze if you can provide it in a different format?`,
        info: {
          sheets: null,
          fileSize: file.size,
          fileName: file.name,
          extractionMethod: 'failed',
          error: excelError instanceof Error ? excelError.message : 'Unknown error'
        },
        success: false,
        error: 'Excel parsing failed',
        metadata: {
          extractedContent: false,
          analysisReady: false,
          timestamp: new Date().toISOString(),
          requiresManualInput: true
        }
      }, { status: 200 });
    }

  } catch (error) {
    console.error('💥 Excel extraction API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process Excel file',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}
