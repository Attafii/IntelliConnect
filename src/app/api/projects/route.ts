import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    // Construct the absolute path to the JSON file
    const jsonDirectory = path.join(process.cwd(), 'src', 'app', 'data');
    const filePath = path.join(jsonDirectory, 'projects.json');
    
    // Read the file content
    const fileContents = await fs.readFile(filePath, 'utf8');
    
    // Parse the JSON data
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading projects data:', error);
    return NextResponse.json({ message: 'Error fetching projects data' }, { status: 500 });
  }
}