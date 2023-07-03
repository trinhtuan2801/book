import { Box, Divider, Grid, Typography, useMediaQuery } from "@material-ui/core"
import MatHang from "./MatHang"
import { useEffect, useState } from "react"
import { axiosGet } from "../ultils/axiosUtils"
import { BASE_API } from "../constants"

const ChonMatHang = () => {

  const smallLayout = useMediaQuery('(max-width:904px)')
  const [categories, setCategories] = useState([])

  const getCategories = async () => {
    const response = await axiosGet(`${BASE_API}/deposit-carts/categories`, null, true)
    console.log('deposit categories', response)
    if (!response || response.code !== 200) return
    setCategories(response.data)
  }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <Box
      width='100%'
      height='fit-content'
      pt={10}
      display='flex'
      justifyContent='center'
      px={2}
      pb={2}
    >
      <Box
        width='100%'
        maxWidth='1158.5px'
        bgcolor='white'
        p={2}
      >
        <Typography variant="h6">Chọn mặt hàng bán</Typography>
        <Box my={1}>
          <Divider />
        </Box>
        <Box
          width='100%'
          display='flex'
          flexWrap='wrap'
          paddingY={1}
        >
          <Grid
            container
            spacing={2}
            style={{ width: '100%', margin: 0 }}
          >
            {categories.map(data =>
              <Grid key={data._id} item xs={6} sm={4} md={3} lg={2}>
                <MatHang _data={data} />
              </Grid>
            )}
          </Grid>

        </Box>
      </Box>

    </Box >
  )
}

export default ChonMatHang