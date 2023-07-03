import { Box, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { BASE_API } from "../constants";
import ItemSlider from "../HomePage/Slider/ItemSlider";
import { axiosGet } from "../ultils/axiosUtils";
import Banner from "./Banner";
import BookListGrid from "./BookListGrid";
import useBookSearch, { convertBlockToLineRow } from "../ultils/useBookSearch";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(15),
    backgroundColor: '#F5F5F5',
    width: '100%',
    alignItems: 'center',
  }
}))

const BookPage = () => {
  const classes = useStyles()
  const [banner, setBanner] = useState({ img_url: '', link: '', show_start: '', show_end: '', _id: '' })
  const [offset, setOffset] = useState(0)
  const [params, setParams] = useState({
    limit: 24,
    ctype: 0,
    catid: '',
  })
  let { cateIdV1, cateIdV2, cateIdV3 } = useParams()
  let cateId = cateIdV3 || cateIdV2 || cateIdV1
  const [pagePaddingTop, setPagePaddingTop] = useState(64)
  const { category_bar_empty } = useSelector(state => state.root)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [lineData, setLineData] = useState([])
  const [gridLabel, setGridLabel] = useState('')

  useEffect(() => {
    setParams(prev => ({
      ...prev,
      catid: cateId
    }))
    setPagePaddingTop(64)
  }, [cateId])

  useEffect(() => {
    setOffset(Number(searchParams.get('offset')))
  }, [searchParams])

  useEffect(() => {
    console.log('padding', category_bar_empty)
    if (category_bar_empty) setPagePaddingTop(64)
    else setPagePaddingTop(112)
  }, [category_bar_empty])

  useEffect(() => {
    const getBanner = async () => {
      const response = await axiosGet(`${BASE_API}/pages/category/bads/filter?status=active`)
      if (!response) return
      setBanner(response.data[0])
    }
    getBanner()
    const getLineData = async () => {
      const response = await axiosGet(`${BASE_API}/pages/category/${cateId}/blocks?offset=0&limit=30`)
      if (!response || response.code !== 200) return
      const data = response.data
      let lineResult = []
      data.blocks.map(block => {
        if (block.btype === 'LINE_BLOCK') {
          let lineRow = convertBlockToLineRow(block)
          lineResult.push(lineRow)
        }
        else if (block.btype === 'PAGE_BLOCK') {
          setGridLabel(block.label)
        }
      })
      setLineData(lineResult)
    }
    getLineData()
  }, [])

  const { loading, error, items: gridData, hasMore } = useBookSearch(offset, params)

  const observer = useRef()

  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // setParams(prev => ({ ...prev, offset: prev.offset + prev.limit }))
        setOffset(prev => prev + params.limit)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const smallLayout = useMediaQuery('(max-width:904px)')
  const params_without_offset = searchParams.toString().split('&').filter(param => !param.includes('offset')).join('&')

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F5F5F5',
        width: '100%',
        alignItems: 'center',
      }}
      paddingTop={`${pagePaddingTop}px`}
    >
      <Banner
        img_url={banner.img_url}
        link={banner.link}
        show_start={banner.show_start}
        show_end={banner.show_end}
        _id={banner._id}
      />

      <Box
        display='flex'
        flexDirection='column'
        paddingX='5px'
        boxSizing='border-box'
        alignItems='center'
        width='100%'
      >
        {lineData.map((row, index) => {
          return (
            <Fragment key={index}>
              <Box marginTop={2} />
              <Link to={`${location.pathname}?offset=${offset + params.limit}`} />
              <ItemSlider
                items={row.items}
                label={row.label}
                link={row.link}
                isMobile={smallLayout}
                showDots={true}
                headerPadding={true}
              />
            </Fragment>
          )
        })}

        <Box marginTop={2} />

        {hasMore &&
          <a href={`${location.pathname}?offset=${offset + params.limit}&${params_without_offset}`}></a>
        }

        <BookListGrid
          listname={gridLabel}
          namePosition='center'
          items={gridData}
          hasMore={hasMore}
          loading={loading}
          error={error}
          lastElementRef={lastElementRef}
        />

        <Box marginTop={2} />
      </Box>

      {!loading && error && <Typography style={{ marginTop: '16px' }} color="secondary">Lỗi khi tải trang</Typography>}
    </Box>
  )

}

export default BookPage
