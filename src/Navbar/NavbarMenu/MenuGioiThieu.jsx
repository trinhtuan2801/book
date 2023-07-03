import { ClickAwayListener, Grid, makeStyles, Paper, Popper } from "@material-ui/core";
import { Clear } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  menu: {
    width: '100vw',
    height: 'calc(100vh - 200px)',
    position: 'relative',
  },
  container: {
    height: '100%',
  },
  leftMenu: {
    height: '100%',
    backgroundColor: theme.palette.grey[100],
    overflow: 'scroll',
    paddingTop: theme.spacing(2),
  },
  rightMenu: {
    height: '100%',
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(3),

  },
  exitIcon: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
  }
}))

const MenuGioiThieu = (props) => {
  const classes = useStyles()
  return (
    <Popper
      open={props.open}
      anchorEl={props.open ? props.anchor : null}
      placement="bottom"
      disablePortal
      modifiers={{ preventOverflow: { padding: 0 } }}
      style={{ zIndex: 'inherit' }}
    >
      <Paper>
        <ClickAwayListener onClickAway={props.handleCloseMenu}>
          <div className={classes.menu}>
            <Clear className={classes.exitIcon} onClick={props.handleCloseMenu}></Clear>
            <Grid container className={classes.container}>
              <Grid item xs={3} className={classes.leftMenu}>

              </Grid>
              <Grid item xs={9} className={classes.rightMenu}>

              </Grid>
            </Grid>
          </div>
        </ClickAwayListener>
      </Paper>
    </Popper>
  )

}


export default MenuGioiThieu