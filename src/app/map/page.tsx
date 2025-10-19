'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Filter, Search, AlertCircle, Eye, Navigation, Calendar, Clock } from 'lucide-react'
import Image from 'next/image'

// Componente simulado del mapa (en producción usaríamos una librería como Leaflet o Google Maps)
function MapComponent({ markers, onMarkerClick }) {
  return (
    <div className="relative w-full h-96 md:h-[600px] bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
      {/* Simulación de mapa */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm">
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar ubicación..."
                className="border-none focus:ring-0"
              />
            </div>
          </div>
        </div>
        
        {/* Marcadores simulados */}
        {markers.map((marker, index) => (
          <div
            key={marker.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index * 10)}%`
            }}
            onClick={() => onMarkerClick(marker)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
              marker.type === 'lost' ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              {marker.type === 'lost' ? (
                <AlertCircle className="w-4 h-4 text-white" />
              ) : (
                <Eye className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs bg-white px-2 py-1 rounded shadow text-gray-700">
                {marker.title}
              </span>
            </div>
          </div>
        ))}
        
        {/* Controles del mapa */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="outline" className="bg-white shadow-lg">
            <Navigation className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white shadow-lg">
            +
          </Button>
          <Button size="sm" variant="outline" className="bg-white shadow-lg">
            -
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [lostPets, setLostPets] = useState([])
  const [sightings, setSightings] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    animalType: '',
    dateRange: '',
    status: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [activeTab, lostPets, sightings, filters])

  const loadData = async () => {
    try {
      // Cargar mascotas perdidas
      const lostResponse = await fetch('/api/pets/lost')
      if (lostResponse.ok) {
        const lostData = await lostResponse.json()
        setLostPets(lostData.map(pet => ({
          ...pet,
          type: 'lost',
          title: pet.name,
          lat: 19.4326 + Math.random() * 0.1,
          lng: -99.1332 + Math.random() * 0.1
        })))
      }

      // Cargar avistamientos
      const sightingsResponse = await fetch('/api/sightings')
      if (sightingsResponse.ok) {
        const sightingsData = await sightingsResponse.json()
        setSightings(sightingsData.map(sighting => ({
          ...sighting,
          type: 'sighting',
          title: `Avistamiento #${sighting.id}`,
          lat: 19.4326 + Math.random() * 0.1,
          lng: -99.1332 + Math.random() * 0.1
        })))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const applyFilters = () => {
    let data = []
    
    if (activeTab === 'all' || activeTab === 'lost') {
      data = [...data, ...lostPets]
    }
    if (activeTab === 'all' || activeTab === 'sightings') {
      data = [...data, ...sightings]
    }

    // Aplicar filtros adicionales
    if (filters.animalType) {
      data = data.filter(item => 
        item.petType === filters.animalType || item.animalType === filters.animalType
      )
    }

    setFilteredData(data)
  }

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Mapa de Avistamientos</h1>
            </div>
            <Button onClick={() => window.history.back()}>
              Regresar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel lateral */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Animal</label>
                  <Select value={filters.animalType} onValueChange={(value) => handleFilterChange('animalType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="perro">Perros</SelectItem>
                      <SelectItem value="gato">Gatos</SelectItem>
                      <SelectItem value="ave">Aves</SelectItem>
                      <SelectItem value="otro">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Rango de Fecha</label>
                  <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cualquier fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Cualquier fecha</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mascotas Perdidas</span>
                  <Badge variant="destructive">{lostPets.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avistamientos</span>
                  <Badge variant="secondary">{sightings.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Marcadores</span>
                  <Badge variant="outline">{filteredData.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Detalles del marcador seleccionado */}
            {selectedMarker && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedMarker.type === 'lost' ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-blue-500" />
                    )}
                    {selectedMarker.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedMarker.imageUrl && (
                    <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={selectedMarker.imageUrl}
                        alt={selectedMarker.title}
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedMarker.location}</span>
                    </div>
                    
                    {selectedMarker.lostDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(selectedMarker.lostDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {selectedMarker.sightingTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{selectedMarker.sightingTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {selectedMarker.description}
                  </p>
                  
                  <Button size="sm" className="w-full">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mapa y contenido principal */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="lost">Mascotas Perdidas</TabsTrigger>
                <TabsTrigger value="sightings">Avistamientos</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Mapa Interactivo</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Perdidos
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Avistamientos
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Haz clic en los marcadores para ver más detalles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MapComponent 
                      markers={filteredData} 
                      onMarkerClick={handleMarkerClick}
                    />
                  </CardContent>
                </Card>

                {/* Lista de resultados */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Resultados ({filteredData.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredData.map((item) => (
                      <Card 
                        key={item.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedMarker(item)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {item.imageUrl && (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.title}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{item.title}</h4>
                                <Badge variant={item.type === 'lost' ? 'destructive' : 'secondary'} className="text-xs">
                                  {item.type === 'lost' ? 'Perdido' : 'Avistamiento'}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}