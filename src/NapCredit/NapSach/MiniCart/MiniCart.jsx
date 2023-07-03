import { Box, Divider, makeStyles, Typography } from "@material-ui/core"
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { CustomButton } from "../../../CommonComponent/CustomButton"
import { BASE_API } from "../../../constants"
import { axiosDelete, axiosGet, axiosPatch } from "../../../ultils/axiosUtils"
import HorizontalType from "./HorizontalType"
import MiniBook from "./MiniBook"
import VerticalType from "./VerticalType"


const MiniCart = ({ isVertical = true, showSubmitButton, refreshParent = () => { } }) => {
  const [items, setItems] = useState([])
  const [cartInfo, setCartInfo] = useState(null)
  const navigate = useNavigate()
  let { id } = useParams()
  const [searchParams] = useSearchParams()
  const cat_id = searchParams.get('cat_id')

  const getDepositBook = async () => {
    let response = await axiosGet(`${BASE_API}/deposit-carts/${id || 'active'}`, { cat_id }, true)
    if (!response || response.code !== 200) return
    const items = response.data.items
    setCartInfo(response.data)
    setItems(items)
    console.log('deposit cart', response.data)
  }

  useEffect(() => {
    console.log('change', cat_id)
    getDepositBook()
  }, [cat_id])

  const deleteBook = (book_id) => async () => {
    await axiosDelete(`${BASE_API}/deposit-cartitems/${book_id}`, null, true)
    getDepositBook()
    refreshParent()
  }

  const submit = async () => {
    let response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
      "field_name": "status",
      "value": "MONSTERS_PRICING"
    }, true)
    if (!response) {
      return
    }
    response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
      "field_name": "cat_id",
      "value": cat_id
    }, true)
    if (!response) {
      return
    }
    navigate(`/dinh-gia/${cartInfo._id}`)
  }

  return (
    <>
      {
        isVertical ?
          <VerticalType
            cartInfo={cartInfo}
            items={items}
            showSubmitButton={showSubmitButton}
            submit={submit}
            deleteBook={deleteBook}
          />
          :
          <HorizontalType
            cartInfo={cartInfo}
            items={items}
            showSubmitButton={showSubmitButton}
            submit={submit}
            deleteBook={deleteBook}
          />
      }
    </>
  )
}

export default MiniCart
