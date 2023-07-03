import { Box, makeStyles, Typography, Divider, TextField, FormControlLabel, Button, Checkbox, useMediaQuery } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { numberWithCommas } from "../../ultils/NumberUtils";
import Address from "./Address";
import NapSachStepper from "../../NapCredit/NapSach/NapSachStepper";
import ThanhToanStepper from "../ThanhToanStepper";
import { CustomButton } from "../../CommonComponent/CustomButton";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "../../ultils/axiosUtils";
import { BASE_API } from "../../constants";
import { checkStrInclude } from "../../ultils/StringUltils";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import ChoosePcodePopup from "./ChoosePcodePopup";
import DepositSummary from "../../NapCredit/NapSach/DepositSummary";
import { useMemo } from "react";
import { SentimentVerySatisfied } from "@material-ui/icons";
import AddressSkeleton from "./AddressSkeleton";
import Loading from "../../Loading";
import ActivePcode from "./ActivePcode";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  submitButton: {
    width: '100%',
    maxWidth: '800px'
  },
  image: {
    objectFit: 'cover',
    objectPosition: 'top',
    height: '100%',
    width: 'auto',
  }
}))

const ShipAddress = (props) => {
  const classes = useStyles()
  const [provinceList, setProvinceList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [communeList, setCommuneList] = useState([])
  const [resetKey0, setResetKey0] = useState(true)
  const [resetKey1, setResetKey1] = useState(true)
  const [resetKey2, setResetKey2] = useState(true)
  const [addressList, setAddressList] = useState([])
  const [addressID, setAddressID] = useState('')
  const [name, setName] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')
  const [street, setStreet] = useState('')
  const [mobile, setMobile] = useState('')
  const [isOffice, setIsOffice] = useState(false)
  const [update, setUpdate] = useState(false)
  const navigate = useNavigate()
  const [cartInfo, setCartInfo] = useState(null)
  let [searchParams] = useSearchParams()
  let procedure = searchParams.get('procedure')
  let id = searchParams.get('id')
  const { enqueueSnackbar } = useSnackbar()
  const smallLayout = useMediaQuery('(max-width:700px)')
  const [activePcodes, setActivePcodes] = useState({
    pship_code: null,
    pgift_code: null,
    pvalue_code: null,
  })
  const [pcodes, setPcodes] = useState([])
  const [openChoosePcode, setOpenChoosePcode] = useState(false)
  const [openSummary, setOpenSummary] = useState(false)
  const [resetSummaryKey, setResetSummaryKey] = useState(true)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const getCartInfo = async () => {
    let response = await axiosGet(`${BASE_API}/carts/${id}`, null, true)
    if (!response) {
      navigate('/')
      return
    }
    if (response.data.items.length === 0) {
      navigate('/cart')
      return
    }

    if (response.data.status !== 'ACTIVE') {
      navigate('/')
      return
    }
    const cartInfo = response.data
    setCartInfo(cartInfo)
    console.log('buy cart', cartInfo)

    // if (cartInfo.pship_code || cartInfo.pvalue_code) setPcode(cartInfo.pship_code || cartInfo.pvalue_code)

    setActivePcodes({
      pship_code: cartInfo.pship_code,
      pgift_code: cartInfo.pgift_code,
      pvalue_code: cartInfo.pvalue_code,
    })


    response = await axiosGet(`${BASE_API}/carts/active/pcodes`, null, true)
    setPcodes(response.data)
  }

  const getDepositCartInfo = async () => {
    let response = await axiosGet(`${BASE_API}/deposit-carts/${id}`, null, true)
    if (!response) {
      navigate('/')
      return
    }
    if (response.data.status !== 'USER_SHIP_SELECT') {
      navigate('/')
      return
    }
    setCartInfo(response.data)
    console.log('deposit', response.data)

    response = await axiosGet(`${BASE_API}/deposit-carts/${id}/pcodes`, null, true)
    setPcodes(response.data)
    console.log(response.data)
  }

  useEffect(() => {
    if (!['buy', 'deposit'].includes(procedure)) {
      navigate('/')
      return
    }

    if (procedure === 'buy') getCartInfo()
    else if (procedure === 'deposit') getDepositCartInfo()

  }, [])

  const getProvinceList = async () => {
    const response = await axiosGet('https://api.mysupership.vn/v1/partner/areas/province')
    if (!response) return
    setProvinceList(response.results)
  }
  const getUserAddresses = async () => {
    setLoadingAddress(true)
    let response = await axiosGet(`${BASE_API}/users/addresses`, {
      ctype: procedure === 'buy' ? 'ORDERED_CART' : 'DEPOSIT_CART',
      cart_id: id
    }, true)
    setLoadingAddress(false)
    if (!response) return
    setAddressList(response.data)
    console.log('addresses', response.data)
  }

  useEffect(() => {
    getProvinceList()
    getUserAddresses()
  }, [])

  const clearAddressInput = () => {
    setAddressID('')
    setName('')
    setMobile('')
    setProvince('')
    setDistrict('')
    setWard('')
    setStreet('')
    setIsOffice(false)
    setUpdate('')
    setResetKey0(prev => !prev)
    setResetKey1(prev => !prev)
    setResetKey2(prev => !prev)
  }

  const onChooseProvince = async (event, name) => {
    setResetKey1(prev => !prev)
    setResetKey2(prev => !prev)
    setProvince(name)
    setDistrict('')
    setWard('')
    getDistrictList(name)
  }

  const onChooseDistrict = async (event, name) => {
    setResetKey2(prev => !prev)
    setDistrict(name)
    setWard('')
    getCommuneList(name)
  }

  const getDistrictList = async (province) => {
    const index = provinceList.findIndex(prov => prov.name === province)
    if (index !== -1) {
      const response = await axiosGet(`https://api.mysupership.vn/v1/partner/areas/district?province=${provinceList[index].code}`)
      if (!response) return
      setDistrictList(response.results)
    }
    else {
      setDistrictList([])
      setCommuneList([])
    }
  }

  const getCommuneList = async (district) => {
    const index = districtList.findIndex(dist => dist.name === district)
    if (index !== -1) {
      const response = await axiosGet(`https://api.mysupership.vn/v1/partner/areas/commune?district=${districtList[index].code}`)
      if (!response) return
      setCommuneList(response.results)
    }
    else {
      setCommuneList([])
    }
  }

  const scrollToTop = () => {
    const drawer = document.getElementById('header')
    console.log(drawer)
    window.scrollTo({ behavior: 'smooth', top: drawer.offsetTop - 100 })
  }

  const addNewAddress = async (event) => {
    event.preventDefault()
    const inputs = event.target.elements
    const new_address = {
      name,
      mobile,
      province,
      district,
      ward,
      street,
      is_office: isOffice
    }
    await axiosPost(`${BASE_API}/users/addresses`, new_address, true)

    if (procedure === 'buy')
      chooseAddress(new_address)()
    else {
      enqueueSnackbar('Thêm địa chỉ thành công', { variant: 'success' })
      getUserAddresses()
      clearAddressInput()
      scrollToTop()
    }
  }

  const deleteAddress = (_id) => async (event) => {
    await axiosDelete(`${BASE_API}/users/addresses/${_id}`, null, true)
    getUserAddresses()
    clearAddressInput()
    setUpdate(false)
  }

  const onClickUpdateAddress = (address) => (event) => {
    setAddressID(address._id)
    setName(address.name)
    setMobile(address.mobile)
    setProvince(address.province)
    setDistrict(address.district)
    setWard(address.ward)
    setStreet(address.street)
    setIsOffice(address.is_office)
    setUpdate(true)
    document.getElementById('name').focus()
  }

  const exitUpdate = () => {
    clearAddressInput()
    setUpdate(false)
  }

  const updateAddress = async (event) => {
    event.preventDefault()
    const updated_address = {
      name,
      mobile,
      province,
      district,
      ward,
      street,
      is_office: isOffice
    }
    const old_address = addressList.find(address => address._id === addressID)
    let all_fields = ['name', 'mobile', 'province', 'district', 'ward', 'street', 'is_office']
    let updated_fields = all_fields.filter(field => old_address[field] !== updated_address[field])
    let promises = []

    for (const field of updated_fields) {
      promises.push(Promise.resolve(
        axiosPatch(`${BASE_API}/users/addresses/${addressID}`, {
          field_name: field,
          value: updated_address[field]
        }, true)
      ))
    }

    await Promise.all(promises).then((values) => {
      let allOk = true
      for (const value of values) {
        if (!value || value.code !== 200) {
          allOk = false
          enqueueSnackbar(value?.message || 'Có lỗi khi update', { variant: 'error' })
          break
        }
      }
      if (allOk)
        enqueueSnackbar('Update địa chỉ thành công', { variant: 'success' })
    })

    exitUpdate()
    getUserAddresses()
    scrollToTop()
  }

  const chooseAddress = (address) => async (e) => {
    let cart_type = procedure === 'buy' ? 'carts' : 'deposit-carts'
    let response = await axiosPatch(`${BASE_API}/${cart_type}/${cartInfo._id}`, {
      "field_name": "address",
      "value": address
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response.message, { variant: 'error' })
      return
    }
    
    if (procedure === 'deposit') {
      setResetSummaryKey(prev => !prev)
      setOpenSummary(true)
    }
    else if (procedure === 'buy') {
      navigate(`/thanh-toan?procedure=buy&id=${cartInfo._id}`)
    }
  }

  const confirmDepositShip = async () => {
    setLoadingConfirm(true)
    const response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
      "field_name": "status",
      "value": "SHIPPING"
    }, true)
    setLoadingConfirm(false)
    if (!response || response.code !== 200) {
      let message = response?.message || ''
      if (message.includes('không được nhỏ hơn')) message += '. Bạn nên gộp nhiều hàng trong 1 đơn đấu giá'
      enqueueSnackbar(message, { variant: 'error' })
      return
    }
    navigate(`/dang-van-chuyen/${cartInfo._id}`)
  }

  const hasAppliablePcode = useMemo(() => {
    for (const pcode of pcodes) {
      if (pcode.appliable) return true
    }
    return false
  }, [pcodes])

  return (
    <Box
      className={classes.root}
      width='100%'
      height='fit-content'
      boxSizing='border-box'
      paddingTop={8}
      display='flex'
      paddingBottom={2}
    >

      <Box
        width='100%'
        height='fit-content'
        boxSizing='border-box'
        marginLeft={2}
        marginTop={2}
        marginRight={3}
        style={{ backgroundColor: '#00000000' }}
      >

        {procedure === 'deposit' &&
          <NapSachStepper step={3} />
        }
        {procedure === 'buy' &&
          <ThanhToanStepper step={1} />
        }
        <Box marginTop={2} />

        {/*Main area */}
        <Box
          width='100%'
          height='fit-content'
          padding={3}
          boxSizing='border-box'
          style={{ backgroundColor: '#fff' }}
        >
          <Box
            display={smallLayout ? 'block' : 'flex'}
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography
              variant={smallLayout ? 'h6' : 'h5'}
              style={{ fontWeight: '500' }}
              gutterBottom
              id='header'
            >
              Chọn địa chỉ {procedure === 'deposit' ? 'nhận hàng' : 'giao hàng'}
            </Typography>
            <Box
              minWidth='120px'
              alignItems={smallLayout ? 'flex-start' : 'flex-end'}
              display='flex'
              flexDirection='column'
              marginBottom={1}
            >
              <Typography component='div' >
                {procedure === 'buy' ? 'Giá trị giỏ hàng' : 'Giá trị đơn hàng nạp'}:
              </Typography>
              {cartInfo &&
                <>
                  {(!!cartInfo.final_subtotal && cartInfo.subtotal !== cartInfo.final_subtotal) ?
                    <>
                      <Typography variant="body2" color="textSecondary" style={{ textDecoration: 'line-through' }}>
                        {numberWithCommas(cartInfo.subtotal)}đ
                      </Typography>
                      <Typography variant="h6" style={{ color: 'orange' }}>
                        {numberWithCommas(cartInfo.final_subtotal)}đ
                      </Typography>
                    </>
                    :
                    <Typography variant="h6" style={{ color: 'orange' }}>
                      {numberWithCommas(cartInfo.subtotal)}đ
                    </Typography>
                  }
                </>
              }

            </Box>
          </Box>

          <Divider />

          <Box marginY={2}>
            {hasAppliablePcode &&
              <Typography variant="body2" gutterBottom style={{ fontWeight: '500', display: 'flex', alignItems: 'center', fontStyle: 'italic', color: 'purple' }}><SentimentVerySatisfied />&nbsp;Bạn có khuyến mại có thể chọn </Typography>
            }
            <Box mt={1} />
            <CustomButton
              variant="contained"
              size='small'
              backgroundColor='purple'
              color='white'
              onClick={() => setOpenChoosePcode(true)}
            >Chọn khuyến mại</CustomButton>
            <Box marginTop={2} />

            <Box display='flex' flexWrap='wrap' gridGap={10}>
              {!!activePcodes.pvalue_code &&
                <ActivePcode
                  pcode={activePcodes.pvalue_code}
                  variant='pvalue'
                  value={cartInfo.pvalue_value}
                  updateParent={() => {
                    if (procedure === 'buy') getCartInfo()
                    else getDepositCartInfo()
                    getUserAddresses()
                  }}
                />
              }
              {!!activePcodes.pship_code &&
                <ActivePcode
                  pcode={activePcodes.pship_code}
                  variant='pship'
                  value={cartInfo.pship_value}
                  updateParent={() => {
                    if (procedure === 'buy') getCartInfo()
                    else getDepositCartInfo()
                    getUserAddresses()
                  }}
                />
              }
              {!!activePcodes.pgift_code &&
                <ActivePcode
                  pcode={activePcodes.pgift_code}
                  variant='pgift'
                  updateParent={() => {
                    if (procedure === 'buy') getCartInfo()
                    else getDepositCartInfo()
                    getUserAddresses()
                  }}
                />
              }
            </Box>

            <ChoosePcodePopup
              id={procedure === 'buy' ? 'active' : id}
              procedure={procedure}
              open={openChoosePcode}
              onClose={() => setOpenChoosePcode(false)}
              pcodes={pcodes}
              activePcodes={Object.values(activePcodes)}
              updateParent={() => {
                if (procedure === 'buy') getCartInfo()
                else getDepositCartInfo()
                getUserAddresses()
              }}
            />
          </Box>
          <Divider />

          {!loadingAddress && addressList.length === 0 &&
            <Box marginTop={2}>
              <Typography style={{ fontStyle: 'italic' }}>Bạn chưa lưu địa chỉ, hãy thêm địa chỉ ở bên dưới nhé</Typography>
            </Box>
          }

          {loadingAddress ?
            <Box
              boxSizing='border-box'
              paddingTop={2}
            >
              {Array(2).fill(0).map((value, index) => (
                <Fragment key={index}>
                  <AddressSkeleton />
                  {index !== 1 && <Box marginY={2}><Divider /></Box>}
                </Fragment>
              ))}
            </Box>
            :
            <Box
              boxSizing='border-box'
              paddingTop={2}
            >
              {addressList.map((address, index) => (
                <Fragment key={address._id}>
                  <Address
                    _id={address._id}
                    name={address.name}
                    mobile={address.mobile}
                    province={address.province}
                    district={address.district}
                    ward={address.ward}
                    street={address.street}
                    is_office={address.is_office}
                    deleteAddress={deleteAddress}
                    chooseAddress={chooseAddress}
                    onClickUpdateAddress={onClickUpdateAddress}
                    ship_cost={address.ship_cost}
                    procedure={procedure}
                    ship_pcode_value={cartInfo?.ship_pcode_value}
                    merror={address.merror}
                    shops_transport={address.shops_transport}
                  />
                  {index !== addressList.length - 1 && <Box marginY={2}><Divider /></Box>}
                </Fragment>
              ))}

            </Box>
          }

          <Box marginY={2}><Divider /></Box>

          <Typography
            variant="h6"
            style={{ fontWeight: '400' }}
            gutterBottom
          >
            {update ? 'Sửa địa chỉ' : 'Thêm địa chỉ giao hàng'}
          </Typography>

          <Box marginTop={2} />

          <form onSubmit={update ? updateAddress : addNewAddress}>
            <Box width='100%' maxWidth='800px'>
              {/* <Input fullWidth placeholder="Người nhận" required id="username"></Input> */}
              <TextField value={name} size="small" variant="outlined" fullWidth label="Người nhận" required id="name" onChange={(e) => setName(e.target.value)}></TextField>
            </Box>

            <Box width='100%' maxWidth='800px' display={smallLayout ? 'block' : 'flex'} marginTop={0.5}>
              <Autocomplete
                id="province"
                key={'0' + resetKey0}
                fullWidth
                name="province"
                freeSolo
                options={provinceList.map((option) => option.name).filter(name => checkStrInclude(name, province))}
                value={province}
                renderInput={(params) => (
                  <TextField {...params}
                    size="small" label="Thành phố" margin="dense" variant="outlined" required
                    onChange={(e) => { setProvince(e.target.value) }}
                  />
                )}
                onChange={onChooseProvince}
              />
              <Box marginLeft={1.5} />
              <Autocomplete
                id="district"
                key={'1' + resetKey1}
                fullWidth
                name="district"
                freeSolo
                options={districtList.map((option) => option.name).filter(name => checkStrInclude(name, district))}
                value={district}
                renderInput={(params) => (
                  <TextField {...params}
                    size="small" label="Huyện" margin="dense" variant="outlined" required
                    onChange={(e) => { setDistrict(e.target.value) }}
                  />
                )}
                onChange={onChooseDistrict}
              />
              <Box marginLeft={1.5} />
              <Autocomplete
                id="ward"
                key={'2' + resetKey2}
                fullWidth
                name="ward"
                freeSolo
                options={communeList.map((option) => option.name).filter(name => checkStrInclude(name, ward))}
                value={ward}
                renderInput={(params) => (
                  <TextField {...params}
                    size="small" label="Xã" margin="dense" variant="outlined" required
                    onChange={(e) => setWard(e.target.value)}
                  />
                )}
                onChange={(e, name) => setWard(name)}
              />
            </Box>

            <Box width='100%' maxWidth='800px' marginTop={1}>
              <TextField value={street} size="small" variant="outlined" fullWidth label="Địa chỉ nhà" required id="street"
                onChange={(e) => setStreet(e.target.value)}
              />
              <Box marginTop={1.5} />
              <TextField value={mobile} size="small" variant="outlined" type='number' fullWidth label="Số điện thoại" required id="mobile"
                onChange={(e) => setMobile(e.target.value)}
              />
              <Box marginTop={1.5} />
              <FormControlLabel
                checked={isOffice}
                control={<Checkbox color="primary" />}
                label="Đây là địa chỉ cơ quan"
                onChange={(e) => setIsOffice(e.target.checked)}
              />
            </Box>
            <Box marginTop={2} />
            {!update &&
              <CustomButton size='small' type="submit" backgroundColor="yellow" variant="contained" className={classes.submitButton} fullWidth>
                {procedure === 'buy' ? 'Dùng địa chỉ này' : 'Thêm địa chỉ'}
              </CustomButton>
            }

            {update &&
              <Box display='flex' width='100%' maxWidth='800px' marginTop={1}>
                <CustomButton size='small' type="submit" backgroundColor="yellow" variant="contained" className={classes.submitButton}>Cập nhật</CustomButton>
                <Box marginLeft={1} />
                <Button fullWidth variant="outlined" size="small" onClick={exitUpdate}>Hủy</Button>
              </Box>
            }
          </form>

        </Box>
      </Box>

      {procedure === 'deposit' &&
        <DepositSummary
          key={'0' + resetSummaryKey}
          open={openSummary}
          onClose={() => setOpenSummary(false)}
          confirm={confirmDepositShip}
          id={id}
          loading={loadingConfirm}
        />
      }
      {(loadingAddress || loadingConfirm) && <Loading />}

    </Box>
  )
}


export default ShipAddress