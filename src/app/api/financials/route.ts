import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'src', 'app', 'data');
    const filePath = path.join(jsonDirectory, 'financials.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading financials data:', error);
    return NextResponse.json({ message: 'Error fetching financials data' }, { status: 500 });
  }
}