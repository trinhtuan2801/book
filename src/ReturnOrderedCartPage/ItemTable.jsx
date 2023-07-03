import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@material-ui/core"
import { useState } from "react"
import { BASE_FILE, RETURN_ITEM_COLOR, RETURN_ITEM_STATUS_VN } from "../constants"
import { SeeAllImage } from "../ProductPage/SeeAllImage"
import SeeAllImageSmall from "../ProductPage/SmallLayout/SeeAllImageSmall"
import { numberWithCommas } from "../ultils/NumberUtils"

const ItemTable = ({ items = [] }) => {


  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              {/* <TableCell align="center">Giá chốt (đ)</TableCell>
              <TableCell align="center">Giá cũ (đ)</TableCell> */}
              <TableCell align="right">Shop chọn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) =>
              <ItemRow
                item={item}
                key={item._id}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </>
  )
}

const ItemRow = ({ item }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const smallLayout = useMediaQuery('(max-width:904px)')

  return (
    <>
      <TableRow key={item._id}>
        <TableCell>
          <img
            style={{
              height: '40px',
              width: '30px',
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            src={`${BASE_FILE}/${item?.thumb_url}`}
            onClick={() => setOpenDialog(true)}
          />
        </TableCell>
        {/* <TableCell align="center">{numberWithCommas(item.buy_price || item.obuy_price)}</TableCell>
        <TableCell align="center">{!!item.buy_price ? numberWithCommas(item.obuy_price) : ''}</TableCell> */}
        <TableCell align="right" style={{ color: RETURN_ITEM_COLOR[item.status] }}>{RETURN_ITEM_STATUS_VN[item.status]}</TableCell>
      </TableRow>
      {smallLayout ?
        <SeeAllImageSmall
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          bigImages={[item?.thumb_url]} />
        :
        <SeeAllImage
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          bigImages={[item?.thumb_url]}
          smallImages={[item?.thumb_url]}
        />
      }
    </>
  )
}

export default ItemTable
