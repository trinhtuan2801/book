import { AppBar, Avatar, Badge, Box, ClickAwayListener, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Paper, Popper, Slide, TextField, Toolbar, Typography, useMediaQuery, useScrollTrigger, useTheme } from "@material-ui/core"
import { ArrowBack, AssignmentReturn, AssignmentReturnOutlined, Dehaze, ExitToApp, ExpandMore, Notifications, Person, PostAdd, Receipt, Search, ShoppingBasket, Star } from "@material-ui/icons"
import { Autocomplete } from "@material-ui/lab"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Link, NavLink, useLocation, useMatch, useNavigate, useSearchParams } from "react-router-dom"
import { BASE_API, BASE_FILE, FANPAGE_URL, WEB_SHOP_URL } from "../constants"
import LogoIcon from "../images/logo.png"
import { axiosGet } from "../ultils/axiosUtils"
import { numberWithCommas } from "../ultils/NumberUtils"
import { signIn } from "../ultils/SpecialRoute/SignedInRoute"
import useScrollLock from "../ultils/useScrollLock"
import MenuDrawer from "./MenuDrawer"
import './Navbar.css'
import CategoryBar from "./NavbarMenu/CategoryBar"
import MenuGioiThieu from "./NavbarMenu/MenuGioiThieu"
import MenuNapCredit from "./NavbarMenu/MenuNapCredit"
import MenuSach from "./NavbarMenu/MenuSach"
import NotificationBox from "./NotificationBox.jsx/NotificationBox"
import MenuBanDoCu from "./NavbarMenu/MenuBanDoCu"

const useStyles = makeStyles((theme) => ({
  tabBox: {
    height: "100%",
    paddingTop: "3px",
    borderBottom: `3px solid ${theme.palette.common.white}`,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: 'fit-content',
    minWidth: 'fit-content',
    // minWidth: '50px',
    paddingLeft: '5px',
    paddingRight: '5px',
    justifyContent: 'center'
  },
  menuBox: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    cursor: 'pointer',
    '&:hover': {
      color: '#3F51B5'
    }
  },
  expandIcon: {
    display: 'none',
    position: 'absolute',
    bottom: theme.spacing(1),
    transform: (props) => (props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'),
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    height: theme.spacing(2),
    width: theme.spacing(2)
  },
  iconButton: {
    width: '40px',
    height: '40px'
  },
  autocompleteOption: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    // height: '40px'
  }
}))

const HideOnScroll = ({ lock, ...props }) => {
  const { children, window } = props
  const hide = !useScrollTrigger({ target: window ? window() : undefined, threshold: 64 })
  useEffect(() => {
    if (!lock && hide)
      props.handleCloseMenu()
  }, [hide])

  return (
    <Slide appear={false} direction="down" in={lock ? true : hide} >
      {children}
    </Slide>
  )
}

const Navbar = () => {
  const { lockScroll, unlockScroll } = useScrollLock()
  const theme = useTheme()
  const { refresh_navbar } = useSelector(state => state.root)

  const { signed_in } = useSelector(state => state.root)
  const [openSearch, setOpenSearch] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const classes = useStyles({ openSearch, expanded })

  const [anchor, setAnchor] = useState([null, null])
  const [cartLength, setCartLength] = useState(0)
  const [credit, setCredit] = useState(0)
  const [avatar, setAvatar] = useState(null)
  const searchPageMatch = useMatch('/search')
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const getData = async () => {
      let response = await axiosGet(`${BASE_API}/carts/active`, null, true)
      if (!response) return
      setCartLength(response.data.items.length)
      response = await axiosGet(`${BASE_API}/users`, null, true)
      if (!response) return
      setCredit(response.data.credit)
      setAvatar(response.data.pimg)
    }
    if (signed_in) getData()
  }, [refresh_navbar, signed_in])

  const handleExpandClick = (menu_name) => (event) => {
    if (anchor[0] === menu_name) {
      handleCloseMenu()
      return
    }
    setAnchor([menu_name, event.currentTarget])
    setExpanded(true)
  };

  const handleCloseMenu = () => {
    setAnchor([null, null])
    setExpanded(false)
  }

  const [searchValue, setSearchValue] = useState('')
  const [autocompleteOptions, setAutocompleteOptions] = useState([])
  const inputRef = useRef()
  const [openAutocomplete, setOpenAutocomplete] = useState(false)

  const getAutocomplete = async (searchValue) => {
    if (!searchValue) {
      setAutocompleteOptions([])
      return
    }
    let response = await axiosGet(`${BASE_API}/pages/search/autocomplete?ctext=${searchValue}`)
    if (!response || response.code !== 200) {
      setAutocompleteOptions([])
    } else {
      setAutocompleteOptions(response.data)
    }
  }

  useEffect(() => {
    let debounceTimer = setTimeout(() => getAutocomplete(searchValue), 100)
    return () => clearTimeout(debounceTimer)
  }, [searchValue])

  const navigate = useNavigate()


  const onClickSearchIcon = () => {
    if (openSearch && searchValue) {
      goToSearch(searchValue)
    } else {
      setOpenSearch(true)
    }
  }

  useEffect(() => {
    if (openSearch) {
      inputRef.current.focus()
      // setOpenAutocomplete(true)
    }
    else {
      unlockScroll()
      setOpenAutocomplete(false)
    }
  }, [openSearch])

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && openSearch && searchValue) {
      goToSearch(searchValue)
    } else if (event.key === 'Escape') {
      setOpenAutocomplete(false)
      setOpenSearch(false)
    }
  }

  useEffect(() => {
    if (openAutocomplete) lockScroll()
    else unlockScroll()
  }, [openAutocomplete])

  const goToSearch = (word) => {
    inputRef.current.blur()
    setOpenAutocomplete(false)
    if (searchPageMatch?.pathnameBase === '/search') {
      searchParams.set('terms', word)
      setSearchParams(searchParams)
    } else {
      navigate(`/search?terms=${encodeURIComponent(word)}`)
    }
  }

  const [avaMenu, setAvaMenu] = useState(null)
  const openAvaMenu = (e) => {
    setAvaMenu(e.currentTarget)
  }

  const closeAvaMenu = (e) => {
    setAvaMenu(null)
  }

  const logout = () => {
    localStorage.setItem('access_token', '')
    window.location.reload()
  }

  const getAutocompleteString = (option) => {
    if (!searchValue) return <></>
    return (
      <Typography style={{ fontWeight: 'bold' }} className={classes.autocompleteOption} gutterBottom>
        {option.split(' ').map((word, index) => {
          if (!searchValue.includes(word)) return word + ' '
          return <span
            key={index}
            style={{ fontWeight: 'normal' }}
          >{word} </span>
        })}
      </Typography>
    )
  }

  const smallLayout = useMediaQuery('(max-width:1100px)')
  const [openMenuDrawer, setOpenMenuDrawer] = useState(false)
  const [unreadAmount, setUnreadAmount] = useState(0)

  const location = useLocation()
  const pathname = location.pathname
  const route = pathname.split('/')[1]
  useEffect(() => {
    if (route !== 'search') setOpenSearch(false)
  }, [route])

  let lockNavBar = anchor[0] !== null || openAutocomplete

  return (
    <div>
      <HideOnScroll handleCloseMenu={handleCloseMenu} lock={lockNavBar}>
        <AppBar
          color="default"
          style={{
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.common.white,
          }}
        >
          <Toolbar
            style={{
              justifyContent: 'space-between',
              paddingLeft: smallLayout ? theme.spacing(1) : theme.spacing(2),
              paddingRight: smallLayout ? theme.spacing(1) : theme.spacing(2),
              alignItems: 'center',
              height: "60px",
              maxHeight: "60px",
              minHeight: "60px"
            }}
          >

            {/**Logo */}
            {!(openSearch && smallLayout) &&
              <div
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  display: 'flex',
                  marginRight: '16px',
                }}
              >
                {smallLayout && !openSearch &&
                  <IconButton onClick={() => setOpenMenuDrawer(true)} size='small' style={{ marginRight: theme.spacing(1) }}>
                    <Dehaze />
                  </IconButton>
                }
                <Link to='/'>
                  <Box display='flex' alignItems='center'>
                    <img
                      src={LogoIcon}
                      style={{
                        width: '100px',
                        objectFit: 'contain',
                        marginBottom: '3px'
                      }}
                    />

                    {/* <Avatar src={LogoIcon} />
                    <Typography
                      style={{
                        cursor: "pointer",
                        fontWeight: theme.typography.fontWeightMedium,
                        marginLeft: theme.spacing(1.5)
                      }}
                      variant="h5"
                    >
                      Books
                    </Typography> */}
                  </Box>
                </Link>
              </div>
            }

            {/**Menu */}
            {!smallLayout &&
              <div
                style={{
                  display: openSearch ? 'none' : 'flex',
                  flexGrow: 1,
                  paddingLeft: theme.spacing(8),
                  height: '100%',
                  gap: theme.spacing(3)
                }}
              >
                <div
                  className={classes.menuBox}
                  onClick={handleExpandClick('menu-sach')}
                >
                  <Typography variant="body2">Mua</Typography>
                  <ExpandMore
                    className={classes.expandIcon}
                    style={{ display: (anchor[0] === 'menu-sach') ? 'block' : 'none' }}
                  />
                </div>
                <div
                  className={classes.menuBox}
                  onClick={handleExpandClick('menu-ban-do-cu')}
                >
                  <Typography variant="body2">Bán đồ cũ</Typography>
                  <ExpandMore
                    className={classes.expandIcon}
                    style={{ display: (anchor[0] === 'menu-ban-do-cu') ? 'block' : 'none' }}
                  />
                </div>
                <div
                  className={classes.menuBox}
                  onClick={handleExpandClick('menu-nap-credit')}
                >
                  <Typography variant="body2">Quản lý credit</Typography>
                  <ExpandMore
                    className={classes.expandIcon}
                    style={{ display: (anchor[0] === 'menu-nap-credit') ? 'block' : 'none' }}
                  />
                </div>
                <div
                  className={classes.menuBox}
                >
                  <Typography variant="body2">Quyên góp</Typography>
                  <Link to='/quyen-gop' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  </Link>
                </div>

                <div
                  className={classes.menuBox}
                >
                  <Typography variant="body2">Sales</Typography>
                  <Link to={{
                    pathname: '/',
                    hash: '#sale'
                  }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                </div>
                <div
                  className={classes.menuBox}
                >
                  <Typography variant="body2">Đăng ký shop</Typography>
                  <Link to='/doc-viewer/shop-learn-more' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  </Link>
                </div>
                <div
                  className={classes.menuBox}
                  onClick={() => window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })}
                >
                  <Typography variant="body2">Liên hệ</Typography>
                </div>

              </div>
            }
            {/**Search */}
            {openSearch &&
              <>
                <IconButton
                  onClick={() => { setOpenSearch(false) }}
                  size="medium"
                  className={classes.iconButton}
                >
                  <ArrowBack fontSize="inherit"></ArrowBack>
                </IconButton>
                <Box marginLeft={1} />
                <Autocomplete
                  open={openAutocomplete}
                  onOpen={() => setOpenAutocomplete(true)}
                  options={autocompleteOptions}
                  getOptionLabel={option => option}
                  renderOption={(option) =>
                    getAutocompleteString(option)
                  }
                  fullWidth
                  value={searchValue}
                  openOnFocus
                  autoComplete
                  blurOnSelect
                  onInputChange={(event, newValue) => {
                    setSearchValue(newValue);
                  }}
                  onChange={(event, newValue) => {
                    setSearchValue(newValue)
                    if (newValue)
                      goToSearch(newValue)
                  }}
                  freeSolo
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      id="search_input"
                      variant="outlined"
                      placeholder="Tìm kiếm..."
                      size="small"
                      inputRef={inputRef}
                      onKeyDown={onKeyDown}
                    />
                  }
                  PopperComponent={(props) =>
                    smallLayout ?
                      <Popper
                        {...props}
                        anchorEl={null}
                        placement='bottom'
                        style={{ width: '100vw', top: '56px', height: 'calc(100vh - 56px)' }}
                        onTouchStart={() => inputRef.current.blur()}
                      />
                      :
                      <ClickAwayListener
                        onClickAway={(e) => {
                          if (e.target !== inputRef.current) {
                            setOpenAutocomplete(false)
                          }

                        }}
                      >
                        <Popper
                          {...props}
                        />
                      </ClickAwayListener>
                  }
                  PaperComponent={(props) =>
                    smallLayout ?
                      <Paper {...props} elevation={0} square style={{ height: '100%' }} />
                      :
                      <Paper {...props} />
                  }
                  ListboxProps={{
                    style: {
                      height: '100%',
                      maxHeight: 'calc(100% - 150px)',
                      overscrollBehavior: 'contain'
                    },
                  }}
                />
                {/* </ClickAwayListener> */}
                <Box marginLeft={1} />
              </>
            }
            {/**User */}
            <div
              style={{
                display: 'flex',
                // justifyContent: 'space-between',
                alignItems: 'center',
                height: "100%",
                // marginLeft: theme.spacing(3)
                width: 'fit-content',
                minWidth: 'fit-content'
              }}
            >
              <IconButton onClick={onClickSearchIcon}
                className={classes.iconButton}
              >
                <Search></Search>
              </IconButton>
              {!(openSearch && smallLayout) &&
                <>
                  {signed_in &&
                    <Box className={classes.tabBox}
                      onClick={handleExpandClick('notifications')}
                    >
                      <IconButton
                        className={classes.iconButton}
                      >
                        <Badge badgeContent={unreadAmount} color="secondary">
                          <Notifications color='action' />
                        </Badge>
                      </IconButton>
                    </Box>
                  }
                  <Box className={classes.tabBox}>
                    <NavLink to='/cart'>
                      <IconButton
                        className={classes.iconButton}
                      >
                        <Badge badgeContent={cartLength || 0} color="secondary">
                          <ShoppingBasket color='action' />
                        </Badge>
                      </IconButton>
                    </NavLink>
                  </Box>
                </>
              }
              {!smallLayout && signed_in &&
                <>
                  {/* <Box className={classes.tabBox}>
                    <Typography variant="body2">
                      5 stars
                    </Typography>
                  </Box> */}
                  <Box className={classes.tabBox}>
                    <Typography variant="body2">
                      {!!credit ? numberWithCommas(credit) : 0}đ
                    </Typography>
                  </Box>
                </>
              }
              {!(openSearch && smallLayout) &&
                <Box className={classes.tabBox} style={{ cursor: 'pointer' }}>
                  {signed_in ? (
                    <>
                      <Avatar src={`${BASE_FILE}/${avatar?.thumb_url}`} onClick={openAvaMenu} />
                      <Menu
                        anchorEl={avaMenu}
                        open={!!avaMenu}
                        onClose={closeAvaMenu}
                        // onMouseOut={closeAvaMenu}
                        // onMouseLeave={() => { closeAvaMenu() }}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                        // anchorPosition={{
                        //   top: 100,
                        // }}
                        PaperProps={{
                          style: {
                            // left: '50%',
                            transform: 'translate(12px, 15px)',
                          },
                        }}
                      >
                        <Link to='/profile'>
                          <MenuItem
                            onClick={() => { closeAvaMenu() }}
                          >
                            <ListItemIcon>
                              <Person />
                            </ListItemIcon>
                            Tài khoản
                          </MenuItem>
                        </Link>
                        <Link to='/buy-order'>
                          <MenuItem
                            onClick={() => { closeAvaMenu() }}
                          >
                            <ListItemIcon>
                              <Receipt />
                            </ListItemIcon>
                            Đơn mua
                          </MenuItem>
                        </Link>
                        <Link to='/don-tra-hang'>
                          <MenuItem
                            onClick={() => { closeAvaMenu() }}
                          >
                            <ListItemIcon>
                              <AssignmentReturnOutlined />
                            </ListItemIcon>
                            Đơn trả hàng
                          </MenuItem>
                        </Link>
                        <Link to='/deposit-order'>
                          <MenuItem
                            onClick={() => { closeAvaMenu() }}
                          >
                            <ListItemIcon>
                              <PostAdd />
                            </ListItemIcon>
                            Đơn bán đồ cũ
                          </MenuItem>
                        </Link>
                        <Link to='/hang-hoan-tra'>
                          <MenuItem
                            onClick={() => { closeAvaMenu() }}
                          >
                            <ListItemIcon>
                              {/* <PostAdd />
                               */}
                              <AssignmentReturn />
                            </ListItemIcon>
                            Đơn hoàn trả
                          </MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => { closeAvaMenu(); logout() }}
                        >
                          <ListItemIcon>
                            <ExitToApp style={{ color: 'red' }} />
                          </ListItemIcon>
                          <span style={{ color: 'red' }}>
                            Đăng xuất</span>
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Typography variant="body2" color="primary" onClick={signIn} style={{ cursor: 'pointer', marginRight: theme.spacing(1) }}>
                      Sign in
                    </Typography>
                  )}

                </Box>
              }

            </div>
          </Toolbar>
          <CategoryBar />
          <MenuSach
            open={anchor[0] === 'menu-sach'}
            anchor={anchor[1]}
            handleCloseMenu={handleCloseMenu}
          />
          <MenuBanDoCu
            open={anchor[0] === 'menu-ban-do-cu'}
            anchor={anchor[1]}
            handleCloseMenu={handleCloseMenu}
          />
          <MenuNapCredit
            open={anchor[0] === 'menu-nap-credit'}
            anchor={anchor[1]}
            handleCloseMenu={handleCloseMenu}
          />
          <MenuGioiThieu
            open={anchor[0] === 'menu-gioi-thieu'}
            anchor={anchor[1]}
            handleCloseMenu={handleCloseMenu}
          />
          <NotificationBox
            open={anchor[0] === 'notifications'}
            handleCloseMenu={handleCloseMenu}
            setUnreadAmount={setUnreadAmount}
          />
        </AppBar>
      </HideOnScroll>
      <MenuDrawer
        open={openMenuDrawer}
        onClose={() => setOpenMenuDrawer(false)}
      />
    </div >
  )
}


export default Navbar
