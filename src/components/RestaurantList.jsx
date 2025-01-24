import React from 'react'
import { Typography } from '@mui/material'
import RestaurantCard from './RestaurantCard'

const RestaurantList = ({ restaurants }) => {
  if (restaurants.length === 0) {
    return (
      <Typography variant="body1" className="text-center text-gray-600 mt-8">
        Aucun restaurant trouvé dans ce périmètre
      </Typography>
    )
  }

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
      ))}
    </div>
  )
}

export default RestaurantList
