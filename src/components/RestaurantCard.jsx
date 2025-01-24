import React from 'react'
import { Card, CardContent, Typography, Rating, Divider, Chip } from '@mui/material'
import { FaStar, FaThumbsUp, FaThumbsDown, FaMapMarkerAlt } from 'react-icons/fa'

const RestaurantCard = ({ restaurant }) => {
  const positiveReviews = restaurant.reviews
    ?.filter((review) => review.rating >= 4)
    .slice(0, 3) || []
  
  const negativeReviews = restaurant.reviews
    ?.filter((review) => review.rating <= 2)
    .slice(0, 3) || []

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-grow">
            <Typography variant="h5" component="h2" className="font-bold">
              {restaurant.name}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" className="mt-1 flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {restaurant.formatted_address}
            </Typography>
            
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <Rating
                  value={restaurant.rating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <span className="ml-2 text-sm text-gray-600">
                  ({restaurant.user_ratings_total || 0} avis)
                </span>
              </div>
              
              <Chip
                icon={<FaMapMarkerAlt />}
                label={`${Math.round(restaurant.distance)} m`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Typography variant="h6" className="flex items-center mb-3 text-green-600">
              <FaThumbsUp className="mr-2" />
              Avis positifs
            </Typography>
            {positiveReviews.length > 0 ? (
              positiveReviews.map((review, index) => (
                <div key={index} className="mb-3 p-2 bg-green-50 rounded">
                  <div className="flex items-center mb-1">
                    <Typography variant="body2" className="font-medium">
                      {review.author_name}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly className="ml-2" />
                  </div>
                  <Typography variant="body2" className="text-gray-600">
                    {review.text}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2" className="text-gray-500 italic">
                Aucun avis positif disponible
              </Typography>
            )}
          </div>

          <div>
            <Typography variant="h6" className="flex items-center mb-3 text-red-600">
              <FaThumbsDown className="mr-2" />
              Avis négatifs
            </Typography>
            {negativeReviews.length > 0 ? (
              negativeReviews.map((review, index) => (
                <div key={index} className="mb-3 p-2 bg-red-50 rounded">
                  <div className="flex items-center mb-1">
                    <Typography variant="body2" className="font-medium">
                      {review.author_name}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly className="ml-2" />
                  </div>
                  <Typography variant="body2" className="text-gray-600">
                    {review.text}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2" className="text-gray-500 italic">
                Aucun avis négatif disponible
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RestaurantCard
