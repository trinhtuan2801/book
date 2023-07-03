import { Box, makeStyles, Typography, useTheme } from "@material-ui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useMatch, useParams, useSearchParams } from "react-router-dom";
import BookListGrid from "../BookPage/BookListGrid";
import useBookSearch from "../ultils/useBookSearch";
import FilterBar from "./FilterBar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
}))

const SearchPage = () => {
  const theme = useTheme()
  const classes = useStyles()
  const [offset, setOffset] = useState(0)
  const [params, setParams] = useState({
    limit: 24,
    ctype: 1,
    search: '',
    iold: false,
    istock: false
  })
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const { loading, error, items, hasMore, gridLabel, filterable } = useBookSearch(offset, params)
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

  useEffect(() => {
    setOffset(Number(searchParams.get('offset')))
    setParams(prev => ({
      ...prev,
      // offset: Number(searchParams.get('offset')),
      search: searchParams.get('terms'),
      iold: searchParams.get('iold') === 'true',
      istock: searchParams.get('istock') === 'true'
    }))
  }, [searchParams])

  const params_without_offset = searchParams.toString().split('&').filter(param => !param.includes('offset')).join('&')

  return (
    <Box
      className={classes.root}
      width='100%'
      height='fit-content'
      boxSizing='border-box'
      paddingTop={8}
      display='flex'
      flexDirection='column'
      alignItems='center'
      paddingX='16px'
      paddingBottom={3}
      position='relative'
    >
      {/* <Typography variant="h6" style={{ marginTop: theme.spacing(2), textAlign: 'center' }}>
        {gridLabel}
      </Typography> */}
      {filterable &&
        <>
          <Box marginTop={2} />
          <FilterBar />
        </>
      }

      <Box marginTop={2} />

      {hasMore &&
        <a href={`${location.pathname}?offset=${offset + params.limit}&${params_without_offset}`}></a>
      }

      <BookListGrid
        headerListSpace={0}
        hideHeader={true}
        listname={gridLabel}
        namePosition='center'
        items={items}
        hasMore={hasMore}
        loading={loading}
        error={error}
        lastElementRef={lastElementRef}
      />

      {!loading && error && <Typography style={{ marginTop: '16px' }} color="secondary">Lỗi khi tải trang</Typography>}

      {!loading && !error && items.length === 0 &&
        <>
          <Box mt={2} />
          <Typography color="secondary">Không tìm thấy kết quả nào :(</Typography>
        </>
      }
    </Box>
  )
}

export default SearchPage