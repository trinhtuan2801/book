import { Box } from "@material-ui/core";
import BoxSkeleton from "./BoxSkeleton";


const BoxListSkeleton = ({ itemCounts }) => {
  return (
    <Box
      width='100%'
      maxWidth='1480px'
      // minWidth='852px'
      display='flex'
      justifyContent='space-between'
      height='fit-content'
      flexWrap='wrap'
      gridGap={16}
    >
      {itemCounts.map((itemCount, index) =>
        <BoxSkeleton 
          key={index} 
          itemCount={itemCount} 
          pushLast={index === 3}
        />
      )}

    </Box>
  )
}


export default BoxListSkeleton