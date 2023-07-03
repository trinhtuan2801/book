import { Box, Collapse, List, ListItem, ListItemText, Typography, useTheme } from "@material-ui/core";
import { AccountBalanceWallet, Cake, CardGiftcard, CreditCard, ExpandLess, ExpandMore, MenuBook } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const methods = [
  {
    method_name: "Mua đồ mới",
    description:
      "Đổi đồ cũ lấy credit mua đồ mới",
    link: "/",
    icon: <MenuBook />,
  },
  {
    method_name: "Tạo mã quà tặng",
    description: "Mua thêm credit bằng thẻ ngân hàng",
    link: "/tao-ma-the",
    icon: <CardGiftcard />,
  },
  {
    method_name: "Biến động số dư",
    description: "Thẻ quà tặng từ Maxmin hay từ bạn bè",
    link: "/profile#bang-so-du",
    icon: <AccountBalanceWallet />,
  },
  {
    method_name: "Rút tiền về tài khoản",
    description: "Chuyển credit thành tiền thật",
    link: "/rut-tien",
    icon: <AccountBalanceWallet />,
  },
];

const MenuUseCredit = ({ onClose, currentTab, setCurrentTab }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  useEffect(() => {
    if (currentTab !== 'use-credit') setOpen(false)
  }, [currentTab])
  // const [fbOpen, setFbOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  return (
    <>
      <ListItem
        button
        onClick={() => { setOpen(prev => !prev); setCurrentTab('use-credit') }}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <ListItemText>
          <Typography
            color={open ? 'primary' : 'textPrimary'}
            style={{ fontWeight: open ? 'bold' : 'normal' }}
          >
            Sử dụng credit
          </Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          {methods.map((method, index) =>
            <ListItem
              key={index}
              button
              style={{ paddingLeft: theme.spacing(2) }}
              onClick={() => {
                navigate(method.link); onClose()
              }}
            >
              <ListItemText>
                <Box display='flex'>
                  <Typography>{method.method_name}</Typography>
                </Box>
              </ListItemText>

            </ListItem>
          )}
        </List>
      </Collapse>

    </>
  );
};

export default MenuUseCredit;
