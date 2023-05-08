import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export default function MultipleSelectChip({ selectedList, setSelectedList, choices }) {
  const [thisList, setThisList] = React.useState([])

  const handleChange = (event) => {
    const {
      target: { value }
    } = event
    const newVal = typeof value === 'string' ? value.split(',') : value
    console.log(`Updated list to: ${newVal}`)
    setThisList(newVal)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel className="text-sm mb-1 font-medium text-white" id="demo-multiple-chip-label">
          Chip
        </InputLabel>
        <Select
          className="rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={thisList}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} className='text-white'/>
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {choices.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
