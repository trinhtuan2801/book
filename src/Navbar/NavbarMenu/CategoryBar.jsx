import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { Fragment, useReducer, useRef } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useMatch, useNavigate, useSearchParams } from "react-router-dom";
import { BASE_API } from "../../constants";
import { setCategoryBarEmpty, setCatParentIds } from "../../redux/rootReducer";
import { axiosGet } from "../../ultils/axiosUtils";

const useStyles = makeStyles(theme => ({
  bar: {
    paddingLeft: theme.spacing(2),
    borderTop: `2px solid ${theme.palette.grey[200]}`
  }
}))

const CategoryBar = () => {
  let classes = useStyles()
  const [index, setIndex] = useState(false)
  const [categoriesV3, setCategoriesV3] = useState([])
  const routeMatch1 = useMatch('/book-page/:cateIdV1/*')
  const routeMatch2 = useMatch('/book-page/:cateIdV1/:cateIdV2/*')
  const routeMatch3 = useMatch('/book-page/:cateIdV1/:cateIdV2/:cateIdV3')

  const _cateIdV1 = useRef()
  const _cateIdV2 = useRef()
  const _cateIdV3 = useRef()

  const location = useLocation()
  const pathname = location.pathname
  const route = pathname.split('/')[1]
  const isShown = ['book-page', 'product'].includes(route)

  const { cat_parent_ids } = useSelector(state => state.root)
  const dispatch = useDispatch()
  useEffect(() => {
    let id = routeMatch1?.params?.cateIdV1
    if (id) {
      _cateIdV1.current = id
    }
    let arr = cat_parent_ids.slice()
    arr[0] = id
    dispatch(setCatParentIds(arr))
  }, [routeMatch1])

  useEffect(() => {
    let id = routeMatch2?.params?.cateIdV2
    if (id) {
      _cateIdV2.current = id
    }
    let arr = cat_parent_ids.slice()
    arr[1] = id
    dispatch(setCatParentIds(arr))
  }, [routeMatch2])

  useEffect(() => {
    let id = routeMatch3?.params?.cateIdV3
    if (id) {
      _cateIdV3.current = id
    } else if (route === 'book-page') {
      _cateIdV3.current = ''
      setIndex(false)
    }
    let arr = cat_parent_ids.slice()
    arr[2] = id
    dispatch(setCatParentIds(arr))
  }, [routeMatch3, route])

  const getCategoriesV3 = async (parent_id) => {
    setCategoriesV3([])
    const response = await axiosGet(`${BASE_API}/categories/${parent_id}`)
    if (!response) return
    const cv3 = response.data
    setCategoriesV3(cv3)

    let index = cv3.findIndex(cv => cv._id === _cateIdV3.current)
    if (index !== -1) setIndex(index)
  }

  const navigate = useNavigate()

  const handleChange = (event, newIndex) => {
    setIndex(newIndex)
    navigate(`book-page/${_cateIdV1.current}/${_cateIdV2.current}/${categoriesV3[newIndex]._id}`)
  }

  useEffect(() => {
    if (_cateIdV2.current) {
      getCategoriesV3(_cateIdV2.current)
    }
  }, [_cateIdV2.current])

  useEffect(() => {
    if (route === 'product') {
      if (cat_parent_ids.length >= 2) {
        const idv1 = cat_parent_ids[0]
        const idv2 = cat_parent_ids[1]
        const idv3 = cat_parent_ids[2]
        _cateIdV1.current = idv1
        _cateIdV2.current = idv2
        _cateIdV3.current = idv3
        getCategoriesV3(idv2)
      }
    }
  }, [cat_parent_ids])

  useEffect(() => {
    let isEmpty = categoriesV3.length === 0
    dispatch(setCategoryBarEmpty(isEmpty))
  }, [categoriesV3])

  return (
    <>
      {isShown && categoriesV3.length > 0 &&
        (
          <>
            <Tabs
              className={classes.bar}
              value={index}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              style={{ zIndex: 'inherit' }}
            >
              {categoriesV3.map((cv3, index) => (
                <Tab
                  key={index}
                  label={cv3.name}
                  wrapped
                />
              ))}
            </Tabs>
            <span id='category-bar' />
          </>
        )}
    </>
  )
}

CategoryBar.defaultProps = {
  cateIdV2: ''
}

export default CategoryBar