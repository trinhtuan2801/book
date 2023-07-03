import { Backdrop, Box, ClickAwayListener, Paper, Popper, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import CommentPopup from "../../CommonComponent/CommentPopup/CommentPopup"
import { BASE_API } from "../../constants"
import { refreshNotification } from "../../redux/rootReducer"
import { axiosPatch } from "../../ultils/axiosUtils"
import useGetNotifications from "../../ultils/useGetNotifications"
import useScrollLock from "../../ultils/useScrollLock"
import Notification from "./Notification"
import NotificationSkeleton from "./NotificationSkeleton"

const OutsideWrapper = (props) => {
  const { children } = props

  if (props.smallLayout) return (
    <>
      {children}
      <Backdrop open={true}
        onClick={() => {
          props.handleCloseMenu()
        }}
      />
    </>
  )

  return (
    <ClickAwayListener onClickAway={props.handleCloseMenu}>
      {children}
    </ClickAwayListener>
  )
}

const NotificationBox = (props) => {
  const [offset, setOffset] = useState(0)
  const { refresh_notification } = useSelector(state => state.root)
  const dispatch = useDispatch()
  const { loading, error, hasMore, notifications, nunread } = useGetNotifications(offset, refresh_notification)
  const theme = useTheme()
  const smallLayout = useMediaQuery('(max-width:800px)')
  const [openComment, setOpenComment] = useState(false)
  const [commentData, setCommentData] = useState({})
  useEffect(() => {
    props.setUnreadAmount(nunread)
  }, [nunread])

  const observer = useRef()

  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const markAllAsRead = async () => {

    let response = await axiosPatch(`${BASE_API}/users/notifications/*`, {
      "field_name": "read",
      "value": true
    }, true)
    if (response?.code === 200) dispatch(refreshNotification())
  }

  useEffect(() => {
    if (!props.open)
      dispatch(refreshNotification())
  }, [props.open])

  return (
    <Popper
      open={props.open}
      anchorEl={null}
      placement="bottom-start"
      disablePortal
      modifiers={{
        preventOverflow: { padding: 0 },
      }}
      style={{
        zIndex: 'inherit',
        position: 'fixed',
        right: 15, top: 55, left: 'none',
        width: '368px',
        maxWidth: 'calc(100vw - 30px)',
        height: 'fit-content',
      }}
    >
      <Paper elevation={3}
        style={{
          width: '100%',
          height: 'fit-content',
          position: 'relative'
        }}
      >
        {/* <ClickAwayListener onClickAway={props.handleCloseMenu}>
          <div></div>
        </ClickAwayListener> */}
        <OutsideWrapper
          handleCloseMenu={props.handleCloseMenu}
          smallLayout={smallLayout}
        >
          <Box
            width='100%'
            height='fit-content'
            maxHeight={`calc(100vh - ${smallLayout ? 180 : 75}px)`}
            minHeight='400px'
            boxSizing='border-box'
            paddingTop={2}
            paddingX={1}
            style={{ overflowY: 'scroll', overscrollBehavior: 'contain' }}
            className={smallLayout ? '' : 'custom-scroll-bar'}
          >
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h5' style={{ fontWeight: 'bold', marginLeft: theme.spacing(1) }}>Thông báo</Typography>
              {nunread > 0 &&
                <Typography
                  style={{ color: '#65676B', textAlign: 'end', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', marginRight: theme.spacing(1) }}
                  variant='body2'
                  onClick={markAllAsRead}
                >Đánh dấu đã đọc tất cả</Typography>
              }
            </Box>

            {!loading && !notifications.length &&
              <Typography style={{ marginLeft: theme.spacing(1) }}>Bạn chưa có thông báo nào</Typography>
            }
            <Box marginTop={1} />
            {notifications.map((noti, index) =>
              <Notification
                key={index}
                {...noti}
                handleCloseMenu={props.handleCloseMenu}
                setCommentData={setCommentData}
                setOpenComment={setOpenComment}
              />
            )}
            {!error && hasMore &&
              <>
                <div ref={lastElementRef} />
                <NotificationSkeleton />
                <NotificationSkeleton />
              </>
            }
            <Box marginTop={1} />
            <CommentPopup
              ctype={commentData?.ctype}
              oid={commentData?.oid}
              thumb_url={commentData?.thumb_url}
              title={commentData?.title}
              open={openComment}
              onClose={() => setOpenComment(false)}
            />
          </Box>
        </OutsideWrapper>

      </Paper>

    </Popper >
  )
}

export default NotificationBox