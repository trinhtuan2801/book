import { Outlet } from "react-router-dom"

export const signIn = () => {
  let login_url = `https://accounts.monsters.vn/signin`
  let continue_url = `${window.location.protocol}//${window.location.host}`
  let full_url = `${login_url}?continue=${continue_url}`
  localStorage.setItem('prevlogin', window.location.pathname)
  window.open(full_url, '_self')
}

const SignedInRoute = ({ isAllowed }) => {

  if (!isAllowed) {
    console.log('prev', window.location.pathname)
    signIn()
    return <></>
  }

  return <Outlet />
}

export default SignedInRoute