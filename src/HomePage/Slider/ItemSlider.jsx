import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useLocation, useNavigate } from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from 'react-window';
import Book2 from "../../BookPage/Book2";
import BookSkeleton from "../../BookPage/BookSkeleton";
import './ItemSlider.css';
import LinkBlock from "./LinkBlock";

const responsive = {
  xl: {
    breakpoint: {
      max: 3000,
      min: 1220
    },
    items: 7,
    partialVisibilityGutter: 5,
    slidesToSlide: 7
  },
  lg: {
    breakpoint: {
      max: 1220,
      min: 1080
    },
    items: 6,
    partialVisibilityGutter: 5,
    slidesToSlide: 6
  },
  md: {
    breakpoint: {
      max: 1080,
      min: 750
    },
    items: 5,
    partialVisibilityGutter: 5,
    slidesToSlide: 5
  },
  sm: {
    breakpoint: {
      max: 750,
      min: 600
    },
    items: 4,
    partialVisibilityGutter: 7,
    slidesToSlide: 4
  },
  xs: {
    breakpoint: {
      max: 600,
      min: 450
    },
    items: 3,
    partialVisibilityGutter: 10,
    slidesToSlide: 3
  },
  xxs: {
    breakpoint: {
      max: 450,
      min: 0
    },
    items: 2,
    partialVisibilityGutter: 20,
    slidesToSlide: 2
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(1),
    boxSizing: 'border-box',
    zIndex: 2,
  },
  header: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'baseline',
    paddingLeft: props => props.headerPadding ? theme.spacing(2.5) : theme.spacing(1),
    marginBottom: theme.spacing(0),
    paddingTop: theme.spacing(1),
    position: 'relative',
    boxSizing: 'border-box'
  },
  seeMore: {
    '&:hover': {
      color: '#C7511F',
    }
  }
}))

const ItemSlider = ({
  id,
  label,
  link,
  items,
  maxWidth = '1480px',
  isMobile = false,
  showDots = false,
  renderDotsOutside = false,
  headerPadding = false,
}) => {
  const classes = useStyles({ headerPadding })
  const navigate = useNavigate()
  const scrollRef = useRef()
  const location = useLocation()
  useEffect(() => {
    let timer = 0
    if (location.hash === '#sale' && id) {
      timer = setTimeout(() => {
        window.scrollTo({ behavior: 'smooth', top: scrollRef.current.offsetTop - 100 })
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [location])
  const [currentPage, setCurrentPage] = useState(0)
  const { ref: viewRef, inView } = useInView({
    triggerOnce: true
  });

  const setRefs = useCallback((node) => {
    scrollRef.current = node
    viewRef(node)
  }, [viewRef])

  return (
    <div
      className={classes.root}
      style={{ maxWidth: maxWidth }}
      id={id}
      ref={setRefs}
    >
      <div className={classes.header}>
        <Typography variant='h5' style={{ fontWeight: isMobile ? '300' : '500', fontSize: '20px' }}>
          {label}
        </Typography>
        {link && !isMobile &&
          <Typography
            variant="body2"
            color="primary"
            style={{ cursor: 'pointer' }}
            onClick={() => { navigate(`/${link}`) }}
            className={classes.seeMore}
          >
            Xem thêm {'>'}
          </Typography>
        }
      </div>
      {/* <Divider /> */}
      {/* <Box marginTop={2} /> */}
      {isMobile ?
        <>
          <Box
            position='relative'
            width='100%'
            boxSizing='border-box'
            height={id ? '400px' : '320px'}
            maxHeight='500px'
            paddingX={headerPadding ? 2.5 : 1}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className="List"
                  height={height}
                  itemCount={items.length + 1}
                  itemSize={140}
                  width={width}
                  layout='horizontal'
                >
                  {({ index, style }) => {
                    const item = items[index]

                    return (
                      <div style={{ ...style, display: 'flex' }}>
                        {index === items.length ?
                          <LinkBlock link={link} />
                          :

                          <Book2
                            key={index}
                            sprice={item.sprice}
                            oprice={item.oprice}
                            img_url={item.img_url}
                            label={item.label}
                            sale_start={item.sale_start}
                            sale_end={item.sale_end}
                            link={item.link}
                            rating={item.rating}
                            squantity={item.squantity}
                            spercent={item.spercent}
                            elevation={0}
                            ssold={item.ssold}
                          />
                        }
                      </div>
                    )
                  }}
                  {/* <LinkBlock link={link} /> */}
                </List>
              )}
            </AutoSizer>
          </Box>
        </>
        :
        <>
          <Box
            paddingX={7}
            position='relative'
            width='100%'
            boxSizing='border-box'
            // style={{ overflowX: 'scroll' }}
            // display='flex'
            height='fit-content'
          >
            <Carousel
              additionalTransfrom={0}
              autoPlay={false}
              shouldResetAutoplay={false}
              autoPlaySpeed={0}
              // centerMode={false}
              // draggable
              focusOnSelect={false}
              infinite={false}
              minimumTouchDrag={0}
              responsive={responsive}
              showDots={showDots}
              // slidesToSlide={5}
              swipeable
              renderDotsOutside={renderDotsOutside}
              className="slider"
              arrows={!isMobile}
              partialVisible
              sliderClass="last-small"
              afterChange={(previousSlide, { currentSlide }) => {
                if (currentSlide > currentPage)
                  setCurrentPage(currentSlide)
              }}
            >
              {items.map((item, index) => {
                if (index > currentPage + (inView ? 14 : 7)) return <div key={index}></div>
                return (

                  <Book2
                    key={index}
                    sprice={item.sprice}
                    oprice={item.oprice}
                    img_url={item.img_url}
                    label={item.label}
                    sale_start={item.sale_start}
                    sale_end={item.sale_end}
                    link={item.link}
                    rating={item.rating}
                    squantity={item.squantity}
                    spercent={item.spercent}
                    elevation={0}
                    ssold={item.ssold}
                  />
                )
              })}

              <LinkBlock link={link} />

            </Carousel>
          </Box>
        </>
      }
      {link && isMobile &&
        <Box
          boxSizing='border-box'
          paddingLeft={2.5}
          marginTop={1}
        >
          <Typography
            variant="body2"
            color="primary"
            onClick={() => { navigate(`/${link}`) }}
            className={classes.seeMore}
          >
            Xem thêm
          </Typography>
        </Box>
      }
    </div>
  )
}

export default React.memo(ItemSlider) 