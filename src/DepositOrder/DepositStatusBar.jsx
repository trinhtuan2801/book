import { Paper, Tab, Tabs, useScrollTrigger } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DEPOSIT_STATUS, DEPOSIT_STATUS_VN } from "../constants/index"

const DepositStatusBar = () => {

  const navigate = useNavigate()
  const { status } = useParams()

  useEffect(() => {
    setValue(DEPOSIT_STATUS.indexOf(status))
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
        variant="scrollable"
        scrollButtons="on"
      >
        {DEPOSIT_STATUS.map((status) =>
          <Tab
            key={`${status}`}
            label={`${DEPOSIT_STATUS_VN[status]}`}
            // style={{ width: '165.5px' }}
            onClick={() => { navigate(`/deposit-order/${status}`) }}
          />
        )}
      </Tabs>
    </Paper>
  )
}

export default DepositStatusBar