'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Camera, MapPin, Phone, Mail, User, AlertCircle, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ReportLostPet() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    petBreed: '',
    petSize: '',
    petColor: '',
    petAge: '',
    description: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    location: '',
    lostDate: '',
    additionalInfo: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const fileInputRef = useRef(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
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
      const response = await fetch('/api/pets/lost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        // Resetear formulario
        setFormData({
          petName: '',
          petType: '',
          petBreed: '',
          petSize: '',
          petColor: '',
          petAge: '',
          description: '',
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
          location: '',
          lostDate: '',
          additionalInfo: ''
        })
        setImageFile(null)
        setImagePreview('')
        
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reportar Mascota Perdida</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Proporciona la información más detallada posible para aumentar las posibilidades de encontrar a tu mascota.
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información de la Mascota
            </CardTitle>
            <CardDescription>
              Cuéntanos sobre tu mascota perdida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto de la mascota */}
              <div>
                <Label className="text-base font-medium">Foto de la Mascota</Label>
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
                        Formatos: JPG, PNG, GIF. Máximo 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="petName">Nombre de la Mascota *</Label>
                  <Input
                    id="petName"
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    required
                    placeholder="Ej: Max, Luna, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="petType">Tipo de Mascota *</Label>
                  <Select value={formData.petType} onValueChange={(value) => handleInputChange('petType', value)}>
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
                  <Label htmlFor="petBreed">Raza</Label>
                  <Input
                    id="petBreed"
                    value={formData.petBreed}
                    onChange={(e) => handleInputChange('petBreed', e.target.value)}
                    placeholder="Ej: Labrador, Siames, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="petSize">Tamaño</Label>
                  <Select value={formData.petSize} onValueChange={(value) => handleInputChange('petSize', value)}>
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
                  <Label htmlFor="petColor">Color Principal *</Label>
                  <Input
                    id="petColor"
                    value={formData.petColor}
                    onChange={(e) => handleInputChange('petColor', e.target.value)}
                    required
                    placeholder="Ej: Marrón, Negro, Blanco"
                  />
                </div>
                <div>
                  <Label htmlFor="petAge">Edad Aproximada</Label>
                  <Input
                    id="petAge"
                    value={formData.petAge}
                    onChange={(e) => handleInputChange('petAge', e.target.value)}
                    placeholder="Ej: 2 años, 6 meses"
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
                  placeholder="Describe características especiales, marcas, comportamiento, etc."
                />
              </div>

              {/* Información del dueño */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Tu Nombre *</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      required
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerEmail">Correo Electrónico *</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerPhone">Teléfono *</Label>
                    <Input
                      id="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                      required
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                </div>
              </div>

              {/* Información de la pérdida */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Información de la Pérdida
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Ubicación donde se perdió *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                      placeholder="Calle, colonia, ciudad"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lostDate">Fecha de la pérdida *</Label>
                    <Input
                      id="lostDate"
                      type="date"
                      value={formData.lostDate}
                      onChange={(e) => handleInputChange('lostDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="additionalInfo">Información Adicional</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    rows={3}
                    placeholder="Circunstancias de la pérdida, lugares donde suele ir, etc."
                  />
                </div>
              </div>

              {/* Alertas */}
              {submitStatus === 'success' && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ¡Reporte enviado con éxito! Redirigiendo al inicio...
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
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
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