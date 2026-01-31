import { bqClient } from '../data/route'; // Fix importing const bqClient
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `
      SELECT ticker, ex_date, amount 
      FROM \`${process.env.BQ_PROJECT_ID}.asx_data.dividends\` 
      ORDER BY ex_date DESC LIMIT 100
    `;
    
    const [rows] = await bqClient.query(query);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}