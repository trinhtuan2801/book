import { Box, Checkbox, Typography } from "@material-ui/core"

const Header = ({ checked, onChange }) => {
  return (
    <Box width='100%' bgcolor='white' display='flex' justifyContent='space-between' alignItems='center' pr={2} py={1}>
      <Box display='flex' alignItems='center'>
        <Checkbox
          color='primary'
          style={{ width: 'fit-content', height: 'fit-content' }}
          checked={checked}
          onChange={onChange}
        />
        <Typography>Chọn tất cả</Typography>
      </Box>
      <Typography >Giá tiền</Typography>
    </Box>
  )
}

export default Header