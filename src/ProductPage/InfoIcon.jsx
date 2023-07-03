import { Box, makeStyles, Typography } from "@material-ui/core";
import { AspectRatio, Business, CompareOutlined, DateRangeOutlined, GTranslate, ImportContacts, LibraryBooksOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({

}))

const icons = {
  publisher: <CompareOutlined />,
  publication_date: <DateRangeOutlined />,
  dimensions: <AspectRatio/>,
  book_cover: <ImportContacts/>,
  translator: <GTranslate/>,
  number_of_page: <LibraryBooksOutlined />,
  manufacturer: <Business/>,

}

const InfoIcon = ({ name, code, value }) => {
  const classes = useStyles()
  return (
    <Box
      width='fit-content'
      minWidth='fit-content'
      height='fit-content'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='space-evenly'
    >
      <Typography variant='caption' gutterBottom noWrap component='div' style={{textAlign: 'center'}}>{name}</Typography>

      {icons[code]}

      <Box marginTop={1}/>
      
      <Typography 
        variant='caption' 
        style={{ fontWeight: 500, textAlign: 'center' }} 
        noWrap
        component='div'
      >{value}</Typography>
    </Box>
  )
}

InfoIcon.defaultProps = {
  title: '',
  icon: '',
  info: ''
}

export default InfoIcon