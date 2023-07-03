import { Backdrop, Box, Drawer, List, ListItem, ListItemText, Typography, useTheme } from '@material-ui/core'
import { ChevronRight, HomeOutlined, Star } from '@material-ui/icons'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FANPAGE_URL, WEB_SHOP_URL } from '../constants'
import useScrollLock from '../ultils/useScrollLock'
import MenuDeveloping from './DrawerMenu/MenuDeveloping'
import MenuNapCredit from './DrawerMenu/MenuNapCredit'
import MenuSach from './DrawerMenu/MenuSach'
import MenuUseCredit from './DrawerMenu/MenuUseCredit'

const MenuDrawer = ({ open, onClose }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState('')
  const { lockScroll, unlockScroll } = useScrollLock()

  useEffect(() => {
    if (open) lockScroll()
    else unlockScroll()
  }, [open])
  return (
    <>
      <Drawer
        variant="persistent"
        anchor='left'
        open={open}
        // onClose={(e, reason) => onClose()}
        // onOpen={() => { }}
        onClose={onClose}
      >
        <Box width='300px' height='100%' style={{ backgroundColor: 'white' }}
          id='menu-drawer-child'
        >
          <Section
            title={'Maxmin'}
            icon={<HomeOutlined />}
            onClick={() => { navigate('/'); onClose(); setCurrentTab('') }}
          >
          </Section>
          <Separater />
          <Section
            title={'Mua'}
          >
            <List disablePadding style={{ marginTop: theme.spacing(1) }}>
              <Item name='Sale' onClick={() => { navigate('/#sale'); onClose(); setCurrentTab('') }} />
              <MenuSach onClose={onClose} currentTab={currentTab} setCurrentTab={setCurrentTab} />
            </List>
          </Section>
          <Separater />
          <Section
            title={'Bán đồ cũ'}
          >
            <List disablePadding style={{ marginTop: theme.spacing(1) }}>
              <Item name='Lên đồ muốn bán' onClick={() => { navigate('/chon-mat-hang'); onClose(); setCurrentTab('') }} />
              <Item name='Danh sách đơn bán' onClick={() => { navigate('/deposit-order'); onClose(); setCurrentTab('') }} />
              <Item name='Về bán đồ cũ cho Maxmin' onClick={() => { navigate('/doc-viewer/learn-more'); onClose(); setCurrentTab('') }} />
              <Item name='Xử lý khiếu nại' onClick={() => { navigate('/doc-viewer/handle-complaint'); onClose(); setCurrentTab('') }} />
            </List>
          </Section>
          <Separater />
          <Section
            title={'Quản lý credit'}
          >
            <List disablePadding style={{ marginTop: theme.spacing(1) }}>
              <MenuNapCredit onClose={onClose} currentTab={currentTab} setCurrentTab={setCurrentTab} />
              <MenuUseCredit onClose={onClose} currentTab={currentTab} setCurrentTab={setCurrentTab} />
            </List>
          </Section>
          <Separater />
          <Section
            title={'Đăng ký shop'}
            icon={<ChevronRight />}
            onClick={() => {
              navigate('/doc-viewer/shop-learn-more')
              onClose()
              setCurrentTab('')
            }}
          >
          </Section>
          <Separater />
          <Section
            title={'Tính năng khác'}
          >
            <List disablePadding style={{ marginTop: theme.spacing(1) }}>
              <Item name='Quyên góp' onClick={() => { navigate('/quyen-gop'); onClose(); setCurrentTab('') }} />
              <MenuDeveloping onClose={onClose} currentTab={currentTab} setCurrentTab={setCurrentTab} />
            </List>
          </Section>
          <Separater />
          <Section
            title={'Liên hệ'}
            icon={<ChevronRight />}
            onClick={() => {
              window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })
              onClose()
              setCurrentTab('')
            }}
          >
          </Section>
        </Box>
      </Drawer>
      <Backdrop open={open} onClick={onClose} style={{ zIndex: theme.zIndex.drawer - 1 }} />
    </>
  )
}
export default MenuDrawer

const Item = ({ onClick, name }) => {
  return (
    <ListItem button onClick={onClick} style={{ paddingLeft: 0, paddingRight: 0 }}>
      <ListItemText>{name}</ListItemText>
    </ListItem>
  )
}

const Section = ({ title, children, icon, onClick = () => { } }) => {
  return (
    <Box
      width='100%'
      padding={'20px'}
      bgcolor='white'
      paddingY={'12px'}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        onClick={onClick}
      >
        <Typography style={{ fontWeight: 600, fontSize: '19px' }}>{title}</Typography>
        {icon}
      </Box>
      {children}
    </Box>
  )
}

const Separater = () => <Box width='100%' height='5px' style={{ backgroundColor: '#d5dbdb' }} />
