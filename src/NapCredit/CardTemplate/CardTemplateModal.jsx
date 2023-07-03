import { Box, Dialog } from "@material-ui/core"
import CardTemplate from "./CardTemplate"

const CardTemplateModal = ({ code, open, onClose, oname, ncredit }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <Box
        padding={0.5}
        style={{ backgroundColor: 'transparent' }}
      >
        <CardTemplate oname={oname} code={code} ncredit={ncredit}/>
      </Box>
    </Dialog>
  )
}

export default CardTemplateModal