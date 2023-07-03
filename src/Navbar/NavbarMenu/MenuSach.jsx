import { Button, ClickAwayListener, Grid, makeStyles, Paper, Popper, Typography } from "@material-ui/core";
import { ChevronRight, Clear, FavoriteBorder } from "@material-ui/icons";
import { useEffect, useState } from 'react';
import { Link, matchPath, useLocation, useMatch, useParams } from "react-router-dom";
import { BASE_API } from "../../constants";
import { axiosGet } from "../../ultils/axiosUtils";

const useStyles = makeStyles((theme) => ({
  menu: {
    width: '100vw',
    height: 'calc(100vh - 200px)',
    position: 'relative',
  },
  container: {
    height: '100%',
    width: '100%'
  },
  leftMenu: {
    height: '100%',
    backgroundColor: theme.palette.grey[100],
    // overflow: 'scroll',
    paddingTop: theme.spacing(2)
  },
  languageButton: {
    width: '100%',
    height: '50px',
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2)
  },
  rightMenu: {
    height: '100%',
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(6),
    overflow: 'scroll'
  },
  exitIcon: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    cursor: 'pointer',
  },
  categoryWrapper: {
    paddingRight: '100px',
    minWidth: 'fit-content',
    paddingBottom: '30px'
  },
  linkActive: {
    cursor: 'pointer',
    color: 'black',
    textDecoration: 'none',
    fontWeight: 'bold',
    '&:hover': {
      color: '#303f9f',
    }
  },
  linkInActive: {
    cursor: 'pointer',
    color: 'black',
    textDecoration: 'none',
    fontWeight: 'normal',
    '&:hover': {
      color: '#303f9f',
    }
  },
  categoryContainer: {
    width: '100%',
    height: '100%',
    maxWidth: 'fit-content'
  }
}))

const MenuSach = (props) => {
  const classes = useStyles()
  const [categoriesV1, setCategoriesV1] = useState([])
  const [categoriesV2, setCategoriesV2] = useState([])
  const [cateIdV1, setCateIdV1] = useState('')
  const [cateIdV2, setCateIdV2] = useState('')
  const routeMatch1 = useMatch('/book-page/:cateIdV1/*')
  const routeMatch2 = useMatch('/book-page/:cateIdV1/:cateIdV2/*')
  const _cateIdV1 = routeMatch1?.params?.cateIdV1
  const _cateIdV2 = routeMatch2?.params?.cateIdV2

  const [catalogs, setCatalogs] = useState([])

  const getCategoriesV1 = async () => {
    const response = await axiosGet(`${BASE_API}/categories`)
    if (!response) return
    const cv1 = response.data
    setCategoriesV1(cv1)
    if (!_cateIdV1) {
      setCateIdV1(cv1[0]._id)
      getCategoriesV2(cv1[0]._id)
    } else {
      getCategoriesV2(_cateIdV1)
    }
  }

  const getCategoriesV2 = async (parent_id) => {
    const response = await axiosGet(`${BASE_API}/categories/${parent_id}`)
    setCategoriesV2(response.data)
  }

  const getCatalogs = async () => {
    const response = await axiosGet(`${BASE_API}/catalogs`)
    setCatalogs(response.data)
  }

  useEffect(() => {
    getCategoriesV1()
    setCateIdV1(_cateIdV1 || '')
    setCateIdV2(_cateIdV2 || '')
    getCatalogs()
  }, [])

  const onClickCategoryV1 = (idv1) => (event) => {
    setCateIdV1(idv1)
    getCategoriesV2(idv1)
  }

  const onClickCategoryV2 = (idv2) => (event) => {
    setCateIdV2(idv2)
    props.handleCloseMenu()
  }

  const onClickCatalogs = () => {
    setCateIdV1('catalogs')
  }

  return (
    <Popper
      open={props.open}
      anchorEl={props.open ? props.anchor : null}
      placement="bottom"
      disablePortal
      modifiers={{ preventOverflow: { padding: 0 } }}
      style={{ zIndex: 'inherit' }}
    >
      <Paper>
        <ClickAwayListener onClickAway={props.handleCloseMenu}>
          <div className={classes.menu}>
            <Clear className={classes.exitIcon} onClick={props.handleCloseMenu}></Clear>
            <Grid container className={classes.container}>
              <Grid item xs={2} className={classes.leftMenu}>
                {categoriesV1.map((cv1, index) => (
                  <Button
                    key={index}
                    className={classes.languageButton}
                    onClick={onClickCategoryV1(cv1._id)}
                    startIcon={cateIdV1 === cv1._id ? <ChevronRight /> : null}
                  >
                    <Typography variant={cateIdV1 === cv1._id ? "button" : "caption"}>
                      {cv1.name}
                    </Typography>
                  </Button>
                ))}
                <Button
                  className={classes.languageButton}
                  onClick={onClickCatalogs}
                  startIcon={cateIdV1 === 'catalogs' ? <ChevronRight /> : null}
                >
                  <Typography variant={cateIdV1 === 'catalogs' ? "button" : "caption"}>
                    Bộ sưu tập
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={10} className={classes.rightMenu}>
                <Grid container className={classes.categoryContainer} direction='column'>
                  {cateIdV1 !== 'catalogs' && categoriesV2.map((cv2, index) => (
                    <Grid item xs={1} key={cv2._id} className={classes.categoryWrapper}>
                      <Link to={`/book-page/${cateIdV1}/${cv2._id}`}>
                        <Typography
                          variant="body2"
                          className={cv2._id === cateIdV2 ? classes.linkActive : classes.linkInActive}
                          onClick={onClickCategoryV2(cv2._id)}
                        >
                          {cv2.name}
                        </Typography>
                      </Link>
                    </Grid>
                  ))}
                  {cateIdV1 === 'catalogs' && catalogs.map((catalog, index) => (
                    <Grid item xs={1} key={catalog._id} className={classes.categoryWrapper}>
                      <Link to={catalog.clink}>
                        <Typography
                          variant="body2"
                          className={classes.linkInActive}
                          onClick={() => props.handleCloseMenu()}
                        >
                          {catalog.title}
                        </Typography>
                      </Link>
                    </Grid>
                  ))}
                  {cateIdV1 === 'catalogs' && catalogs.length === 0 &&
                    <Grid item xs={1} className={classes.categoryWrapper}>
                      <Typography
                        variant="body2"
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        Coming soon <FavoriteBorder style={{ marginLeft: 5 }} fontSize='small' />
                      </Typography>
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
          </div>
        </ClickAwayListener>
      </Paper>
    </Popper >
  )

}


export default MenuSach