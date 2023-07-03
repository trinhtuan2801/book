import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import useCommonPageFetch from "../../ultils/useCommonPageFetch"
import { Typography } from "@material-ui/core"

const InfinityScroller = ({
  url,
  arrayKey,
  params,
  Item,
  itemCb,
  ItemSkeleton,
  NoItemText,
}) => {
  const [offset, setOffset] = useState(0)

  const { items, error, hasMore, loading } = useCommonPageFetch(
    url,
    arrayKey,
    offset,
    params
  )
  const [lastElementRef, inView] = useInView({})

  useEffect(() => {
    setOffset(0)
  }, [params])

  useEffect(() => {
    console.log('load more', params?.limit)
    if (inView && !loading) {
      setOffset(prev => prev + (params?.limit || 24))
    }

  }, [inView, loading])

  return (
    <>
      {items.map((item, index) =>
        <Item
          key={item._id + item.status}
          _id={item._id}
          cb={itemCb}
        />
      )}
      {hasMore &&
        <ItemSkeleton lastElementRef={lastElementRef} />
      }
      {!loading && items.length === 0 && NoItemText}
      {!loading && error && <Typography color='secondary'>Có lỗi khi tải dữ liệu</Typography>}
    </>
  )
}

export default InfinityScroller