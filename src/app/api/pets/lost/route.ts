import { NextRequest, NextResponse } from 'next/server'
import { lostPetsService } from '@/lib/firestore'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const lostPets = await lostPetsService.getAll(limit)
    return NextResponse.json(lostPets)
  } catch (error) {
    console.error('Error fetching lost pets:', error)
    return NextResponse.json(
      { error: 'Error fetching lost pets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const petData = await request.json()
    const petId = await lostPetsService.create(petData)
    
    return NextResponse.json({ 
      message: 'Lost pet created successfully', 
      id: petId 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating lost pet:', error)
    return NextResponse.json(
      { error: 'Error creating lost pet' },
      { status: 500 }
    )
  }
}