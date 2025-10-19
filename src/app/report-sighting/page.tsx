'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, Camera, MapPin, Phone, Mail, User, AlertCircle, CheckCircle, Search, Eye } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ReportSighting() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    animalType: '',
    animalSize: '',
    animalColor: '',
    description: '',
    location: '',
    sightingDate: '',
    sightingTime: '',
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    sightingType: '',
    additionalInfo: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [nearbyLostPets, setNearbyLostPets] = useState([])
  const [showMatchingPets, setShowMatchingPets] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Aquí podrías usar una API de geocodificación para obtener la dirección
          setUserLocation('Ubicación actual detectada')
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Si se cambia la ubicación, buscar mascotas perdidas cercanas
    if (field === 'location' && value.length > 3) {
      searchNearbyLostPets(value)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        // Después de cargar la imagen, buscar coincidencias
        searchImageMatches(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const searchNearbyLostPets = async (location) => {
    try {
      const response = await fetch(`/api/pets/lost?location=${encodeURIComponent(location)}`)
      if (response.ok) {
        const pets = await response.json()
        setNearbyLostPets(pets.slice(0, 5)) // Mostrar máximo 5 resultados
      }
    } catch (error) {
      console.error('Error searching nearby pets:', error)
    }
  }

  const searchImageMatches = async (imageData) => {
    try {
      // Aquí implementaríamos la comparación con IA
      // Por ahora, simulamos la búsqueda
      const response = await fetch('/api/sightings/image-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      })
      
      if (response.ok) {
        const matches = await response.json()
        if (matches.length > 0) {
          setShowMatchingPets(true)
        }
      }
    } catch (error) {
      console.error('Error searching image matches:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      // Subir imagen primero
      let imageUrl = ''
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        }
      }

      // Enviar datos del formulario
      const response = await fetch('/api/sightings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          latitude: userLocation ? 'current_lat' : null,
          longitude: userLocation ? 'current_lng' : null
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        // Resetear formulario
        setFormData({
          animalType: '',
          animalSize: '',
          animalColor: '',
          description: '',
          location: '',
          sightingDate: '',
          sightingTime: '',
          reporterName: '',
          reporterEmail: '',
          reporterPhone: '',
          sightingType: '',
          additionalInfo: ''
        })
        setImageFile(null)
        setImagePreview('')
        setNearbyLostPets([])
        setShowMatchingPets(false)
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reportar Avistamiento</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ayuda a encontrar mascotas perdidas reportando avistamientos. Tu información puede ser clave para reunir a una mascota con su familia.
          </p>
        </div>

        {/* Mascotas perdidas cercanas */}
        {nearbyLostPets.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Mascotas Perdidas en esta Zona
              </CardTitle>
              <CardDescription className="text-orange-700">
                Estas mascotas han sido reportadas como perdidas cerca de esta ubicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyLostPets.map((pet) => (
                  <div key={pet.id} className="flex gap-3 p-3 bg-white rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {pet.imageUrl && (
                        <Image
                          src={pet.imageUrl}
                          alt={pet.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{pet.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">{pet.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {pet.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Información del Avistamiento
            </CardTitle>
            <CardDescription>
              Proporciona todos los detalles que puedas sobre el animal que viste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto del animal */}
              <div>
                <Label className="text-base font-medium">Foto del Animal</Label>
                <div className="mt-2">
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Foto
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Una foto clara ayuda mucho en la identificación
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipo de avistamiento */}
              <div>
                <Label htmlFor="sightingType">Tipo de Avistamiento *</Label>
                <Select value={formData.sightingType} onValueChange={(value) => handleInputChange('sightingType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de avistamiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo-animal">Animal visto solo (sospecha de pérdida)</SelectItem>
                    <SelectItem value="resembles-lost">Se parece a una mascota perdida que conozco</SelectItem>
                    <SelectItem value="with-owner">Con posible dueño (verificar si está perdido)</SelectItem>
                    <SelectItem value="in-danger">Animal en situación de peligro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Información del animal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="animalType">Tipo de Animal *</Label>
                  <Select value={formData.animalType} onValueChange={(value) => handleInputChange('animalType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perro">Perro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                      <SelectItem value="ave">Ave</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="animalSize">Tamaño</Label>
                  <Select value={formData.animalSize} onValueChange={(value) => handleInputChange('animalSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeño">Pequeño</SelectItem>
                      <SelectItem value="mediano">Mediano</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="animalColor">Color Principal *</Label>
                  <Input
                    id="animalColor"
                    value={formData.animalColor}
                    onChange={(e) => handleInputChange('animalColor', e.target.value)}
                    required
                    placeholder="Ej: Marrón, Negro, Blanco"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Ubicación del Avistamiento *</Label>
                  <div className="relative">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                      placeholder="Calle, colonia, ciudad"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => {
                        if (userLocation) {
                          handleInputChange('location', userLocation)
                        }
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="sightingDate">Fecha del Avistamiento *</Label>
                  <Input
                    id="sightingDate"
                    type="date"
                    value={formData.sightingDate}
                    onChange={(e) => handleInputChange('sightingDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sightingTime">Hora del Avistamiento</Label>
                  <Input
                    id="sightingTime"
                    type="time"
                    value={formData.sightingTime}
                    onChange={(e) => handleInputChange('sightingTime', e.target.value)}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">Descripción Detallada *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe el comportamiento del animal, si parecía asustado, herido, si tenía collar, etc."
                />
              </div>

              {/* Información del reportero */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Tu Información (Opcional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reporterName">Tu Nombre</Label>
                    <Input
                      id="reporterName"
                      value={formData.reporterName}
                      onChange={(e) => handleInputChange('reporterName', e.target.value)}
                      placeholder="Nombre completo (opcional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporterEmail">Correo Electrónico</Label>
                    <Input
                      id="reporterEmail"
                      type="email"
                      value={formData.reporterEmail}
                      onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                      placeholder="correo@ejemplo.com (opcional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporterPhone">Teléfono</Label>
                    <Input
                      id="reporterPhone"
                      value={formData.reporterPhone}
                      onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                      placeholder="+52 123 456 7890 (opcional)"
                    />
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div>
                <Label htmlFor="additionalInfo">Información Adicional</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  rows={3}
                  placeholder="Cualquier otro detalle que consideres importante"
                />
              </div>

              {/* Alertas */}
              {submitStatus === 'success' && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ¡Avistamiento reportado con éxito! Redirigiendo al inicio...
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === 'error' && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Hubo un error al enviar el reporte. Por favor intenta nuevamente.
                  </AlertDescription>
                </Alert>
              )}

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Avistamiento'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}