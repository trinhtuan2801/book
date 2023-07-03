import { Box, Slider, Tooltip } from "@material-ui/core"
import { makeStyles, withStyles } from "@material-ui/styles";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { BASE_API } from "../constants";
import { axiosGet } from "../ultils/axiosUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import { useSearchParams } from "react-router-dom";

// const marks = [
//   {
//     value: 0,
//     label: 0,
//     reduce: '0k',
//   },
//   {
//     value: 5,
//     label: 5,
//     reduce: '3k',
//   },
//   {
//     value: 10,
//     label: 10,
//     reduce: '5k',
//   },
//   {
//     value: 20,
//     label: 20,
//     reduce: '10k',
//   },
//   {
//     value: 30,
//     label: 30,
//     reduce: '15k',
//   },
//   {
//     value: 50,
//     label: 50,
//     reduce: '25k',
//   },
// ];


const FreeShipLevel = ({ value = 0, cart_id = 'active' }) => {
  const [marks, setMarks] = useState([])
  const [maxMark, setMaxMark] = useState(0)
  const [searchParmams] = useSearchParams()
  const cat_id = searchParmams.get('cat_id')
  const getMarks = async () => {
    const response = await axiosGet(`${BASE_API}/deposit-carts/${cart_id}/pcodes?cat_id=${cat_id}`, null, true)
    console.log('free', response)
    if (!response || response.code !== 200) return
    const pcodes = response.data
    const marks = [
      {
        value: 0,
        label: 0,
        reduce: 0,
      },
    ]
    marks.push(...pcodes.map((pcode) => ({
      value: pcode.min_cquantity,
      label: pcode.min_cquantity,
      reduce: pcode.pvalue
    })))
    setMarks(marks)
    setMaxMark(marks[marks.length - 1].value)
  }

  useEffect(() => {
    getMarks()
  }, [])

  const getValueLabel = (x) => {
    for (let i = marks.length - 1; i >= 0; i--) {
      const mark = marks[i]
      if (x >= mark.value) return `${x} sản phẩm (-${numberWithCommas(mark.reduce)}đ)`
    }
  }

  const CustomSlider = useMemo(() => {
    if (marks.length === 0) return <></>

    const smallLayout = '@media (max-width: 780px)'
    const first = Array(11).fill(0).map((_, index) => `&[aria-valuenow="${index}"] .MuiSlider-valueLabel`).join(', ')
    const mmax = marks[marks.length - 1].value
    const last = Array(11).fill(0).map((_, index) => `&[aria-valuenow="${maxMark - index}"] .MuiSlider-valueLabel`).join(', ')

    const slider_color = 'purple'

    const Result = withStyles({
      root: {
        width: 'calc(100% - 10px)',
        marginLeft: '5px',
        marginBottom: '0px',
      },
      thumb: {
        backgroundColor: slider_color,
        [first]: {
          transform: "translate(calc(100% + 20px), -10px)"
        },
        [last]: {
          transform: "translate(calc(-100% - 30px), -10px)"
        },
      },
      track: {
        backgroundColor: slider_color,
      },
      markLabel: {
        top: '20px',
        [smallLayout]: {
          top: '28px'
        },
        fontWeight: 500,
      },
      markLabelActive: {
        color: slider_color
      },
      valueLabel: {
        whiteSpace: 'nowrap',
        left: '-12px',
        top: -16,
        '& *': {
          background: 'transparent',
          // borderRadius: '50%',
          color: slider_color,
          fontWeight: 500,
          fontSize: '14px',
        },

      }

    })(Slider)

    return (
      <Result
        value={value}
        valueLabelDisplay='on'
        marks={marks}
        min={0}
        max={mmax}
        valueLabelFormat={x => getValueLabel(x)}
        disabled
      />
    )
  }, [marks, value, maxMark])

  return (
    <>
      {CustomSlider}
    </>
  )
}

export default FreeShipLevel

