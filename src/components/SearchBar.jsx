import React from 'react'
import { TextField, Button, CircularProgress } from '@mui/material'
import { FaSearch } from 'react-icons/fa'

const SearchBar = ({ 
  location, 
  radius, 
  onLocationChange, 
  onRadiusChange, 
  onSearch, 
  loading,
  geoError 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <TextField
        label="Votre position"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        fullWidth
        error={!!geoError}
        helperText={geoError}
        placeholder="Entrez une adresse ou utilisez la géolocalisation"
        className="flex-grow"
      />
      
      <TextField
        label="Rayon de recherche"
        type="number"
        value={radius}
        onChange={(e) => onRadiusChange(e.target.value)}
        className="w-40"
        InputProps={{
          endAdornment: <span className="text-gray-500">m</span>
        }}
      />
      
      <Button
        variant="contained"
        onClick={onSearch}
        disabled={loading}
        className="h-14 min-w-[120px]"
        startIcon={loading ? <CircularProgress size={20} /> : <FaSearch />}
      >
        {loading ? 'Recherche...' : 'Rechercher'}
      </Button>
    </div>
  )
}

export default SearchBar
