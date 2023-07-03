import { Box, makeStyles } from "@material-ui/core";
import AccountInfo from "./AccountInfo";
import AccountManage from "./AccountManage";
import BankManage from "./BankManage";
import BienDongSoDu from "./BienDongSoDu/BienDongSoDu";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
}))


const ProfilePage = () => {
  const classes = useStyles()

  return (
    <Box
      className={classes.root}
      width='100%'

      height='fit-content'
      boxSizing='border-box'
      paddingTop={8}
      paddingX={2}
      paddingBottom={2.5}
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      {/*Main area */}
      <AccountInfo />
      <BankManage />
      <BienDongSoDu />
      <AccountManage />
      {/* <DSDonHangNap/> */}
    </Box>
  )
}

export default ProfilePage