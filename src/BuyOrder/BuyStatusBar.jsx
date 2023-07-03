import { Box, Paper, Tab, Tabs, Typography, useScrollTrigger } from "@material-ui/core"
import { useEffect } from "react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { BUY_STATUS, BUY_STATUS_VN } from "../constants/index"

const BuyStatusBar = () => {

  const navigate = useNavigate()
  const { status } = useParams()

  useEffect(() => {
    setValue(BUY_STATUS.indexOf(status))
  }, [status])

  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const trigger = useScrollTrigger({ target: undefined, threshold: 0 })

  return (
    <Paper
      square
      style={{
        // width: '1158.5px',
        position: '-webkit-sticky',
        position: 'sticky',
        top: trigger ? 0 : 60,
        // top: 60,
        zIndex: 1000
      }}
    >
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="on"
      >
        {BUY_STATUS.map((status) =>
          <Tab
            key={`${status}`}
            label={`${BUY_STATUS_VN[status]}`}
            // style={{ width: '165.5px' }}
            onClick={() => { navigate(`/buy-order/${status}`) }}
          />
        )}
      </Tabs>
    </Paper>
  )
}

export default BuyStatusBar

//   < Box
// position = 'sticky'
// width = 'fit-content'
// height = '53px'
// boxSizing = 'border-box'
// style = {{
//   backgroundColor: '#757575',
//     position: '-webkit-sticky',
//       }}
// top = '0px'
// display = 'flex'
// zIndex = { 1000}
//   >