import { Box, Button, Chip, Paper, Typography, useScrollTrigger, useTheme } from "@material-ui/core"
import { Clear, Done } from "@material-ui/icons"
import { useEffect } from "react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

const FilterBar = () => {
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const scroll_trigger = useScrollTrigger({ target: undefined, threshold: 0 })


  const [iold, setIold] = useState(false)
  const [istock, setIstock] = useState(false)

  useEffect(() => {
    let iold = searchParams.get('iold') === 'true'
    setIold(iold)
    let istock = searchParams.get('istock') === 'true'
    setIstock(istock)
    console.log('param', iold, istock)
  }, [])

  const resetFilter = () => {
    setIold(false)
    setIstock(false)
  }

  const setParam = (name, value) => {
    searchParams.set(name, value)
    setSearchParams(searchParams, { replace: true })
  }

  useEffect(() => {
    setParam('iold', iold)
  }, [iold])

  useEffect(() => {
    setParam('istock', istock)
  }, [istock])

  let disable_reset_button = !iold && !istock

  return (
    <Paper
      square

      style={{
        width: '100%',
        position: '-webkit-sticky',
        position: 'sticky',
        top: scroll_trigger ? 0 : 60,
        // top: 60,
        zIndex: 1000,
        height: 'fit-content',
        backgroundColor: 'white',
        paddingTop: theme.spacing(1.5),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1.5),
        boxSizing: 'border-box',
        maxWidth: '1480px',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Box
        marginRight={1.5}
        display='flex'
        gridGap={10}
        flexWrap={'wrap'}
      >
        <Chip
          label="Đồ cũ"
          onClick={() => { setIold(prev => !prev) }}
          color={iold ? 'primary' : 'default'}
          style={{ backgroundColor: iold ? '#1976d2' : 'transparent' }}
          variant={iold ? 'default' : 'outlined'}
        // deleteIcon={iold ? <Done /> : <></>}
        // onDelete={() => { }}
        />
        <Chip
          label="Giao nhanh"
          onClick={() => setIstock(prev => !prev)}
          color={istock ? 'primary' : 'default'}
          style={{ backgroundColor: istock ? '#1976d2' : 'transparent' }}
          variant={istock ? 'default' : 'outlined'}
        // deleteIcon={istock ? <Done /> : <></>}
        // onDelete={() => { }}
        />

      </Box>
      <Box minWidth='fit-content'>
        <Chip
          label="Bỏ lọc"
          onClick={resetFilter}
          color="secondary"
          disabled={disable_reset_button}
          variant={disable_reset_button ? 'outlined' : 'default'}
        />
      </Box>


    </Paper >

  )
}

export default FilterBar