import { Box, ClickAwayListener, Divider, Grid, makeStyles, Paper, Popper, Typography, useTheme } from "@material-ui/core";
import { AccountBalanceWallet, Cake, CardGiftcard, Clear, CreditCard, MenuBook } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  menu: {
    width: '100vw',
    height: 'calc(100vh - 200px)',
    position: 'relative',
    overflow: 'scroll'
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
    method_name: 'Bằng đồ cũ',
    description: 'Đổi đồ cũ lấy credit mua đồ mới',
    link: '/chon-mat-hang',
    icon: <MenuBook />,
  },
  {
    method_name: 'Bằng thẻ ngân hàng',
    description: 'Mua thêm credit bằng thẻ ngân hàng',
    link: '/nap-credit-bank',
    icon: <CreditCard />,
  },
  {
    method_name: 'Bằng thẻ quà tặng',
    description: 'Thẻ quà tặng từ Maxmin hay từ bạn bè',
    link: '/nap-credit-gift',
    icon: <CardGiftcard />,
  },
]

const use_methods = [
  {
    method_name: 'Mua đồ mới',
    description: '',
    link: '/',
    icon: <Cake />,
  },
  {
    method_name: 'Tạo thẻ quà tặng cho bạn bè',
    description: 'Tặng bạn bè credit của bạn qua mã quà tặng',
    link: '/tao-ma-the',
    icon: <Cake />,
  },
  {
    method_name: 'Biến động số dư',
    description: 'Chi tiết từng thay đổi số tiền chi tiêu, nạp vào của bạn tại Maxmin',
    link: '/profile#bang-so-du',
    icon: <Cake />,
  },
  {
    method_name: "Rút tiền về tài khoản",
    description: "Chuyển credit thành tiền thật",
    link: "/rut-tien",
    icon: <AccountBalanceWallet />,
  },
]

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

const header_list_space = 2.5
const list_space = 2

const MenuNapCredit = (props) => {
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
      style={{ zIndex: 'inherit' }}
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
                  minWidth: '300px',
                  maxWidth: '350px',
                  boxSizing: 'border-box'
                }}
              >
                <Typography variant="h5" style={{ fontWeight: '500' }}>
                  Khám phá các cách khác nhau để sử dụng số tiền bạn đã có cùng Maxmin
                </Typography>
                <Box
                  style={{ marginTop: theme.spacing(5) }}
                >
                  <Typography variant="body2">
                    Ngoài mua hàng tại Maxmin, tiền của bạn còn có thể sử dụng theo nhiều cách khác nhau, cùng khám phá các lựa chọn bên cạnh nhé!
                  </Typography>
                  <Box marginTop={1.5} />
                  <Typography variant="body2">
                    Nhưng bước đầu tiên bạn nhớ gia tăng credit của mình bằng cách&nbsp;
                    <Link
                      to='/nap-credit-sach'
                    >
                      <b onClick={props.handleCloseMenu} className={`${classes.link} ${classes.hover_underline}`} >gửi đồ cũ cho cộng đồng Maxmin</b>
                    </Link>
                    &nbsp;nha!
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
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>Sử dụng credit</Typography>
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
                  </Box>
                  <Box marginX={3}>
                    <Divider orientation="vertical" />
                  </Box>
                  <Box flexGrow={1} flexBasis={0}>
                    <Typography variant='h5' style={{ fontWeight: 'bold' }}>Nạp credit</Typography>
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


export default MenuNapCredit
