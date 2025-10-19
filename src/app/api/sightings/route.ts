import { NextRequest, NextResponse } from 'next/server'
import { sightingsService } from '@/lib/firestore'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const sightings = await sightingsService.getAll(limit)
    return NextResponse.json(sightings)
  } catch (error) {
    console.error('Error fetching sightings:', error)
    return NextResponse.json(
      { error: 'Error fetching sightings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sightingData = await request.json()
    const sightingId = await sightingsService.create(sightingData)
    
    return NextResponse.json({ 
      message: 'Sighting created successfully', 
      id: sightingId 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating sighting:', error)
    return NextResponse.json(
      { error: 'Error creating sighting' },
      { status: 500 }
    )
  }
}