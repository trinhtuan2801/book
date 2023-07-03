import { Box, Button, Dialog, Divider, TextField, Typography, useMediaQuery } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { CustomDialogContent, CustomDialogTitle } from "../../CommonComponent/CommentPopup/CommentPopup"
import { CustomButton } from "../../CommonComponent/CustomButton"
import { BASE_API } from "../../constants"
import { axiosPost } from "../../ultils/axiosUtils"
import Pcode from "./Pcode"
import { useState } from "react"

const ChoosePcodePopup = ({
  id,
  procedure,
  open,
  onClose,
  pcodes,
  activePcodes,
  updateParent,
  readonly = false
}) => {

  const smallLayout = useMediaQuery('(max-width:904px)')
  const { enqueueSnackbar } = useSnackbar()
  const [specialPcode, setSpecialPcode] = useState('')

  const applyCode = async (pcode) => {
    console.log('pcode', pcode, id)
    let cart_type = procedure === 'buy' ? 'carts' : 'deposit-carts'
    const response = await axiosPost(`${BASE_API}/${cart_type}/${id}/pcodes`, {
      pcode
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Lỗi khi kiểm tra', { variant: 'error' })
      return
    }
    updateParent()
    onClose()
  }

  const submit = (e) => {
    e.preventDefault()
    const elements = e.target.elements
    const pcode = elements['pcode'].value
    applyCode(pcode)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose} style={{ overscrollBehavior: 'contain' }} fullScreen={smallLayout ? true : false}
    >
      <CustomDialogTitle onClose={onClose}>
        {readonly ? 'Khuyến mại' : 'Chọn khuyến mại'}
        {readonly &&
          <Typography style={{ marginTop: '4px' }} variant='caption' component='div'>(Chọn tại bước chọn địa chỉ)</Typography>
        }
      </CustomDialogTitle>
      <CustomDialogContent
        dividers
        className="custom-scroll-bar"
        style={{ overflowY: 'scroll' }}
      >
        {!readonly &&
          <>
            <Box
              display='flex'
              flexDirection='column'
              marginBottom={2}
              width='100%'
              minWidth={smallLayout ? '0' : '400px'}
            >
              <form onSubmit={submit} style={{ width: '100%' }}>
                <Box width='100%' display='flex'>
                  <TextField
                    variant="outlined"
                    size='small'
                    fullWidth
                    required
                    name='pcode'
                    onChange={(e) => setSpecialPcode(e.target.value)}
                    value={specialPcode}
                    type='search'
                  />
                  <Box marginLeft={1} />
                  <CustomButton
                    variant="contained"
                    style={{ minWidth: 'fit-content', boxShadow: 'none' }}
                    color='white'
                    backgroundColor='purple'
                    type='submit'
                    disabled={!specialPcode}
                  >Áp dụng</CustomButton>
                </Box>
              </form>

            </Box>
            <Divider />
          </>
        }

        <Box marginTop={2} display='flex' flexDirection='column' gridRowGap={10}
        >
          {pcodes.map((data, index) =>
            <Pcode
              key={index}
              data={data}
              applyCode={applyCode}
              readonly={readonly}
              compact={readonly}
              chosen={activePcodes?.includes(data.pcode)}
            />
          )}
        </Box>
      </CustomDialogContent>
    </Dialog>
  )
}

export default ChoosePcodePopup