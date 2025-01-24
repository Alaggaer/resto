import React, { useState, useEffect } from 'react'
import { Container, Typography, TextField, Button, CircularProgress, Rating } from '@mui/material'
import axios from 'axios'
import orderBy from 'lodash.orderby'
import RestaurantCard from './components/RestaurantCard'

const API_KEY = 'AIzaSyB79fcZivzpCj4wrRc8ZRuNZhRcSQ2Qstg'

function App() {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState(1000)
  const [userPosition, setUserPosition] = useState(null)
  const [geoError, setGeoError] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)

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

    setLoading(true)
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&key=${API_KEY}`
      )
      
      const restaurantsWithDetails = await Promise.all(
        response.data.results.map(async (restaurant) => {
          const detailsResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,rating,reviews,formatted_address,geometry&key=${API_KEY}`
          )
          return {
            ...restaurant,
            ...detailsResponse.data.result,
            distance: calculateDistance(
              userPosition.lat,
              userPosition.lng,
              detailsResponse.data.result.geometry.location.lat,
              detailsResponse.data.result.geometry.location.lng
            )
          }
        })
      )

      setRestaurants(orderBy(restaurantsWithDetails, ['distance']))
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      setGeoError('Une erreur est survenue lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c * 1000 // Distance en mètres
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
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          className="w-32"
        />
        
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          className="h-14"
        >
          {loading ? <CircularProgress size={24} /> : 'Rechercher'}
        </Button>
      </div>
      
      <div className="space-y-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
        ))}
      </div>
    </Container>
  )
}

export default App
