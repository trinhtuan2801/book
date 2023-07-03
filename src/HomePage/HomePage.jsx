import { Box, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { BASE_API, BASE_FILE } from "../constants";
import { axiosGet } from "../ultils/axiosUtils";
import BoxList from "./BoxList/BoxList";
import BoxListSkeleton from "./BoxList/BoxListSkeleton";
import ItemSlider from "./Slider/ItemSlider";
import SlideShow from "./SlideShow/SlideShow";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '60px',
    // backgroundColor: theme.palette.grey[100],
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 'fit-content',
    position: 'relative',
    alignItems: 'center'
  },
  slideShow: {
    position: 'absolute',
    top: 0
  }
}))



const HomePage = (props) => {
  const classes = useStyles()
  const [data, setData] = useState([])

  useEffect(() => {
    document.title = 'Maxmin - trao đổi mua bán đồ cũ, mới'
    const getData = async () => {
      let response = await axiosGet(`${BASE_API}/pages/home/blocks`, { offset: 0, limit: 10 })
      if (!response) return
      let allblocks = response.data.blocks
      let result = []
      let blockRow = new Block14Row()
      console.log('block', allblocks)
      allblocks.map((block) => {
        if (block.btype === 'SBLOCK_1SUB' || block.btype === "SBLOCK_4SUB") {
          let block14 = new Block14(block.label, block.link)
          block.items.map(item => {
            block14.addItem(item)
          })
          blockRow.addBlock(block14.getObject())

          if (blockRow.isFull()) {
            result.push(blockRow.getObject())
            blockRow = new Block14Row()
          }
        }
        else if (block.btype === 'LINE_BLOCK') {
          let lineRow = new LineRow(block.label, block.link)
          block.items.map(item => {
            lineRow.addItem(item)
          })
          result.push(lineRow.getObject())
        }
      })
      if (blockRow.blocks14.length > 0)
        result.push(blockRow.getObject())

      let remain_block = result
        .filter(block => block.type === 'BLOCK_ROW' && block.blocks14.length === 4)
        .map(block => {
          return block.blocks14.slice(-1)[0]
        })

      blockRow = new Block14Row(true)
      remain_block.map(block => {
        if (blockRow.blocks14.length === 3) {
          result.push(blockRow.getObject())
          blockRow = new Block14Row(true)
        }
        blockRow.addBlock(block)
      })
      
      if (blockRow.blocks14.length === 3)
        result.push(blockRow.getObject())

      setData(result)
    }

    getData()
  }, [])

  const smallLayout = useMediaQuery('(max-width:904px)')


  return (
    <div className={classes.root}>
      <SlideShow className={classes.slideShow} />
      <Box marginTop={smallLayout ? 23 : 35} />
      <Box
        width='100%'
        paddingX={2}
        boxSizing='border-box'
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        {!data.length &&
          <>
            <BoxListSkeleton itemCounts={[4, 1, 1, 1]} />
            <Box marginTop={2} />
            <BoxListSkeleton itemCounts={[1, 1, 4, 4]} />
          </>
        }
        {data.map((row, index) => {
          if (row.type === "BLOCK_ROW" || row.type === "BLOCK_REMAIN") {
            return (
              <Fragment key={index}>
                <BoxList
                  boxItems={row.blocks14}
                  isRemain={row.type === "BLOCK_REMAIN"}
                />
                <Box marginBottom={2} />
              </Fragment>
            )

          } else if (row.type === "LINE_ROW") {
            return (
              <Fragment key={index}>
                <ItemSlider
                  id={row.link === 'search?terms=searchsale' ? 'sale' : null}
                  items={row.items}
                  label={row.label}
                  link={row.link}
                  isMobile={smallLayout}
                  showDots={true}
                  headerPadding
                />
                <Box marginBottom={2} />
              </Fragment>
            )
          }
        })}

      </Box>
    </div>
  )

}

export default HomePage

class Block14Row {
  blocks14 = []
  isRemain = false

  constructor(isRemain = false) {
    this.isRemain = isRemain
  }

  isFull() {
    return this.blocks14.length === 4
  }

  addBlock(block) {
    this.blocks14.push(block)
  }

  getObject() {
    return {
      header: '',
      type: this.isRemain ? 'BLOCK_REMAIN' : 'BLOCK_ROW',
      blocks14: this.blocks14
    }
  }
}

class Block14 {
  label = ''
  link = ''
  items = []

  constructor(label, link) {
    this.label = label
    this.link = link
  }

  addItem(item) {
    this.items.push(item)
  }

  getObject() {
    return {
      label: this.label,
      link: this.link,
      items: this.items,
    }
  }
}

class LineRow {
  label = ''
  items = []
  link = ''
  constructor(label, link) {
    this.label = label
    this.link = link
  }

  addItem(item) {
    this.items.push(item)
  }

  getObject() {
    return {
      label: this.label,
      type: 'LINE_ROW',
      items: this.items,
      link: this.link
    }
  }
}

