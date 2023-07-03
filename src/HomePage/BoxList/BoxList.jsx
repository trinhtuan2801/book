import { Box, makeStyles, useMediaQuery } from "@material-ui/core";
import BoxItem from "./BoxItem";
const useStyles = makeStyles((theme) => ({
  remain: {
    display: (props) => {
      if (props.fullLayout || props.squareLayout) return 'none'
      return 'flex'
    }
  },
}))

const BoxList = (props) => {
  const fullLayout = useMediaQuery('(min-width:1239px)')
  const squareLayout = useMediaQuery('(max-width:904px)')
  const classes = useStyles({ squareLayout, fullLayout })
  return (
    <Box
      width='100%'
      maxWidth='1480px'
      // minWidth='852px'
      display='flex'
      justifyContent={squareLayout ? 'center' : 'space-between'}
      height='fit-content'
      flexWrap='wrap'
      gridGap={16}
      className={props.isRemain ? classes.remain : null}
    >
      {!!props.boxItems && props.boxItems.map((boxitem, index) => (
        <BoxItem
          pushLast={index === 3}
          key={index}
          label={boxitem.label}
          items={boxitem.items}
          link={boxitem.link}
        // footer={boxitem.footer}
        />
      ))}
    </Box>
  )
}


export default BoxList