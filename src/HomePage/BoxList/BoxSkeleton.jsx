import { Box, makeStyles } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import classNames from "classnames"
import MediaQuery from "../../ultils/MediaQuery"
const useStyles = makeStyles((theme) => ({
  pushLast: {
    display: 'flex',
    [MediaQuery.down('1239')]: {
      display: 'none'
    },
  },
}))
const BoxSkeleton = ({ pushLast, itemCount }) => {
  const classes = useStyles()
  return (
    <Box
      position='relative'
      display="flex"
      flexDirection="column"
      flex={1}
      minWidth='274px'
      maxWidth='386px'
      height='420px'
      minHeight='420px'
      paddingTop='20px'
      paddingBottom='15px'
      boxSizing='border-box'
      zIndex={1}
      style={{ backgroundColor: '#fff' }}
      className={classNames({
        [classes.pushLast]: pushLast
      })}
    >
      <Box paddingX='20px' marginBottom='10px'>
        <Skeleton variant="text" width='100%' height={40} />
      </Box>

      <Box
        boxSizing='border-box'
        paddingX='20px'
        marginBottom='44px'
        flexGrow={1}
        height='275px'
      >
        {itemCount === 1 ?
          <Skeleton
            height='100%'
            width='100%'
            variant='rect'
          />
          :
          <>
            {[1, 2].map((item, index) =>
              <Box
                key={index}
                height='50%'
                boxSizing='border-box'
                marginBottom='8px'
                position='relative'
                display='flex'
                justifyContent='space-between'
              >
                {[1, 2].map((item, index) => (
                  <Box
                    key={index}
                    height='100%'
                    paddingBottom='36px'
                    width='47.5%'
                    boxSizing='border-box'
                  >
                    <Skeleton
                      height='100%'
                      width='100%'
                      variant='rect'
                    />
                    <Box
                      width='100%'
                      boxSizing='border-box'
                      display='inline-block'
                    >
                      <Skeleton variant="text" width='100%' />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </>
        }
      </Box>

      <Box
        width='fit-content'
        paddingX='20px'
        marginBottom='20px'
        position='absolute'
        bottom={0}
      >
        <Skeleton variant='text' width={80} />
      </Box>
    </Box>
  )
}

export default BoxSkeleton