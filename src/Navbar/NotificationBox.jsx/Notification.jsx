import { Avatar, Box, Card, CardActionArea, CardContent, makeStyles, Typography, useTheme } from "@material-ui/core";
import { cyan, green, orange, pink, yellow } from "@material-ui/core/colors";
import { Cancel, ChatBubbleOutlineRounded, FiberManualRecord, LocalOffer, LocalShipping, MonetizationOn, Receipt, Send } from "@material-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentPopup from "../../CommonComponent/CommentPopup/CommentPopup";
import { BASE_API } from "../../constants";
import { axiosPatch } from "../../ultils/axiosUtils";
import { useDispatch } from "react-redux";
import { refreshNotification } from "../../redux/rootReducer";

const useStyles = makeStyles((theme) => ({
  ellipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical"
  },

  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: '#fff',
    backgroundColor: green[500],
  },
  cyan: {
    color: '#fff',
    backgroundColor: cyan[500],
  },
  orange: {
    color: '#fff',
    backgroundColor: orange[500]
  }
}))

function getTimeDiff(time2, time1) {
  const second_diff = Math.abs(Math.floor((time2.getTime() - time1.getTime()) / 1000))
  const minute_diff = Math.floor(second_diff / 60)
  const hour_diff = Math.floor(minute_diff / 60)
  const day_diff = Math.floor(hour_diff / 24)
  const week_diff = Math.floor(day_diff / 7)
  const month_diff = Math.floor(week_diff / 4)
  if (month_diff > 0) return `${month_diff} tháng trước`
  if (week_diff > 0) return `${week_diff} tuần trước`
  if (day_diff > 0) return `${day_diff} ngày trước`
  if (hour_diff > 0) return `${hour_diff} giờ trước`
  if (minute_diff > 0) return `${minute_diff} phút trước`
  return `1 phút trước`
}

const AvaIcon = ({ ntype }) => {
  const classes = useStyles()
  let icon, className
  switch (ntype) {
    case 'ORDERED_CART_APPROVED': icon = <Send />; className = classes.cyan; break
    case 'ORDERED_CART_SHIPPING': icon = <LocalShipping />; className = classes.cyan; break
    case 'DEPOSIT_CART_PRICED': icon = <LocalOffer />; className = classes.cyan; break
    case 'DEPOSIT_CART_REJECTED': icon = <Cancel />; className = classes.pink; break
    case 'ACTION_REQUIRED': icon = <></>; className = classes.green; break
    case 'CREDIT_ADDED': icon = <MonetizationOn />; className = classes.green; break
    case 'CREDIT_SUBTRACTED': icon = <Receipt />; className = classes.pink; break
    case 'ASK_COMMENT': icon = <ChatBubbleOutlineRounded />; className = classes.orange; break
  }

  return (
    <Avatar className={className}>
      {icon}
    </Avatar>
  )

}

const Notification = ({
  ntype,
  title,
  body,
  turl,
  data,
  ntime,
  read,
  rtime,
  handleCloseMenu,
  _id,
  setOpenComment,
  setCommentData
}) => {
  const theme = useTheme()
  const classes = useStyles()
  const navigate = useNavigate()
  const [clicked, setClicked] = useState(false)

  const onClick = async () => {
    setClicked(true)
    let response = await axiosPatch(`${BASE_API}/users/notifications/${_id}`, {
      "field_name": "read",
      "value": true
    }, true)
    if (!response || response.code !== 200) return
    if (ntype === 'ASK_COMMENT') {
      setOpenComment(true)
      setCommentData({
        ctype: data?.ctype,
        oid: data?.oid,
        thumb_url: data?.thumb_url,
        title: data?.title,
      })
    }
    else {
      navigate(turl)
      handleCloseMenu()
    }
  }

  return (
    <>
      <Card elevation={0}>
        <CardActionArea onClick={onClick}>
          <CardContent style={{ padding: theme.spacing(1) }}>
            <Box
              width='100%'
              display='flex'
              justifyContent='space-between'
            >
              <Box display='flex'>
                <AvaIcon ntype={ntype} />
                <Box marginLeft={1}>
                  <Typography
                    variant='body2'
                    className={classes.ellipsis}
                    style={{ color: (clicked || read) ? '#65676B' : '#050505' }}
                  ><b>{title}.</b> {body}</Typography>
                  <Typography
                    variant='body2'
                    style={{ color: (clicked || read) ? '#65676B' : '#1876F2' }}
                  >{!!ntime && getTimeDiff(new Date(), new Date(ntime))}</Typography>
                </Box>
              </Box>

              <Box display='flex' alignItems='center' marginLeft={1} minWidth='18px'>
                {!read && !clicked &&
                  <FiberManualRecord style={{ color: '#1876F2', fontSize: '18px' }} />
                }
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

    </>
  )
}

export default Notification