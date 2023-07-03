import { Avatar, Badge, Box, Paper, Typography, withStyles } from "@material-ui/core"
import { BASE_FILE } from "../constants"
import { useNavigate } from "react-router-dom"

const MatHang = ({ _data }) => {

  // const { closeChonMatHang } = useChonMatHang()
  const navigate = useNavigate()

  const choose = () => {
    navigate(`/nap-do-cu?cat_id=${_data?._id}`)
    // closeChonMatHang()
  }

  const items_length = _data?.active_dcart?.nditems

  return (
    <Paper
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        justifyContent: 'space-between',
        padding: '4px'
      }}
      onClick={choose}
    >
      <Box
        width='100%'
        height='100%'
      >
        <img
          src={`${BASE_FILE}/${_data?.img_url}`}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'fill',
            borderRadius: '4px'
          }}
        />
      </Box>
      <Box my={1} display='flex' alignItems='center'>
        <Typography style={{ fontWeight: 600 }} variant='body2'>
          {_data?.name}
        </Typography>
        <Box ml={0.8} />
        {!!items_length &&
          <div
            style={{
              color: 'white',
              backgroundColor: 'green',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" style={{ fontWeight: 600 }}>
              {items_length}
            </Typography>
          </div>
        }
      </Box>

    </Paper >
  )
}

export default MatHang

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: 'green',
    color: 'white',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    // animation: '$bounce 1.2s infinite ease-in-out',
  },

  '@keyframes bounce': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.5)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}))(Badge);
