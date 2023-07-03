import { Box, Divider, Typography, useMediaQuery } from "@material-ui/core"
import { useNavigate } from "react-router-dom"
import { CustomButton } from "../CommonComponent/CustomButton"
import { BASE_ACCOUNT } from "../constants"

const AccountManage = () => {
  const navigate = useNavigate()
  const smallLayout = useMediaQuery('(max-width:615px)')

  return (
    <Box
      width='100%'
      height='fit-content'
      padding={3}
      boxSizing='border-box'
      style={{ backgroundColor: '#fff' }}
      marginTop={2}
      maxWidth='1480px'
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Typography
          variant={smallLayout ? "h6" : 'h5'}
          style={{ fontWeight: '500' }}
          gutterBottom
        >
          Quản lý tài khoản
        </Typography>

      </Box>

      <Divider />
      <Box marginTop={2} />
      <CustomButton
        variant="contained"
        backgroundColor="yellow"
        borderRadius='amazon'
        style={{ width: 300 }}
        onClick={() => window.open(`${BASE_ACCOUNT}/profile-manager`, '_blank')}
      >Quản lý thông tin đăng nhập</CustomButton>

      <Box marginTop={2} />
      <CustomButton variant="contained" backgroundColor="yellow" borderRadius='amazon' style={{ width: 300 }} disabled>Quản lý public profile</CustomButton>


    </Box>
  )
}

export default AccountManage