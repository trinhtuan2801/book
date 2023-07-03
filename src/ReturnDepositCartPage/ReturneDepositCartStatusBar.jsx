import { Paper, Tab, Tabs, useMediaQuery, useScrollTrigger } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RETURN_DEPOSIT_CART_STATUS, RETURN_DEPOSIT_CART_STATUS_VN } from "../constants/index"

const ReturnDepositCartStatusBar = () => {
  const smallLayout = useMediaQuery('(max-width:904px)')
  const navigate = useNavigate()
  const { status } = useParams()

  useEffect(() => {
    setValue(RETURN_DEPOSIT_CART_STATUS.indexOf(status))
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
        // width: '100%',
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
        variant={smallLayout ? "scrollable" : "standard"} 
        scrollButtons="on"
        centered={smallLayout ? false : true}
      >
        {RETURN_DEPOSIT_CART_STATUS.map((status) =>
          <Tab
            key={`${status}`}
            label={`${RETURN_DEPOSIT_CART_STATUS_VN[status]}`}
            // style={{ width: '165.5px' }}
            onClick={() => { navigate(`/hang-hoan-tra/${status}`) }}
          />
        )}
      </Tabs>
    </Paper>
  )
}

export default ReturnDepositCartStatusBar