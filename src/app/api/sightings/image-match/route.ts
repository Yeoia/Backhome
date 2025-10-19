import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }
    
    // Obtener todas las mascotas perdidas activas con imágenes
    const lostPets = await db.lostPet.findMany({
      where: {
        status: 'active',
        imageUrl: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    if (lostPets.length === 0) {
      return NextResponse.json([])
    }
    
    // Usar IA para comparar imágenes
    const zai = await ZAI.create()
    
    const matches = []
    
    for (const lostPet of lostPets) {
      try {
        // Comparar la imagen del avistamiento con la imagen de la mascota perdida
        const comparison = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Eres un experto en identificación de mascotas. Compara dos imágenes de animales y determina la probabilidad de que sean el mismo animal. 
              
              Responde ÚNICAMENTE con un número entre 0 y 1, donde:
              - 0 = definitivamente no son el mismo animal
              - 0.5 = posible coincidencia
              - 1 = definitivamente el mismo animal
              
              Considera: color, tamaño, patas, marcas distintivas, raza, y características faciales.`
            },
            {
              role: 'user',
              content: `Compara estas dos imágenes de mascotas y dame un score de similitud:
              
              Imagen 1 (nuevo avistamiento): ${image.substring(0, 100)}...
              Imagen 2 (mascota perdida): ${lostPet.petName} - ${lostPet.description}`
            }
          ],
          temperature: 0.1,
          max_tokens: 10
        })
        
        const confidenceText = comparison.choices[0]?.message?.content?.trim()
        const confidence = parseFloat(confidenceText)
        
        if (!isNaN(confidence) && confidence >= 0.6) {
          matches.push({
            lostPet,
            confidence,
            reason: 'Coincidencia detectada por análisis de imagen'
          })
        }
      } catch (error) {
        console.error(`Error comparing with pet ${lostPet.id}:`, error)
        continue
      }
    }
    
    // Ordenar por confianza
    matches.sort((a, b) => b.confidence - a.confidence)
    
    // Guardar coincidencias en la base de datos
    for (const match of matches) {
      try {
        // Buscar si ya existe un sighting para esta imagen (simplificado)
        const recentSighting = await db.sighting.findFirst({
          where: {
            createdAt: {
              gte: new Date(new Date().getTime() - 5 * 60 * 1000) // Últimos 5 minutos
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        if (recentSighting) {
          await db.match.create({
            data: {
              lostPetId: match.lostPet.id,
              sightingId: recentSighting.id,
              confidence: match.confidence,
              status: 'pending',
              notes: match.reason
            }
          })
        }
      } catch (error) {
        console.error('Error saving match:', error)
      }
    }
    
    return NextResponse.json(matches.slice(0, 5)) // Devolver máximo 5 coincidencias
  } catch (error) {
    console.error('Error in image matching:', error)
    return NextResponse.json(
      { error: 'Error in image matching process' },
      { status: 500 }
    )
  }
}