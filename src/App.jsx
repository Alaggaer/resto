import React, { useState, useEffect } from 'react'
import { Container, Typography, Alert } from '@mui/material'
import axios from 'axios'
import orderBy from 'lodash.orderby'
import SearchBar from './components/SearchBar'
import SortControls from './components/SortControls'
import RestaurantList from './components/RestaurantList'

const API_KEY = 'AIzaSyB79fcZivzpCj4wrRc8ZRuNZhRcSQ2Qstg'

function App() {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState(1000)
  const [userPosition, setUserPosition] = useState(null)
  const [geoError, setGeoError] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('distance')
  const [error, setError] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserPosition({ lat: latitude, lng: longitude })
          setLocation(`${latitude},${longitude}`)
          setGeoError('')
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
      setError('Veuillez entrer une position ou autoriser la géolocalisation')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&key=${API_KEY}`
      )
      
      if (!response.data.results.length) {
        setRestaurants([])
        setError('Aucun restaurant trouvé dans ce périmètre')
        return
      }

      const restaurantsWithDetails = await Promise.all(
        response.data.results.map(async (restaurant) => {
          const detailsResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,rating,reviews,formatted_address,geometry,user_ratings_total&key=${API_KEY}`
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

      setRestaurants(sortRestaurants(restaurantsWithDetails, sortBy))
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      setError('Une erreur est survenue lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c * 1000
  }

  const sortRestaurants = (restaurantList, sortType) => {
    switch (sortType) {
      case 'distance':
        return orderBy(restaurantList, ['distance'])
      case 'rating':
        return orderBy(restaurantList, ['rating'], ['desc'])
      case 'reviews':
        return orderBy(restaurantList, ['user_ratings_total'], ['desc'])
      default:
        return restaurantList
    }
  }

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy)
    setRestaurants(sortRestaurants([...restaurants], newSortBy))
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h3" component="h1" className="mb-6 text-center">
        Trouvez des restaurants près de chez vous
      </Typography>
      
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      <SearchBar
        location={location}
        radius={radius}
        onLocationChange={setLocation}
        onRadiusChange={setRadius}
        onSearch={handleSearch}
        loading={loading}
        geoError={geoError}
      />
      
      {restaurants.length > 0 && (
        <SortControls
          sortBy={sortBy}
          onSortChange={handleSort}
        />
      )}
      
      <RestaurantList restaurants={restaurants} />
    </Container>
  )
}

export default App
