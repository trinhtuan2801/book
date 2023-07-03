import { Box, makeStyles } from "@material-ui/core"
import { Navigate, Route, Routes } from "react-router-dom"
import BookPage from "./BookPage/BookPage"
import CartPage from "./CartPage/CartPage"
import ChooseAddress from "./CheckOut/ChooseAddress/ChooseAddress"
import ThanhToan from "./CheckOut/ThanhToan"
import HomePage from "./HomePage/HomePage"
import DangVanChuyen from "./NapCredit/NapSach/DangVanChuyen"
import DinhGiaSachNap from "./NapCredit/NapSach/DinhGiaSachNap"
// import PheDuyetSachNap from "./NapCredit/NapSach/PheDuyetSachNap"
import ChonVanChuyen from "./NapCredit/NapSach/ChonVanChuyen/ChonVanChuyen"
// import VanChuyenXong from "./NapCredit/NapSach/VanChuyenXong"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import BuyOrderPage from "./BuyOrder/BuyOrderPage"
import ConfirmPage from "./ConfirmPage/ConfirmPage"
import DepositOrderPage from "./DepositOrder/DepositOrderPage"
import NapCreditBank from "./NapCredit/NapCreditBank"
import NapCreditGift from "./NapCredit/NapCreditGift"
import TaoMaThe from "./NapCredit/TaoMaThe/TaoMaThe"
import Navbar from "./Navbar/Navbar"
import ProductPage from "./ProductPage/ProductPage"
import ProfilePage from "./Profile/ProfilePage"
import QuyenGopPage from "./QuyenGop/QuyenGopPage"
import RutTienPage from "./RutTien/RutTienPage"
import SearchPage from "./SearchPage/SearchPage"
import Signin from "./Signin/Signin"
import './_styles/CustomScrollBar.css'
import { BASE_API } from "./constants"
import { refreshNavbar, setSignedIn } from "./redux/rootReducer"
import SignedInRoute from "./ultils/SpecialRoute/SignedInRoute"
import Test from "./ultils/Test"
import { axiosGet } from "./ultils/axiosUtils"
import NapDoCu from "./NapCredit/NapDoCu/NapDoCu"
import ChonMatHang from "./ChonMatHang/ChonMatHang"
import NotFoundPage from "./NotFoundPage/NotFoundPage"
import Footer from "./Footer/Footer"
import DocViewerPage from "./DocViewerPage/DocViewerPage"
import ReturnDepositCartPage from "./ReturnDepositCartPage/ReturnDepositCartPage"
import ReturnOrderedCartPage from "./ReturnOrderedCartPage/ReturnOrderedCartPage"

const useStyles = makeStyles((theme) => ({
  app: {
    width: '100%',
    height: 'fit-content',
    minHeight: '100vh',
    padding: 0,
    margin: 0,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[100],
    // paddingBottom: theme.spacing(4)
  },
}))

const App = () => {
  const classes = useStyles()
  const [checkLogin, setCheckLogin] = useState(false)
  const dispatch = useDispatch()
  const { signed_in } = useSelector(state => state.root)
  useEffect(() => {
    const checkLogin = async () => {
      let url = `${BASE_API}/users`
      let response = await axiosGet(url, null, true)
      console.log('user info', response)
      if (response !== null) {
        dispatch(setSignedIn(true))
        dispatch(refreshNavbar())
      }
      setCheckLogin(true)
    }
    checkLogin()
  }, [])

  return (
    <>
      {checkLogin &&
        <>
          <div className={classes.app}>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<Signin />} />

              <Route path="/home" element={<Navigate to="/" />} />
              <Route path="/book-page" element={<BookPage />}>
                <Route path=":cateIdV1" element={<></>}>
                  <Route path=":cateIdV2" element={<></>}>
                    <Route path=":cateIdV3" element={<></>} />
                  </Route>
                </Route>
              </Route>
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/search" element={<SearchPage />} />

              <Route element={<SignedInRoute isAllowed={signed_in} />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/nap-do-cu" element={<NapDoCu />} />
                <Route path="/nap-credit-gift" element={<NapCreditGift />} />
                <Route path="/tao-ma-the" element={<TaoMaThe />} />
                <Route path="/chon-dia-chi" element={<ChooseAddress />} />
                <Route path="/thanh-toan" element={<ThanhToan />} />
                <Route path="/nap-credit-bank" element={<NapCreditBank />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dinh-gia/:id" element={<DinhGiaSachNap />} />
                <Route path="/chon-van-chuyen/:id" element={<ChonVanChuyen />} />
                <Route path="/dang-van-chuyen/:id" element={<DangVanChuyen />} />
                <Route path="/confirm" element={<ConfirmPage />} />
                <Route path="/deposit-order/:status" element={<DepositOrderPage />} />
                <Route path="/deposit-order" element={<Navigate to='/deposit-order/*' replace />} />
                <Route path="/buy-order/:status" element={<BuyOrderPage />} />
                <Route path="/buy-order" element={<Navigate to='/buy-order/*' replace />} />
                <Route path="/rut-tien" element={<RutTienPage />} />
                <Route path='/chon-mat-hang' element={<ChonMatHang />} />

                <Route path="/hang-hoan-tra/:status" element={<ReturnDepositCartPage />} />
                <Route path="/hang-hoan-tra" element={<Navigate to='/hang-hoan-tra/*' replace />} />

                <Route path="/don-tra-hang/:status" element={<ReturnOrderedCartPage />} />
                <Route path="/don-tra-hang" element={<Navigate to='/don-tra-hang/*' replace />} />
              </Route>

              <Route path="/quyen-gop" element={<QuyenGopPage />} />
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="/doc-viewer/:key" element={<DocViewerPage />} />

              {true &&
                <Route path='/test' element={<Test />} />
              }
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
              <Route path="*" element={<Navigate to="/not-found" replace />} />

            </Routes>
            <Footer />
          </div>
        </>
      }
    </>
  )
}

export default App
