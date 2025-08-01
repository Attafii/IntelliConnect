import { NextRequest, NextResponse } from 'next/server';
import * as pdfjs from 'pdfjs-dist';
import Papa from 'papaparse';
import { aiService } from '@/lib/aiService';

// Set up PDF.js worker for server-side usage
if (typeof globalThis !== 'undefined' && !globalThis.navigator) {
  // Server-side environment setup for PDF.js
  const { createCanvas } = require('canvas');
  globalThis.HTMLCanvasElement = createCanvas().constructor;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Basic validation for file type (can be more robust)
    if (file.type !== 'text/csv' && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Only CSV and PDF are allowed.' }, { status: 400 });
    }

    // In a real application, you would process the file here:
    // 1. Save it to a temporary location or cloud storage.
    // 2. Parse CSV or extract text from PDF.
    // 3. Perform analysis (e.g., using a GenAI model or custom logic).
    // 4. Return the structured summary and insights.

    console.log(`Received file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

    // For now, return a mock success response with some extracted data
    // This should match the structure expected by the frontend
    const mockSummary = {
        projectName: `Processed: ${file.name}`,
        timeline: 'Q1 2025 - Q4 2025',
        milestones: ['Project Kick-off', 'Phase 1 Delivery', 'Final Review'],
        tasks: [
          { name: 'Initial Analysis', status: 'Pending', assignee: 'AI Bot', deadline: '2025-01-15' },
          { name: 'Data Extraction', status: 'Pending', assignee: 'AI Bot', deadline: '2025-01-30' },
        ],
        resources: 'Automated Analysis Engine',
        budgetVsActual: 'N/A / N/A (Pending Full Analysis)',
        risks: ['Data parsing might encounter unforeseen issues.'],
      };

    const mockInsights = [
        { id: 'pred_1', title: 'Initial Scan Complete', description: 'File received and basic structure identified.', type: 'opportunity' },
      ];

    return NextResponse.json({ summary: mockSummary, insights: mockInsights }, { status: 200 });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Failed to process file.', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}