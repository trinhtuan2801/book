import { Box, Dialog, Divider, IconButton, Typography } from "@material-ui/core"
import { Clear, LocalShippingOutlined } from "@material-ui/icons"
import { Fragment } from "react"
import { MBOOKS_ADDRESSES } from "../constants"
import { phoneNumberWithSpace } from "../ultils/NumberUtils"

const AddressPopup = ({
  open,
  onClose
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
    >
      <Box
        width='100%'
        height='500px'
        boxSizing='border-box'
        display='flex'
        flexDirection='column'
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          paddingX={2}
          paddingTop={1}
        >
          <Typography variant="h6" >
            Địa chỉ Maxmin &nbsp;
          </Typography>
          <IconButton onClick={onClose} size='small'><Clear /></IconButton>
        </Box>
        <Box marginTop={1} />
        <Divider />
        <Box
          width='100%'
          boxSizing='border-box'
          padding={2}
          style={{ overflowY: 'scroll' }}
          flexGrow='1'
        >
          {MBOOKS_ADDRESSES.map((address, index) =>
            <Fragment key={index}>
              <Box display='flex' alignItems='center'>
                <LocalShippingOutlined />
                <Box marginLeft={1} />
                <Typography>
                  <b>{address.name}</b>
                </Typography>
              </Box>
              <Box marginTop={1}/>
              <Typography variant='body1'>
                <b>Người nhận:</b> Maxmin
                <br />
                <b>Địa chỉ:</b> {address.street}, {address.ward}, {address.district}, {address.province}
                <br />
                <b>Số điện thoại:</b> {phoneNumberWithSpace(address.mobile)}
              </Typography>
              <Box marginTop={1} />
            </Fragment>
          )}
        </Box>
      </Box>

    </Dialog>
  )
}

export default AddressPopup