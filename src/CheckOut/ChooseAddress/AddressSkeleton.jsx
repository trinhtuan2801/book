import { Box } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"

const AddressSkeleton = () => {
  return (
    <>
      <Box>
        <Skeleton variant='text' width='200px'/>
        <Skeleton variant='text' width='100px'/>

        <Box marginTop={1} />
        <Skeleton variant="rect" height='30px' width='100%' style={{ maxWidth: '300px' }} />
        <Box display='flex' width='100%' maxWidth='300px' marginTop={1}>
          <Skeleton variant="rect" height='30px' style={{ flexGrow: 1 }} />
          <Box marginLeft={1} />
          <Skeleton variant="rect" height='30px' style={{ flexGrow: 1 }} />
        </Box>
      </Box>
    </>
  )
}

export default AddressSkeleton