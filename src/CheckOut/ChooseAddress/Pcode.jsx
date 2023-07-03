import { Box, LinearProgress, Paper, TextField, Typography, useTheme, withStyles } from "@material-ui/core"
import { CustomButton } from "../../CommonComponent/CustomButton"
import { numberWithCommas } from "../../ultils/NumberUtils"
import moment from 'moment'
import { Check, Clear } from "@material-ui/icons"

const Pcode = ({ data, applyCode, compact = false, readonly = false, chosen = false }) => {
  const theme = useTheme()
  return (
    <Paper style={{ padding: theme.spacing(2) }} elevation={3}>
      <Typography style={{ fontWeight: 500 }} variant={compact ? 'body2' : 'body1'}>
        {data.title}
      </Typography>
      <Typography variant='caption'>
        {data.desc}
      </Typography>
      <Box width='100%' display='flex' justifyContent='space-between' marginTop={1} alignItems='flex-end'>

        <Typography variant='caption'>
          {data.due_date && `Đến ${moment(data.due_date).format('DD/MM/YYYY - HH:mm')}`}
        </Typography>
        {!readonly ?
          <>
            {data.appliable &&
              <>
                {chosen ?
                  <Typography variant="caption" style={{ color: 'green', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Đã áp dụng&nbsp;<Check fontSize="small" />
                  </Typography>
                  :
                  <CustomButton
                    variant="contained"
                    style={{ minWidth: 'fit-content', boxShadow: 'none' }}
                    color='white'
                    backgroundColor='purple'
                    onClick={() => applyCode(data.pcode)}
                    disabled={chosen}
                  >
                    Áp dụng
                  </CustomButton>
                }
              </>
            }
          </>
          :
          <>
            {data.appliable ?
              <Typography variant="caption" style={{ color: 'green', fontWeight: 500 }}>
                Đủ điều kiện
              </Typography>
              :
              <Typography variant="caption" style={{ color: 'grey', fontWeight: 500, fontStyle: 'italic' }}>
                Chưa đủ điều kiện
              </Typography>
            }
          </>
        }

      </Box>
      {!data.appliable &&
        <Box display='flex' marginTop={1} alignItems='center'>
          <CustomLinearProgress value={data.progress} variant='determinate' />
          <Box marginLeft={1} />
          <Typography variant='body2' style={{ color: 'grey' }}>{data.progress}%</Typography>
        </Box>
      }
    </Paper>
  )
}

export default Pcode

const CustomLinearProgress = withStyles((theme) => ({
  root: {
    height: 8,
    borderRadius: 5,
    width: '100%',
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: 'purple',
  },
}))(LinearProgress);