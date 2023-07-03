import { Box, Dialog, DialogContent, Divider, MenuItem, TextField, Typography, useMediaQuery } from "@material-ui/core"
import { Fragment, useEffect, useState } from "react"
import { CustomDialogContent, CustomDialogTitle } from "../../CommonComponent/CommentPopup/CommentPopup"
import { BASE_API, OTYPE, OTYPE_VN } from "../../constants"
import { axiosGet } from "../../ultils/axiosUtils"
import BuyOption from "./BuyOption"

const _filterOptions = ['*', 'NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE']
const _filterOptionsVN = {
  '*': 'Tất cả',
  'NEW': 'Mới',
  'LIKE_NEW': 'Cũ như mới',
  'VERY_GOOD': 'Cũ nhưng rất tốt',
  'GOOD': 'Cũ nhưng tốt',
  'ACCEPTABLE': 'Cũ dùng được',
}
const AllBuyOptions = ({ open, onClose, book_id }) => {

  const [buyOptions, setBuyOptions] = useState([])
  const [filterOptions, setFilterOptions] = useState(_filterOptions)
  const [otype, setOtype] = useState('*')
  const smallLayout = useMediaQuery('(max-width:904px)')
  const [loading, setLoading] = useState(false)

  const getBuyOptions = async () => {
    setLoading(true)
    const response = await axiosGet(`${BASE_API}/books/${book_id}/all-buy-options`, {
      otypes: otype === '*' ? '' : otype,
      offset: 0,
      limit: 30
    })
    setLoading(false)
    if (!response || response.code !== 200) {
      return
    }
    const data = response.data
    const { buy_options, meta: { filters } } = data
    console.log(buy_options, filters)
    const filterOptions = _filterOptions.filter(option => filters.includes(option))
    setBuyOptions(buy_options)
    setFilterOptions(['*', ...filterOptions])
    if (!filters.includes('NEW'))
      setOtype(filters[0])
  }

  useEffect(() => {
    if (book_id)
      getBuyOptions()
  }, [book_id, otype])

  return (
    <>
      <Dialog
        open={open} onClose={onClose}
        fullScreen={smallLayout}
      >
        <CustomDialogTitle onClose={onClose}>
          Các lựa chọn khác
        </CustomDialogTitle>
        <DialogContent dividers style={{ overflowY: 'scroll', padding: 0, width: smallLayout ? '100%' : '600px' }}>
          <Box width={'100%'} >
            <Box width='100%' display='flex' justifyContent='flex-end' alignItems='center' padding={1.5}>
              <Typography>Độ mới: </Typography>
              <Box ml={1} />
              <TextField
                value={otype}
                onChange={e => setOtype(e.target.value)}
                select
                variant="outlined"
                size="small"
                style={{ width: '180px' }}
              >
                {filterOptions.map(otype => {
                  return (
                    <MenuItem key={otype} value={otype}>{_filterOptionsVN[otype]}</MenuItem>
                  )
                }
                )}
              </TextField>
            </Box>
          </Box>
          <Box mb={2}>
            <Divider />
            <Box mb={1.5} />
            {buyOptions.map((option, index) =>
              <Fragment key={option.ditem_id}>
                <BuyOption option={option} />
                {index !== buyOptions.length - 1 &&
                  <Box mt={2} mb={1.5}>
                    <Divider />
                  </Box>
                }
              </Fragment>
            )}
            {buyOptions.length === 0 && !loading &&
              <Typography style={{ textAlign: 'center', marginTop: '32px' }} color='error'>Không có dữ liệu</Typography>
            }
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AllBuyOptions