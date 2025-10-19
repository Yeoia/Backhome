'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, MapPin, Camera, Search, Users, AlertCircle, CheckCircle, Menu, X, PawPrint } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AuthButton } from '@/components/auth/AuthButton'
import { useAuth } from '@/contexts/AuthContext'
import { lostPetsService, sightingsService, statsService } from '@/lib/firestore'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [lostPets, setLostPets] = useState([])
  const [sightings, setSightings] = useState([])
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    activeCases: 0
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    // Cargar datos iniciales
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setDataLoading(true)
      
      // Check if Firebase is available
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        console.warn('Firebase API key not found, using mock data')
        throw new Error('Firebase not configured')
      }
      
      // Cargar mascotas perdidas
      const lostData = await lostPetsService.getAll(6)
      setLostPets(lostData)

      // Cargar avistamientos
      const sightingsData = await sightingsService.getAll(6)
      setSightings(sightingsData)

      // Cargar estadísticas
      const statsData = await statsService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading initial data:', error)
      // Set mock data for demonstration
      setStats({
        totalLost: 12,
        totalFound: 8,
        activeCases: 4
      })
      
      // Mock lost pets data
      setLostPets([
        {
          id: '1',
          petName: 'Max',
          description: 'Golden Retriever, amigable y juguetón',
          location: 'Parque Central',
          imageUrl: null
        },
        {
          id: '2',
          petName: 'Luna',
          description: 'Gata siamesa, collar rojo con cascabel',
          location: 'Zona Norte',
          imageUrl: null
        },
        {
          id: '3',
          petName: 'Charlie',
          description: 'Beagle, se asusta fácilmente con ruidos fuertes',
          location: 'Centro Ciudad',
          imageUrl: null
        }
      ])
      
      // Mock sightings data
      setSightings([
        {
          id: '1',
          description: 'Perro pequeño corriendo cerca del parque',
          location: 'Plaza Mayor',
          sightingType: 'dog',
          imageUrl: null
        },
        {
          id: '2',
          description: 'Gato negro subido a un árbol',
          location: 'Jardín Botánico',
          sightingType: 'cat',
          imageUrl: null
        },
        {
          id: '3',
          description: 'Mascota desconocida en la zona comercial',
          location: 'Centro Comercial',
          sightingType: 'other',
          imageUrl: null
        }
      ])
    } finally {
      setDataLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Regresa! Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-orange-500">¡Regresa!</h1>
                <p className="text-sm text-brown-600">Ayúdalo a volver a casa</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setActiveTab('overview')}>
                Inicio
              </Button>
              <Button variant="ghost" onClick={() => router.push('/report-lost')}>
                Reportar Pérdida
              </Button>
              <Button variant="ghost" onClick={() => router.push('/report-sighting')}>
                Reportar Avistamiento
              </Button>
              <Button variant="ghost" onClick={() => router.push('/map')}>
                Mapa
              </Button>
              <AuthButton />
            </nav>
            <Button 
              variant="ghost" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('overview')
                  setMobileMenuOpen(false)
                }}
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  router.push('/report-lost')
                  setMobileMenuOpen(false)
                }}
              >
                Reportar Pérdida
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  router.push('/report-sighting')
                  setMobileMenuOpen(false)
                }}
              >
                Reportar Avistamiento
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  router.push('/map')
                  setMobileMenuOpen(false)
                }}
              >
                Mapa
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ayuda a encontrar mascotas perdidas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Una comunidad unida para reunir a las mascotas con sus familias. 
            Reporta avistamientos y mascotas perdidas para ayudar a que regresen a casa.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {dataLoading ? (
            <>
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PawPrint className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">--</div>
                  <div className="text-gray-600">Mascotas Perdidas</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PawPrint className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">--</div>
                  <div className="text-gray-600">Mascotas Encontradas</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">--</div>
                  <div className="text-gray-600">Casos Activos</div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <PawPrint className="w-8 h-8 text-red-200 absolute" />
                    <AlertCircle className="w-4 h-4 text-red-600 relative z-10" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalLost}</div>
                  <div className="text-gray-600">Mascotas Perdidas</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <PawPrint className="w-8 h-8 text-green-200 absolute" />
                    <CheckCircle className="w-4 h-4 text-green-600 relative z-10" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalFound}</div>
                  <div className="text-gray-600">Mascotas Encontradas</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.activeCases}</div>
                  <div className="text-gray-600">Casos Activos</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">¿Perdiste tu mascota?</h3>
                  <p className="text-white/80">Reporta la pérdida inmediatamente</p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-white text-red-500 hover:bg-gray-100"
                onClick={() => router.push('/report-lost')}
              >
                Reportar Pérdida
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">¿Viste una mascota perdida?</h3>
                  <p className="text-white/80">Ayuda a encontrar a su familia</p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-white text-blue-500 hover:bg-gray-100"
                onClick={() => router.push('/report-sighting')}
              >
                Reportar Avistamiento
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Actividad Reciente</TabsTrigger>
            <TabsTrigger value="lost-pets">Mascotas Perdidas</TabsTrigger>
            <TabsTrigger value="sightings">Avistamientos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Mascotas Perdidas Recientes
                </h3>
                <div className="space-y-4">
                  {dataLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : lostPets.length > 0 ? (
                    lostPets.slice(0, 3).map((pet) => (
                      <Card key={pet.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {pet.imageUrl && (
                                <Image
                                  src={pet.imageUrl}
                                  alt={pet.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{pet.petName}</h4>
                              <p className="text-sm text-gray-600 mb-2">{pet.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {pet.location}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500">No hay mascotas perdidas reportadas recientemente</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  Avistamientos Recientes
                </h3>
                <div className="space-y-4">
                  {dataLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : sightings.length > 0 ? (
                    sightings.slice(0, 3).map((sighting) => (
                      <Card key={sighting.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {sighting.imageUrl && (
                                <Image
                                  src={sighting.imageUrl}
                                  alt="Avistamiento"
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Avistamiento {sighting.id}</h4>
                              <p className="text-sm text-gray-600 mb-2">{sighting.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {sighting.location}
                              </div>
                              <Badge variant="secondary" className="mt-2">
                                {sighting.sightingType}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500">No hay avistamientos reportados recientemente</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lost-pets" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataLoading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square bg-gray-200 animate-pulse"></div>
                      <CardContent className="p-4">
                        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : lostPets.length > 0 ? (
                lostPets.map((pet) => (
                  <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200 relative">
                      {pet.imageUrl && (
                        <Image
                          src={pet.imageUrl}
                          alt={pet.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        Perdido
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{pet.petName}</h3>
                      <p className="text-gray-600 text-sm mb-3">{pet.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {pet.location}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-500">No hay mascotas perdidas reportadas</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sightings" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataLoading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square bg-gray-200 animate-pulse"></div>
                      <CardContent className="p-4">
                        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : sightings.length > 0 ? (
                sightings.map((sighting) => (
                  <Card key={sighting.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200 relative">
                      {sighting.imageUrl && (
                        <Image
                          src={sighting.imageUrl}
                          alt="Avistamiento"
                          fill
                          className="object-cover"
                        />
                      )}
                      <Badge className="absolute top-2 right-2 bg-blue-500">
                        {sighting.sightingType}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Avistamiento #{sighting.id}</h3>
                      <p className="text-gray-600 text-sm mb-3">{sighting.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {sighting.location}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-500">No hay avistamientos reportados</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Regresa! Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Regresa!</h3>
          </div>
          <p className="text-gray-400">
            Unidos para que ninguna mascota se quede sin encontrar su camino a casa.
          </p>
        </div>
      </footer>
    </div>
  )
}