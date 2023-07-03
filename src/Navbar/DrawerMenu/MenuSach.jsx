import { Collapse, List, ListItem, ListItemText, Typography, useTheme } from '@material-ui/core'
import { ExpandLess, ExpandMore, FavoriteBorder } from "@material-ui/icons"
import { Fragment, useEffect, useState } from "react"
import { useLocation, useMatch, useNavigate } from "react-router-dom"
import { BASE_API } from "../../constants"
import { axiosGet } from "../../ultils/axiosUtils"
const MenuSach = ({ onClose, currentTab, setCurrentTab }) => {
  const theme = useTheme()
  const [categoriesV1, setCategoriesV1] = useState([])
  const [categoriesV2, setCategoriesV2] = useState({})
  const [cateIdV1, setCateIdV1] = useState('')
  const [cateIdV2, setCateIdV2] = useState('')
  const navigate = useNavigate()
  // const path = useLocation().pathname
  // let path_cateIdV2 = path.split('?')[0].replace('/book-page/', '')
  const routeMatch1 = useMatch('/book-page/:cateIdV1/*')
  const routeMatch2 = useMatch('/book-page/:cateIdV1/:cateIdV2/*')
  const _cateIdV1 = routeMatch1?.params?.cateIdV1
  const _cateIdV2 = routeMatch2?.params?.cateIdV2

  const [catalogs, setCatalogs] = useState([])

  const onClickCategoryV1 = (idv1) => (event) => {
    if (idv1 !== cateIdV1) {
      setCateIdV1(idv1)
      setCurrentTab('category')
      const drawer = document.getElementById('menu-drawer-child').parentElement
      drawer.scroll({ top: 0, behavior: 'smooth' })
    } else {
      setCateIdV1('')
    }
  }

  const onClickCategoryV2 = (idv1, idv2) => (event) => {
    setCateIdV2(idv2)
    navigate(`/book-page/${idv1}/${idv2}`)
    onClose()
  }

  const onClickCatalogs = () => {
    setCateIdV1('catalogs')
  }

  const onClickCatalog = (link) => {
    navigate(link)
    onClose()
  }

  const getCategoriesV1 = async () => {
    let response = await axiosGet(`${BASE_API}/categories`)
    if (!response) return
    const cv1s = response.data
    setCategoriesV1(cv1s)
    for (let i = 0; i < cv1s.length; i++) {
      let cv1 = cv1s[i]
      getCategoriesV2(cv1._id)
    }
  }

  const getCategoriesV2 = async (parent_id) => {
    const response = await axiosGet(`${BASE_API}/categories/${parent_id}`)
    const cv2s = response.data
    setCategoriesV2(prev => ({ ...prev, [parent_id]: cv2s }))
    let index = cv2s.findIndex(cv2 => cv2._id === _cateIdV2)
    if (index !== -1) {
      setCateIdV1(parent_id)
      setCateIdV2(cv2s[index]._id)
    }
  }

  const getCatalogs = async () => {
    const response = await axiosGet(`${BASE_API}/catalogs`)
    setCatalogs(response.data)
  }

  useEffect(() => {
    getCategoriesV1()
    if (_cateIdV1) setCurrentTab('category')
    setCateIdV1(_cateIdV1 || '')
    setCateIdV2(_cateIdV2 || '')
    getCatalogs()
  }, [])

  useEffect(() => {
    if (currentTab !== 'category') setCateIdV1('')
  }, [currentTab])

  const isCatalogTab = currentTab === 'category' && cateIdV1 === 'catalogs'

  return (
    <>
      {categoriesV1.map(cv1 => {
        const isActiveTab = currentTab === 'category' && cv1._id === cateIdV1
        return (
          <Fragment
            key={cv1._id}
          >
            <ListItem
              button
              onClick={onClickCategoryV1(cv1._id)}
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              <ListItemText>
                <Typography
                  color={isActiveTab ? 'primary' : 'textPrimary'}
                  style={{ fontWeight: isActiveTab ? 'bold' : 'normal' }}
                >{cv1.name}</Typography>
              </ListItemText>
              {isActiveTab ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={isActiveTab} timeout="auto">
              <List component="div" disablePadding >
                {categoriesV2[cv1._id]?.map(cv2 =>
                  <ListItem
                    key={cv2._id}
                    button
                    style={{ paddingLeft: theme.spacing(2) }}
                    onClick={onClickCategoryV2(cv1._id, cv2._id)}
                  >
                    <ListItemText>
                      <Typography
                        color={cv2._id === cateIdV2 ? 'primary' : 'textPrimary'}
                        style={{ fontWeight: cv2._id === cateIdV2 ? 'bold' : 'normal' }}
                      >{cv2.name}</Typography>
                    </ListItemText>
                  </ListItem>
                )}

              </List>
            </Collapse>
          </Fragment>
        )
      })}
      <ListItem
        button
        onClick={onClickCategoryV1('catalogs')}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <ListItemText>
          <Typography
            color={isCatalogTab ? 'primary' : 'textPrimary'}
            style={{ fontWeight: isCatalogTab ? 'bold' : 'normal' }}
          >Bộ sưu tập</Typography>
        </ListItemText>
        {isCatalogTab ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isCatalogTab} timeout="auto">
        <List component="div" disablePadding>
          {catalogs.map(catalog =>
            <ListItem
              key={catalog._id}
              button
              style={{ paddingLeft: theme.spacing(2) }}
              onClick={() => onClickCatalog(catalog.clink)}
            >
              <ListItemText>
                <Typography
                >{catalog.title}</Typography>
              </ListItemText>
            </ListItem>
          )}
          {catalogs.length === 0 &&
            <ListItem
              button
              style={{ paddingLeft: theme.spacing(2) }}
            >
              <ListItemText>
                <Typography
                  style={{ display: 'flex', alignItems: 'center' }}
                >Coming soon <FavoriteBorder style={{ marginLeft: 5 }} fontSize='small' /></Typography>
              </ListItemText>
            </ListItem>
          }
        </List>
      </Collapse>
    </>
  )
}

export default MenuSach