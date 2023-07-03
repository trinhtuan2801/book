import { Box, Collapse, List, ListItem, ListItemText, Typography, useTheme } from "@material-ui/core";
import { Cake, CardGiftcard, CreditCard, ExpandLess, ExpandMore, MenuBook } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const methods = [
  {
    method_name: "Bằng đồ cũ",
    description:
      "Đổi đồ cũ lấy credit mua đồ mới",
    link: "/nap-credit-sach",
    icon: <MenuBook />,
  },
  {
    method_name: "Bằng thẻ ngân hàng",
    description: "Mua thêm credit bằng thẻ ngân hàng",
    link: "/nap-credit-bank",
    icon: <CreditCard />,
  },
  {
    method_name: "Bằng thẻ quà tặng",
    description: "Thẻ quà tặng từ Maxmin hay từ bạn bè",
    link: "/nap-credit-gift",
    icon: <CardGiftcard />,
  },
];

const MenuNapCredit = ({ onClose, currentTab, setCurrentTab }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  useEffect(() => {
    if (currentTab !== 'nap-credit') setOpen(false)
  }, [currentTab])
  // const [fbOpen, setFbOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  return (
    <>
      <ListItem
        button
        onClick={() => { setOpen(prev => !prev); setCurrentTab('nap-credit') }}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <ListItemText>
          <Typography
            color={open ? 'primary' : 'textPrimary'}
            style={{ fontWeight: open ? 'bold' : 'normal' }}
          >
            Nạp credit
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

export default MenuNapCredit;
