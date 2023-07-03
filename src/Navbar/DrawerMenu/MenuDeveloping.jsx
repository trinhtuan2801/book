import { Collapse, List, ListItem, ListItemText, Typography, useTheme } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const methods = [
  {
    method_name: "Mượn sách",
    description: "",
    link: "/",
    icon: null,
  },
  {
    method_name: "Đổi thẻ mua sắm",
    description: "",
    link: "/",
    icon: null,
  },
];

const MenuDeveloping = ({ onClose, currentTab, setCurrentTab }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  useEffect(() => {
    if (currentTab !== 'developing') setOpen(false)
  }, [currentTab])

  return (
    <>
      <ListItem
        button
        onClick={() => { setOpen(prev => !prev); setCurrentTab('developing') }}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <ListItemText>
          <Typography
            color={open ? 'primary' : 'textPrimary'}
            style={{ fontWeight: open ? 'bold' : 'normal' }}
          >
            Tính năng đang phát triển
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
            >
              <ListItemText>
                <Typography color='textSecondary'>{method.method_name}</Typography>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Collapse>
    </>
  );
};

export default MenuDeveloping;
