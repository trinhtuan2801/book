import { makeStyles, useMediaQuery } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '300px',
    backgroundColor: '#F5F5F5',
    // paddingBottom: theme.spacing(2)
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '1480px',
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    objectPosition: 'center',
    backgroundColor: '#F5F5F5',
    cursor: 'pointer',
  },

}))

const Banner = (props) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const smallLayout = useMediaQuery('(max-width:904px)')

  return (
    <div
      style={{
        width: '100%',
        height: smallLayout ? '150px' : '300px',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '1480px',
      }}
    >
      <img
        className={classes.image}
        src={props.img_url}
        onClick={() => { navigate('/' + props.link) }}
        alt="banner"
      />
    </div>

  )

}

Banner.defaultProps = {
  img_url: '',
  link: '',
  show_start: '',
  show_end: '',
  _id: ''
}

export default Banner