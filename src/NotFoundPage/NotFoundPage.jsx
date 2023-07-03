import { Box, Button, Typography } from "@material-ui/core"
import { useNavigate } from "react-router-dom"
import { CustomButton } from "../CommonComponent/CustomButton"
import { SentimentDissatisfied } from "@material-ui/icons"
import { useEffect } from "react"

const NotFoundPage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = 'Không tìm thấy trang'
  }, [])
  return (
    <Box width='100%' height='100vh' display='flex' justifyContent='center' alignItems='center'>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <SentimentDissatisfied style={{ fontSize: '50px' }} />
        <Box mt={2} />
        <Typography variant='h5'>Không tìm thấy trang</Typography>
        <Box mt={2} />
        <CustomButton
          onClick={() => navigate('/')}
          backgroundColor='yellow'
          variant='contained'
          fullWidth
        >Quay về trang chủ</CustomButton>
      </Box>
    </Box>
  )
}

export default NotFoundPage