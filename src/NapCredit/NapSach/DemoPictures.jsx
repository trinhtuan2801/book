import { Box } from "@material-ui/core"

const DemoPictures = ({ pictures = [] }) => {
  return (
    <>
      <Box display='flex' flexWrap='wrap' gridColumnGap={3.5} gridRowGap={3.5} width='fit-content'>
        {pictures.map((pic, index) =>
            <img
              key={index}
              src={pic}
              width='130px'
              height='130px'
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
        )}
      </Box>
    </>
  )
}

export default DemoPictures