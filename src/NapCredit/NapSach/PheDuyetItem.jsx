import { Box, makeStyles, Typography } from "@material-ui/core";
import { useState } from "react";
import { CustomButton } from "../../CommonComponent/CustomButton";

const useStyles = makeStyles((theme) => ({
  img: {
    width: '80px',
    height: '120px',
    objectFit: 'cover',
    objectPosition: 'top'
  },
  formControl: {
    minWidth: 60
  },

}))

const PheDuyetItem = (props) => {
  const classes = useStyles()
  const [amount, setAmount] = useState(1)

  return (
    <div>
      <Box
        display='flex'
        paddingY={1.5}
        boxSizing='border-box'
        justifyContent='space-between'
        height={140}
      // style={{ backgroundColor: 'orange' }}
      >
        <Box >
          <img
            className={classes.img}
            src={props.src}
          />
        </Box>
        <Box
          marginLeft={2}
          flexGrow={1}
          position='relative'
          boxSizing='border-box'
        >
          <Typography variant='h6' style={{ fontWeight: 400 }}>{props.title}</Typography>
          <Typography variant='body2'>{`by ${props.author}`}</Typography>
          <Box
            position='absolute'
            bottom={-2}
            display='flex'
            alignItems='center'
          >
            {/* <Button color="primary" variant='outlined' size='small'>Delete</Button> */}
            <CustomButton backgroundColor="white" variant='contained' size='small'>Delete</CustomButton>
          
          </Box>
        </Box>
        <Box>
          <Typography variant="h6">{`$${props.price * amount}`}</Typography>
        </Box>
      </Box>
    </div>

  )
}

PheDuyetItem.defaultProps = {
  src: 'https://i2-prod.walesonline.co.uk/incoming/article6890072.ece/ALTERNATES/s615b/hp1.jpg',
  title: 'Harry Potter',
  author: 'JK Rowling',
  price: 13.02,
}

export default PheDuyetItem