import { Box, IconButton, Typography } from "@material-ui/core"
import { ChevronRight, MoreHoriz } from "@material-ui/icons"
import { Link, useNavigate } from "react-router-dom"

const LinkBlock = ({ link }) => {
  const navigate = useNavigate()
  return (
    <Box
      minWidth='80px'
      marginLeft={2}
    >
      <Link to={`/${link}`} style={{ height: '100%', width: '100%' }}>

        <Box
          width='100%'
          height='calc(100% - 15px)'
          style={{
            border: '2px solid #F5F5F5',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#757575'
          }}
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
        >
          <ChevronRight />
          <Box marginTop={1} />
          <Typography variant='caption'>Xem tất cả</Typography>
        </Box>
      </Link>
    </Box >
  )
}

export default LinkBlock