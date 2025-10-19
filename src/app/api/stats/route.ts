import { NextRequest, NextResponse } from 'next/server'
import { statsService } from '@/lib/firestore'

export async function GET() {
  try {
    const stats = await statsService.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error fetching statistics' },
      { status: 500 }
    )
  }
}