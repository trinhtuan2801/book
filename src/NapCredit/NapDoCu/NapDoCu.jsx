import { Box, Divider, useMediaQuery, useTheme } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import MiniCart from "../NapSach/MiniCart/MiniCart"
import NapSachStepper from "../NapSach/NapSachStepper"
import NapOther from "./NapTypes/NapOther"
import Header from "./Header"
import NapSach from "./NapTypes/NapSach"
import { axiosGet } from "../../ultils/axiosUtils"
import { BASE_API } from "../../constants"
import { useMemo } from "react"

const NapDoCu = () => {
  const theme = useTheme()
  const smallLayout = useMediaQuery('(max-width:780px)')
  const [searchParams] = useSearchParams()
  const cat_id = searchParams.get('cat_id')
  const [resetKey, setResetKey] = useState(true)
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

  useEffect(() => {
    setResetKey(prev => !prev)
  }, [cat_id])

  const NapType = useMemo(() => {
    if (!categories.length) return NapOther
    const category = categories.find(cate => cate._id === cat_id)
    if (!category) return NapOther
    switch (category.ctype) {
      case "BOOK": return NapSach
      default: return NapOther
    }
  }, [cat_id, categories])

  return (
    <>
      <Box
        bgcolor={theme.palette.grey[100]}
        width='100%'
        height='fit-content'
        boxSizing='border-box'
        paddingTop={8}
        display='flex'
        justifyContent='center'
        position='relative'
        paddingBottom={2}
      >
        <Box
          // maxWidth='1158.5px'
          width='100%'
          display='flex'
          position='relative'
        >
          <Box
            width='100%'
            height='fit-content'
            boxSizing='border-box'
            marginLeft={2}
            marginTop={2}
          >
            <NapSachStepper step={0} />
            <Box marginTop={2} />

            {/*Main area */}
            <Box
              width='100%'
              height='fit-content'
              padding={3}
              boxSizing='border-box'
              style={{ backgroundColor: '#fff' }}
            >
              <Header
                smallLayout={smallLayout}
              />

              <Box mt={1.5} />
              <Divider />

              <NapType
                key={'nap-sach' + resetKey}
                refreshParent={() => setResetKey(prev => !prev)}
              />

              {/* <NapSach
              key={'nap-sach' + resetKey}
              refreshParent={() => setResetKey(prev => !prev)}
            /> */}

              {/* <NapOther
              key={'nap-other' + resetKey}
              refreshParent={() => setResetKey(prev => !prev)}
            /> */}
            </Box>
          </Box>

          <Box marginLeft={2} />

          <MiniCart
            showSubmitButton={true}
            key={'minicart' + resetKey}
            isVertical={!smallLayout}
            refreshParent={() => setResetKey(prev => !prev)}
          />
        </Box>

      </Box>
    </>
  )
}

export default NapDoCu 