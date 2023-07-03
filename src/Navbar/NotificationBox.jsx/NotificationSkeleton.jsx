import { Box, Card, CardActionArea, CardContent, useTheme } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"

const NotificationSkeleton = () => {
  const theme = useTheme()
  return (
    <>
      <Card elevation={0}>
        <CardActionArea>
          <CardContent style={{ padding: theme.spacing(1) }}>
            <Box
              width='100%'
              display='flex'
              justifyContent='space-between'
            >
              <Box display='flex' flexGrow={1}>
                <Skeleton variant="circle" width={40} height={40} />
                <Box marginLeft={1} flexGrow={1}>
                  <Skeleton variant="text" width='100%' />
                  <Skeleton variant="text" width='100%' />
                  <Skeleton variant="text" width='80px' />
                </Box>
              </Box>

              <Box display='flex' alignItems='center' marginLeft={1} minWidth='18px'>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}

export default NotificationSkeleton