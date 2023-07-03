import { Box, Divider, makeStyles, Typography } from "@material-ui/core"
import { Fragment } from "react"
import { CustomButton } from "../../../CommonComponent/CustomButton"
import MiniBook from "./MiniBook"

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    top: 0,
  }
}))

const VerticalType = ({ cartInfo, items, showSubmitButton, submit, deleteBook }) => {
  const classes = useStyles()

  return (
    <>
      <Box
        width='150px'
        style={{ backgroundColor: '#fff' }}
        display='flex'
        flexDirection='column'
        alignItems='center'
        boxSizing='border-box'
        // paddingTop={1}
        className={classes.root}
        height='calc(100vh - 16px)'
        marginTop={2}
        marginRight={2}
      >
        {cartInfo &&
          <>
            <Box
              display='flex'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              width='100%'
              height='100px'
              marginTop={1}
            // padding={1}
            >
              <Typography style={{ fontWeight: 500 }}>
                {items.length}&nbsp;Hàng nạp
              </Typography>

              <Box marginTop={1} />

              {showSubmitButton &&
                <Box paddingX={1}>
                  <CustomButton
                    variant="contained"
                    backgroundColor="yellow"
                    fullWidth size="small"
                    width='120px'
                    borderRadius='amazon'
                    onClick={submit}
                    disabled={items.length === 0}
                  >
                    Submit
                  </CustomButton>
                </Box>
              }
            </Box>

            <Box marginTop={2} />
            <Divider flexItem style={{ height: '1px' }} />

            <Box
              height='100%'
              boxSizing='border-box'
              width='100%'
              className="custom-scroll-bar"
              style={{ overflowY: 'scroll' }}
              paddingLeft={1}
              paddingBottom={1}
            >
              {items.map((book, index) => (
                <Fragment key={index}>
                  <Box marginTop={1} />
                  <MiniBook
                    name={book.title}
                    src={book.images[0].thumb_url}
                    showDeleteButton={showSubmitButton}
                    deleteBook={deleteBook(book._id)}
                  />
                  {/* <Divider flexItem style={{ height: '1px' }} /> */}
                </Fragment>
              ))}
            </Box>
          </>
        }

      </Box>
    </>
  )
}

export default VerticalType