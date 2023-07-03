import { Box, Divider } from "@material-ui/core"
import { Rating, Skeleton } from "@material-ui/lab"

const ProductPageSkeleton = () => {
  return (
    <>
      <Box width='100%' display='flex' marginTop={2.5} boxSizing='border-box' paddingX={2}>
        <Box width='300px' height='514px'>
          <Skeleton variant='rect' width='100%' height='440px' />
          <Box marginTop={2} />
          <Skeleton variant='rect' width='100%' height='40px' />
        </Box>

        <Box marginLeft={2} />

        <Box
          width='calc(((100% - 300px) - 320px) - 16px)'
          paddingX={2}
          boxSizing='border-box'
        >
          <Skeleton variant='rect' width='80%' height='30px' />
          <Box marginTop={2} />
          <Skeleton variant='rect' width='150px' height='10px' />
          <Box marginTop={1.5} />
          <Rating
            name="read-only"
            precision={0.1}
            value={5}
            readOnly
            disabled
          />
          <Box marginTop={2} />
          <Divider />
          <Box marginTop={3} />

          <Box display='flex' flexWrap='wrap'>
            {[1, 2, 3, 4, 5].map(item =>
              <Box
                key={item}
                height='70px'
                boxSizing='border-box'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                flexGrow={1}
                maxWidth='150px'
                minWidth='150px'
                marginLeft={1}
                marginBottom={1}
              >
                <Skeleton variant='rect' width='100%' height='100%' />
              </Box>
            )}
          </Box>
        </Box>

        <Box marginLeft={2} />

        <Box width='320px' height='408px'>
          <Skeleton variant='rect' width='100%' height='100%' />
        </Box>
      </Box>
    </>
  )
}

export default ProductPageSkeleton