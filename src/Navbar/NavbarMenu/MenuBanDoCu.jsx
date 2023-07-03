import { Box, ClickAwayListener, Divider, Grid, makeStyles, Paper, Popper, Typography, useTheme } from "@material-ui/core";
import { AccountBalanceWallet, Cake, CardGiftcard, Clear, CreditCard, MenuBook } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  menu: {
    width: '100vw',
    height: 'calc(100vh - 350px)',
    position: 'relative',
    overflow: 'scroll', 
    boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2), 0 6px 2px -2px rgba(0, 0, 0, 0.19)'
  },
  container: {
    height: '100%',
  },
  exitIcon: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3)
  },
  link: {
    '& p': {
      transition: 'transform 0.2s ease-in-out'
    },
    '&:hover': {
      color: '#303f9f',
      cursor: 'pointer',
      '& p': {
        transform: 'translateX(5%)',
      }
    },
  },
  link_developing: {
    color: 'grey'
  },
  hover_underline: {
    textDecoration: 'underline'

  }
}))

const add_methods = [
  {
    method_name: 'Giới thiệu về bán đồ cũ cho Maxmin',
    description: 'Mọi đồ còn giá trị sử dụng chúng tôi đều có shop thu mua nhanh chóng',
    link: '/doc-viewer/learn-more',
    icon: <MenuBook />,
  },
  {
    method_name: 'Xử lý khiếu nại',
    description: 'Luôn đặt sự hài lòng và quyền lợi của người dùng lên cao nhất',
    link: '/doc-viewer/handle-complaint',
    icon: <CreditCard />,
  }
]

const use_methods = [
  {
    method_name: 'Lên đồ muốn bán',
    description: 'Liệt kê các mặt hàng cũ bạn có để bán cho Maxmin',
    link: '/chon-mat-hang',
    icon: <Cake />,
  },
  {
    method_name: 'Danh sách đơn bán',
    description: 'Quản lý các đơn bán đồ cũ của bạn',
    link: '/deposit-order',
    icon: <Cake />,
  }
]

/*
const developing_use_methods = [
  {
    method_name: 'Mượn sách',
    description: 'Đọc ngàn đầu sách với chi phí thấp nhất',
    link: '',
    icon: <Cake />,
  },
  {
    method_name: 'Đổi thẻ mua sắm',
    description: 'Thẻ mua hàng của hầu hết các thương hiệu phổ biến, đồ tiêu dùng hàng ngày',
    link: '',
    icon: <Cake />,
  },
]
*/

const header_list_space = 2.5
const list_space = 2

const MenuBanDoCu = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Popper
      open={props.open}
      anchorEl={props.open ? props.anchor : null}
      placement="bottom"
      disablePortal
      modifiers={{ preventOverflow: { padding: 0 } }}
      style={{ zIndex: 'inherit'}}
    >
      <Paper>
        <ClickAwayListener onClickAway={props.handleCloseMenu}>
          <Box className={classes.menu}>
            <Clear className={classes.exitIcon} onClick={props.handleCloseMenu}></Clear>
            <Box width='100%' height='100%' display='flex'>
              <Box
                style={{
                  height: '100%',
                  paddingTop: theme.spacing(3),
                  paddingLeft: theme.spacing(3),
                  paddingRight: theme.spacing(2),
                  width: '50%',
                  //minWidth: '500px',
                  //maxWidth: '550px',
                  boxSizing: 'border-box'
                }}
              >
                <Typography variant="h5" style={{ fontWeight: '500' }}>
                  Mang giá trị mới tới mọi đồ cũ
                </Typography>
                <Box
                  style={{ marginTop: theme.spacing(3), maxWidth: '380px'}}
                >
                  <Typography variant="body2">
                    Với hệ thống shop đối tác trên cả nước, cùng quy trình đảm bảo quyền lời người dùng sẽ giúp bạn bán mọi đồ cũ mình có với giá cao nhất, nhanh nhất và hài lòng nhất.
                  </Typography>
                  <Typography variant="body2" style={{marginTop: '8px'}}>
                    Giúp ta có thêm thu nhập, giúp người tiết kiệm, cùng bảo vệ tài nguyên, môi trương bằng cách tái sử dụng tối đa nào. 
                  </Typography>
                  <Box marginTop={1.5} />
                  <Typography variant="body2">
                    <Link
                      to='/chon-mat-hang'
                    >
                      <b onClick={props.handleCloseMenu} className={`${classes.link} ${classes.hover_underline}`} >Lên đồ bán ngay</b>
                    </Link>
                    &nbsp;hoặc&nbsp;
                    <Link
                      to='/doc-viewer/learn-more'
                    >
                      <b onClick={props.handleCloseMenu} className={`${classes.link} ${classes.hover_underline}`} >tìm hiểu thêm</b>
                    </Link>
                    &nbsp;nhé!
                  </Typography>
                </Box>
              </Box>
              <Divider orientation="vertical" />
              <Box
                style={{
                  height: '100%',
                  paddingTop: theme.spacing(3),
                  paddingLeft: theme.spacing(3),
                  paddingRight: theme.spacing(3)
                }}
                display='flex'
                flexGrow={1}
                maxWidth='1300px'
              >
                <Box
                  display='flex'
                  width='100%'
                  height='fit-content'
                >
                  <Box flexGrow={1} flexBasis={0}>
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>Đơn bán đồ cũ</Typography>
                    <Box marginTop={header_list_space} />
                    {use_methods.map((method, index) => (
                      <Box
                        className={classes.link}
                        key={index}
                        onClick={() => {
                          navigate(method.link)
                          props.handleCloseMenu()
                        }}
                        marginBottom={list_space}
                      >
                        <Typography>
                          <b>{method.method_name}</b>
                          <br />
                          {method.description}
                        </Typography>
                      </Box>
                    ))}

                    {/*//Development in progress
                    <Box marginY={3}>
                      <Divider />
                    </Box>
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>Tính năng đang phát triển</Typography>
                    <Box marginTop={header_list_space} />

                    {developing_use_methods.map((method, index) => (
                      <Box
                        className={classes.link_developing}
                        key={index}
                        marginBottom={list_space}
                      >
                        <Typography>
                          <b>{method.method_name}</b>
                        </Typography>
                      </Box>
                    ))}
                    */}
                  </Box>
                  <Box marginX={3}>
                    <Divider orientation="vertical" />
                  </Box>
                  <Box flexGrow={1} flexBasis={0}>
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>Tài liệu hướng dẫn</Typography>
                    <Box marginTop={header_list_space} />
                    {add_methods.map((method, index) => (
                      <Box
                        className={classes.link}
                        key={index}
                        onClick={() => {
                          navigate(method.link)
                          props.handleCloseMenu()
                        }}
                        marginBottom={list_space}
                      >
                        <Typography>
                          <b>{method.method_name}</b>
                          <br />
                          {method.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

              </Box>
            </Box>
          </Box>
        </ClickAwayListener>
      </Paper>
    </Popper >
  )

}


export default MenuBanDoCu
