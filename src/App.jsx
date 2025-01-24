import React, { useState, useEffect } from 'react'
import { Container, Typography, TextField, Button } from '@mui/material'

function App() {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState(1000)
  const [userPosition, setUserPosition] = useState(null)
  const [geoError, setGeoError] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserPosition({ lat: latitude, lng: longitude })
          setLocation(`${latitude},${longitude}`)
        },
        (error) => {
          setGeoError('Impossible d\'obtenir votre position. Veuillez entrer une adresse manuellement.')
        }
      )
    } else {
      setGeoError('La géolocalisation n\'est pas supportée par votre navigateur.')
    }
  }, [])

  const handleSearch = async () => {
    if (!userPosition && !location) {
      setGeoError('Veuillez entrer une position ou autoriser la géolocalisation')
      return
    }
    // Implémentation de la recherche
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h3" component="h1" className="mb-4">
        Trouvez des restaurants près de chez vous
      </Typography>
      
      {geoError && (
        <Typography color="error" className="mb-4">
          {geoError}
        </Typography>
      )}
      
      <div className="flex gap-4 mb-8">
        <TextField
          label="Votre position"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          placeholder="Entrez une adresse ou utilisez la géolocalisation"
        />
        
        <TextField
          label="Rayon (mètres)"
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        
        <Button
          variant="contained"
          onClick={handleSearch}
          className="h-14"
        >
          Rechercher
        </Button>
      </div>
      
      {/* Section des résultats */}
    </Container>
  )
}

export default App
