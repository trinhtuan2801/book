import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import Book2 from "./Book2";
import BookSkeleton from "./BookSkeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // height: '40%',
    // backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '1480px',
  },
  header: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    paddingLeft: theme.spacing(2),
    textAlign: 'center',

  },
  list: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },

}))

const skeletons = new Array(8).fill(1)

const BookListGrid = ({ listname, namePosition, items, hasMore, loading, error, hideHeader = false, lastElementRef, headerListSpace = 2 }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {!hideHeader &&
        <Box className={classes.header} alignSelf={namePosition}>
          {!loading &&
            <Typography gutterBottom variant="h5">
              {listname}
            </Typography>
          }
        </Box>
      }
      <Box className={classes.list} marginTop={headerListSpace}>
        <Grid container spacing={1} justifyContent="center">
          {items.map((item, index) => (
            <Grid item xs={6} sm={4} md={3} lg={3} key={index}>
              {index === items.length - 1 &&
                <div ref={lastElementRef} />
              }
              <Book2
                link={item.link}
                label={item.label}
                sprice={item.sprice}
                oprice={item.oprice}
                img_url={item.img_url}
                author={item.author}
                rating={item.rating}
                votes={item.votes}
                sale_start={item.sale_start}
                sale_end={item.sale_end}
                squantity={item.squantity}
                spercent={item.spercent}
                ssold={item.ssold}
              />
            </Grid>
          ))}
          {!error && hasMore && skeletons.map((value, index) => (
            <Grid item xs={6} sm={4} md={3} lg={3} key={index}>
              <BookSkeleton />
            </Grid>
          ))}

        </Grid>
      </Box>
    </div>
  )

}

export default BookListGrid