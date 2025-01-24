import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const SortControls = ({ sortBy, onSortChange }) => {
  return (
    <FormControl className="w-48 mb-4">
      <InputLabel>Trier par</InputLabel>
      <Select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        label="Trier par"
      >
        <MenuItem value="distance">Distance</MenuItem>
        <MenuItem value="rating">Note</MenuItem>
        <MenuItem value="reviews">Nombre d'avis</MenuItem>
      </Select>
    </FormControl>
  )
}

export default SortControls
