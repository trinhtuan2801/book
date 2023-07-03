import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@material-ui/core"
import { useState } from "react"
import { BASE_FILE, RETURN_ITEM_COLOR, RETURN_ITEM_STATUS_VN } from "../constants"
import { SeeAllImage } from "../ProductPage/SeeAllImage"
import SeeAllImageSmall from "../ProductPage/SmallLayout/SeeAllImageSmall"
import { numberWithCommas } from "../ultils/NumberUtils"

const ItemTable = ({ items }) => {


  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell align="center">Giá chốt (đ)</TableCell>
              <TableCell align="center">Giá cũ (đ)</TableCell>
              <TableCell align="center">Shop chọn</TableCell>
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
            src={`${BASE_FILE}/${item?.images?.[0]?.thumb_url}`}
            onClick={() => setOpenDialog(true)}
          />
        </TableCell>
        <TableCell align="center">{numberWithCommas(item.buy_price || item.obuy_price)}</TableCell>
        <TableCell align="center">{!!item.buy_price ? numberWithCommas(item.obuy_price) : ''}</TableCell>
        <TableCell align="center" style={{ color: RETURN_ITEM_COLOR[item.status] }}>{RETURN_ITEM_STATUS_VN[item.status]}</TableCell>
      </TableRow>
      {smallLayout ?
        <SeeAllImageSmall
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          bigImages={item.images.map(img => img.large_url)} />
        :
        <SeeAllImage
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          bigImages={item.images.map(image => image.large_url)}
          smallImages={item.images.map(image => image.thumb_url)}
        />
      }
    </>
  )
}

export default ItemTable
