import { Box, Button } from "@material-ui/core"
// import { ShoppingBasket } from "@material-ui/icons"
import { lazy, Suspense, useMemo } from "react"
import { useState } from "react"
import CommentPopup from "../CommonComponent/CommentPopup/CommentPopup"
// import * as MuiIcons from "@material-ui/icons"
import { useEffect } from "react"

const Test = () => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    setValue(2)
    setValue(prev => { console.log(prev); return prev + 1 })
  }, [])

  return (
    <Box width='100%' height='fit-content' paddingTop={8} paddingX={2}>
      {/* {icons.map((Icon, index) =>
        <Icon key={index}/>
      )} */}
    </Box>
  )
}

export default Test