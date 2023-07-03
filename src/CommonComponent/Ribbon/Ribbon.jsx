import { Typography } from "@material-ui/core"
import './Ribbon.css'
const Ribbon = ({ textColor, ribbonColor, children }) => {
  return (
    <div className="ribbon" style={{color: textColor, background: ribbonColor}}>
      <Typography style={{fontWeight: 600}} variant='caption'>{children}</Typography>
    </div>
  )
}

export default Ribbon