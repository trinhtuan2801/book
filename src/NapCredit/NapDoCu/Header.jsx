import { Box, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { BASE_API } from "../../constants"
import { axiosGet } from "../../ultils/axiosUtils"
import { numberWithCommas } from "../../ultils/NumberUtils"

const Header = ({ smallLayout }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [searchParams] = useSearchParams()
  const cat_id = searchParams.get('cat_id')
  const [category, setCategory] = useState(null)

  useEffect(() => {
    console.log('cat_id', cat_id)
    getCategory()
    getUserInfo()
  }, [cat_id])

  const getCategory = async () => {
    const response = await axiosGet(`${BASE_API}/deposit-carts/categories`, null, true)
    if (!response || response.code !== 200) return
    const categories = response.data
    const category = categories.find((cate) => cate._id === cat_id)
    if (category) setCategory(category)
  }


  const getUserInfo = async () => {
    let response = await axiosGet(`${BASE_API}/users`, null, true)
    if (!response || response.code !== 200) return
    setUserInfo(response.data)
  }

  if (!userInfo || !category) return <></>

  return (
    <Box
      display={smallLayout ? 'block' : 'flex'}
      justifyContent='space-between'
      alignItems='center'
    >
      <Typography
        variant={smallLayout ? 'h6' : 'h5'}
        style={{ fontWeight: '500' }}
        id='scroll-to'
      >
        {/* <span style={{ color: 'purple' }}>[{userInfo.name}]</span> */}
        Liệt kê mặt hàng:&nbsp;
        <span style={{color: 'orange'}}>{category.name}</span>
      </Typography>

      <Box
        minWidth='120px'
        display='flex'
        alignItems='baseline'
      >
        <Typography component='div' style={{ textAlign: 'end' }}>
          Số dư hiện tại:&nbsp;
        </Typography>
        <Typography style={{ color: 'orange', textAlign: 'end', fontWeight: 600 }}>
          {!!userInfo && numberWithCommas(userInfo.credit)}đ
        </Typography>
      </Box>
    </Box>
  )
}

export default Header