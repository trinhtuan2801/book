import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BASE_API } from "../constants";
import Loading from "../Loading";
import { refreshNavbar, setSignedIn } from '../redux/rootReducer';
import { axiosPost } from "../ultils/axiosUtils";

const Signin = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  let ticket = searchParams.get('ticket')
  const dispatch = useDispatch()

  const getUserInfo = async (ticket) => {
    let response = await axiosPost(`${BASE_API}/signin`, { ticket: ticket })
    if (!response) {
      navigate('/', { replace: true })
      return
    }
    console.log('ticket', ticket)
    console.log('access_token', response.data.access_token)
    localStorage.setItem('access_token', response.data.access_token)

    dispatch(refreshNavbar())
    dispatch(setSignedIn(true))

    let prevlogin = localStorage.getItem('prevlogin')
    console.log('prevlogin', prevlogin)

    if (prevlogin) {
      if (prevlogin.includes('product')) {
        let buy_option = localStorage.getItem('buy_option')
        let amount = localStorage.getItem('buy_amount')
        if (!buy_option || buy_option === null || !amount || amount === null) {
          navigate(`${prevlogin}`, { replace: true })
          return
        }
        let url = `${prevlogin}?buy_option=${buy_option}&buy_amount=${amount}`
        navigate(url, { replace: true })
      }
      else
        navigate(prevlogin, { replace: true })
    }
    else navigate('/', { replace: true })

  }

  useEffect(() => {
    if (ticket) {
      getUserInfo(ticket)
    } else {
      navigate('/', { replace: true })
    }
  }, [])


  return (
    <Loading />
  )
}

export default Signin