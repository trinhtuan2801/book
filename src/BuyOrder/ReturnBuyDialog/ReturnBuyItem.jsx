import { Box, Checkbox, TextField, Typography } from "@material-ui/core"
import { BASE_FILE } from "../../constants"
import { useState } from "react"
import { textEllipsis } from "../../ultils/domUtils"

const ReturnBuyItem = ({
  _id,
  title,
  thumb_url,
  onCheck = () => { }
}) => {

  const [checked, setChecked] = useState(false)

  return (
    <>
      <Box
        display='flex'
        width='100%'
        alignItems='center'
      >
        <Box
          display='flex'
          flexGrow={1}
          mr={1}
          alignItems='center'
        >
          <img
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
            }}
            src={`${BASE_FILE}/${thumb_url}`}
          />
          <Box ml={1} />
          <Typography
            style={{ ...textEllipsis(2) }}
          >{title}</Typography>
        </Box>
        <Checkbox
          color="secondary"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked)
            onCheck(_id, e.target.checked)
          }}
        />

      </Box>
      {checked &&
        <Box mt={1.5}>
          <TextField
            fullWidth
            placeholder="Lý do hoàn trả"
            size='small'
            variant="outlined"
            minRows={2}
            maxRows={3}
            multiline
            required
            name={_id}
          />
        </Box>
      }
    </>
  )
}

export default ReturnBuyItem