import { Backdrop, Box, Divider, Drawer, IconButton, makeStyles, Typography, useTheme } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import classNames from "classnames"
import { Fragment, useState } from "react"
import { CustomButton } from "../../../CommonComponent/CustomButton"
import MiniBook from "./MiniBook"

const drawerHeight = 'fit-content'
const useStyles = makeStyles((theme) => ({
  drawer: {
    height: drawerHeight,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    height: drawerHeight,
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    height: '50px',
  },
  expand: {
    transform: 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(0deg)',
  },
}))

const HorizontalType = ({
  cartInfo, items, showSubmitButton, submit, deleteBook
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Drawer
        variant="permanent"
        anchor='bottom'
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: classNames({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
      >
        <Box
          width='100%'
          overflow='hidden'
        >
          <Box
            display='flex'
            width='100%'
            justifyContent='space-between'
            boxSizing='border-box'
          >
            <Box display='flex' alignItems='center' width='fit-content'>
              <IconButton
                className={classNames(classes.expand, {
                  [classes.expandOpen]: open,
                })}
                onClick={() => setOpen(prev => !prev)}
              >
                <ExpandMore />
              </IconButton>
              <Typography>Hàng nạp ({items.length})</Typography>
            </Box>
            {showSubmitButton &&
              <CustomButton
                borderRadius={0}
                backgroundColor='yellow'
                width='120px'
                height='50px'
                onClick={submit}
                disabled={items.length === 0}
              >
                Submit
              </CustomButton>
            }
          </Box>
          {open &&
            <Box width='100%' minHeight='150px'>
              <Divider />
              <Box
                width='100%'
                display='flex'
                // flexWrap='wrap'
                boxSizing='border-box'
                marginTop={2}
                paddingBottom={2}
                style={{ overflowX: 'scroll' }}
              >
                {items.map((book, index) => (
                  <Fragment key={index}>
                    <Box marginLeft={1} />
                    <MiniBook
                      name={book.title}
                      src={book.images[0].thumb_url}
                      showDeleteButton={showSubmitButton}
                      deleteBook={deleteBook(book._id)}
                      width='100px'
                    />
                    {/* <Divider flexItem style={{ height: '1px' }} /> */}
                  </Fragment>
                ))}
                <Box minWidth='8px' />
              </Box>
            </Box>
          }
        </Box>

      </Drawer>
      <Backdrop open={open} onClick={() => setOpen(false)} style={{ zIndex: theme.zIndex.drawer - 1 }} />
    </>
  )
}

export default HorizontalType