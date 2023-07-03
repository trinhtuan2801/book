import {Box, useTheme} from "@material-ui/core"
import {useNavigate, useParams} from "react-router-dom"
import {DOC_URL, WEB_SHOP_URL, MESSENGER_URL} from "../constants"
import {useEffect} from "react"
import { CustomButton } from '../CommonComponent/CustomButton'


function FooterShopLearnMore(){
  const navigate = useNavigate();
  const theme = useTheme();
  return(
    <Box bgcolor='lightGray' width='100%' height='fit-content' position='absolute' bottom='0px' dislplay='flex' display='flex' justifyContent='center' boxShadow={theme.shadows[2]} sx={{'opacity':0.9}}>
      <Box m='8px'>
   		  <CustomButton
          backgroundColor='yellow'
          borderRadius='amazon'
          variant="contained"
          onClick={()=>window.open(WEB_SHOP_URL, '_blank')}
        >
            Đăng ký ngay
        </CustomButton>
      </Box>
      <Box m='8px'>
   		  <CustomButton
          backgroundColor='orange'
          borderRadius='8px'
          variant="contained"
          onClick={()=>window.open(MESSENGER_URL, '_blank')}
        >
          Trao đổi thêm
        </CustomButton> 
      </Box>
    </Box>
  )
}

export default function DocViewerPage(){
  const navigate = useNavigate()
  const { key } = useParams()
  const doc = DOC_URL[key.toUpperCase()];
  const url=doc?.url, title=doc?.title, footer=doc?.footer;
  //const furl = 'https://docs.google.com/viewer?url='+url 
  const furl = url
  console.log('DOC VIEWER', title, url)

  useEffect(()=>{
    if (typeof(url) == 'undefined'){
      navigate('/not-found')
    }
  }, []);
   
  return(
    <>
    {typeof(url) !='undefined' && 
      <Box width='100%' height='100vh' bgcolor='lightgray' position='relative' top='0px' left='0px'>
        <iframe src={furl} title={title} style={{width:'100%', height:'100%'}}></iframe>
        {footer=='shop-learn-more' && <FooterShopLearnMore/>}
      </Box>
    }
    </>
  );
}
