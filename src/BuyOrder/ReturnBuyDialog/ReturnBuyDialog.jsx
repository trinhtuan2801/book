import { Box, Button, Dialog, TextField, useMediaQuery } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { CustomDialogActions, CustomDialogContent, CustomDialogTitle } from "../../CommonComponent/CommentPopup/CommentPopup"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import ReturnBuyItem from "./ReturnBuyItem"
import { CustomButton } from "../../CommonComponent/CustomButton"
import { BASE_API } from "../../constants"
import { axiosPatch } from "../../ultils/axiosUtils"

const ReturnBuyDialog = ({
  open,
  onClose,
  items = [],
  cb
}) => {

  const smallLayout = useMediaQuery('(max-width:904px)')
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const formRef = useRef()
  const [checkList, setCheckList] = useState({})

  useEffect(() => {
    const obj = items.reduce((prev, curr) => {
      console.log(curr)
      return { ...prev, [curr._id]: false }
    }, {})
    setCheckList(obj)
  }, [items])

  const isAtleastOneChecked = useMemo(() => {
    for (const [key, value] of Object.entries(checkList)) {
      if (value) return true
    }
    return false
  }, [checkList])

  const onCheck = (_id, checked) => {
    setCheckList(prev => ({ ...prev, [_id]: checked }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const elements = e.target.elements
    const getValue = (name) => {
      return elements[name].value
    }

    let promises = []
    for (let [_id, value] of Object.entries(checkList)) {
      if (!value) continue
      promises.push(Promise.resolve(
        axiosPatch(`${BASE_API}/cartitems/${_id}`, {
          "field_name": 'return_comment',
          "value": getValue(_id),
        }, true)
      ))
    }

    Promise.all(promises).then((values) => {
      let allOK = true
      for (let value of values) {
        if (!value || value.code !== 200) {
          allOK = false
          enqueueSnackbar(value?.message || 'Có lỗi khi cập nhật', { variant: 'error' })
        }
      }
      if (allOK) {
        let promises = []
        for (let [_id, value] of Object.entries(checkList)) {
          if (!value) continue
          promises.push(Promise.resolve(
            axiosPatch(`${BASE_API}/cartitems/${_id}`, {
              "field_name": 'status',
              "value": 'RETURN',
            }, true)
          ))
        }

        Promise.all(promises).then((values) => {
          let allOK = true
          for (let value of values) {
            if (!value || value.code !== 200) {
              allOK = false
              enqueueSnackbar(value?.message || 'Có lỗi khi cập nhật', { variant: 'error' })
            }
          }
          if (allOK) {
            enqueueSnackbar('Gửi yêu cầu hoàn trả thành công', { variant: 'success' })
            cb()
          }
        })

      }
    })


  }


  return (
    <>
      <Dialog
        open={open}
        onClose={onClose} style={{ overscrollBehavior: 'contain' }} fullScreen={smallLayout ? true : false}
      >
        <form onSubmit={onSubmit} ref={formRef} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <CustomDialogTitle onClose={onClose}>
            Chọn sản phẩm hoàn trả
          </CustomDialogTitle>
          <CustomDialogContent dividers>
            <Box
              width={smallLayout ? '100%' : '400px'}
            >
              {items.map((item, index) => (
                <Fragment key={index}>
                  <ReturnBuyItem {...item} onCheck={onCheck} />
                  <Box mb={1} />
                </Fragment>
              ))}
            </Box>
          </CustomDialogContent>
          <CustomDialogActions>
            <Button
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant='contained'
              color='secondary'
              disabled={loading || !isAtleastOneChecked}
              type="submit"
            >
              Xác nhận
            </Button>
          </CustomDialogActions>
        </form>
      </Dialog >
    </>
  )
}

export default ReturnBuyDialog