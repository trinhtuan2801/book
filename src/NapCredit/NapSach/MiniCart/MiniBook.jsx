import { Box, Paper, Typography } from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { CustomButton } from "../../../CommonComponent/CustomButton"
import { BASE_FILE } from "../../../constants"

const MiniBook = ({ src, name, deleteBook, showDeleteButton, width = '120px' }) => {
  return (
    <Paper
      style={{ width: width, minWidth: width, height: 'fit-content' }}
    >
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        padding={1}
        overflow='hidden'
        borderRadius={4}
        boxSizing='border-box'
        height='fit-content'
        justifyContent='space-between'
        width='100%'
        gridGap={16}
      >
        <img
          src={`${BASE_FILE}/${src}`}
          alt='book'
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '4px'
          }}
        />

        {showDeleteButton &&
          <CustomButton
            variant='outlined'
            size="small"
            startIcon={<Delete color="inherit" />}
            onClick={deleteBook}
            backgroundColor='white'
            borderRadius='normal'
            color="black"
            fullWidth
          >
            Xóa
          </CustomButton>
        }

      </Box>

    </Paper>
  )
}

MiniBook.defaultProps = {
  src: 'https://i2-prod.walesonline.co.uk/incoming/article6890072.ece/ALTERNATES/s615b/hp1.jpg',
  name: 'Harry Potter and the philosophy stone',
  showDeleteButton: true
}

export default MiniBook