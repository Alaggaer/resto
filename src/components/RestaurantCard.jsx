import React from 'react'
import { Card, CardContent, Typography, Rating, Divider, Chip } from '@mui/material'
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa'

const RestaurantCard = ({ restaurant }) => {
  const positiveReviews = restaurant.reviews
    ?.filter((review) => review.rating >= 4)
    .slice(0, 3)
  
  const negativeReviews = restaurant.reviews
    ?.filter((review) => review.rating <= 2)
    .slice(0, 3)

  return (
    <Card className="shadow-lg">
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <Typography variant="h5" component="h2">
              {restaurant.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mt-1">
              {restaurant.formatted_address}
            </Typography>
            <div className="flex items-center mt-2">
              <Rating
                value={restaurant.rating}
                precision={0.1}
                readOnly
                size="small"
              />
              <span className="ml-2 text-sm">
                ({restaurant.user_ratings_total || 0} avis)
              </span>
            </div>
            <Chip
              label={`${Math.round(restaurant.distance)} m`}
              size="small"
              className="mt-2"
            />
          </div>
        </div>

        <Divider className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="h6" className="flex items-center mb-2">
              <FaThumbsUp className="mr-2 text-green-500" />
              Avis positifs
            </Typography>
            {positiveReviews?.map((review) => (
              <div key={review.time} className="mb-2">
                <Typography variant="body2" className="font-medium">
                  {review.author_name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {review.text}
                </Typography>
              </div>
            ))}
          </div>

          <div>
            <Typography variant="h6" className="flex items-center mb-2">
              <FaThumbsDown className="mr-2 text-red-500" />
              Avis négatifs
            </Typography>
            {negativeReviews?.map((review) => (
              <div key={review.time} className="mb-2">
                <Typography variant="body2" className="font-medium">
                  {review.author_name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {review.text}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RestaurantCard
