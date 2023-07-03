import { Box, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import InfinityScroller from '../CommonComponent/InfinityScroller/InfinityScroller'
import { BASE_API } from '../constants';
import ReturnCart from './ReturnCart';
import ReturnCartStatusBar from './ReturneDepositCartStatusBar';
import OrderSkeleton from '../DepositOrder/OrderSkeleton'
const ReturnDepositCartPage = () => {

  const { status } = useParams()

  return (
    <Box
      paddingTop={10}
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
        <ReturnCartStatusBar />
        <Box marginTop={2} />

        <InfinityScroller
          url={`${BASE_API}/return-carts`}
          arrayKey='carts'
          params={{
            limit: 10,
            status
          }}
          Item={ReturnCart}
          ItemSkeleton={OrderSkeleton}
          NoItemText={<Typography color='secondary'>Không có đơn nào</Typography>}
        />
        {/* <ReturnCart 
          _id={'63ef2e2b69932e00a6156b55'}
        /> */}
      </Box>
    </Box>
  );
}

export default ReturnDepositCartPage;