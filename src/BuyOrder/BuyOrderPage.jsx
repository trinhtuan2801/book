import { Box, Typography } from "@material-ui/core"
import { Fragment, useCallback, useEffect, useRef } from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BASE_API } from "../constants"
import { useSelector } from "react-redux";
import { SentimentVeryDissatisfied } from "@material-ui/icons"
import useGetOrder from "../ultils/useGetOrder"
import OrderSkeleton from "../DepositOrder/OrderSkeleton"
import BuyStatusBar from "./BuyStatusBar"
import BuyOrder from "./BuyOrder"
const BuyOrderPage = () => {

  const { status } = useParams()
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    setOffset(0)
  }, [status])

  const { loading, error, hasMore, carts } = useGetOrder(`${BASE_API}/carts`, status, offset)

  const observer = useRef()

  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  return (
    <Box
      paddingTop={10}
      width='100%'
      display='flex'
      justifyContent='center'
      paddingBottom={2}
      position='relative'
      paddingX={2}
      boxSizing='border-box'
    >
      <Box
        maxWidth='1158.5px'
        width='100%'
      >
        <BuyStatusBar />
        <Box marginTop={2} />

        {carts.map((order) =>
          <Fragment key={`${order._id}${order.status}`}>
            <BuyOrder
              _id={order._id}
              _status={order.status}
              url_status={status}
            />
          </Fragment>
        )}
        {carts.length === 0 && !loading &&
          <Box
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            paddingY={20}
          >
            {error ?
              <>
                <Typography variant='h5' style={{ fontWeight: 500 }} color='secondary'>Lỗi khi tải dữ liệu</Typography>
              </>
              :
              <>
                <SentimentVeryDissatisfied style={{ fontSize: '50px' }} />
                <Box marginTop={2} />
                <Typography variant='h5' style={{ fontWeight: 500 }}>Không có đơn hàng nào</Typography>
              </>
            }

          </Box>
        }

        {!error && hasMore &&
          <>
            <div ref={lastElementRef} />
            <OrderSkeleton />
            <Box marginTop={2} />
            <OrderSkeleton />

          </>
        }
      </Box>

    </Box>
  )
}

export default BuyOrderPage