import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { BASE_API, BASE_FILE } from "../constants"
import { useParams, useSearchParams } from "react-router-dom"
const default_params = {
  offset: 0,
  limit: 30,
  ctype: 0,
  catid: '',
  search: '',
  iold: false,
  istock: false
}
export default function useBookSearch(offset, params) {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filterable, setFilterable] = useState(true)

  const [items, setItems] = useState([])

  const doneLoading = () => {
    return setTimeout(() => setLoading(false), 200)
  }

  useEffect(() => {
    setItems([])
    setHasMore(true)
  }, [params])

  useEffect(() => {
    let cancel

    axios({
      method: 'GET',
      url: `${BASE_API}/pages/search/book/blocks`,
      params: { ...default_params, ...params },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(response => {
      let data = response.data.data
      console.log('init data', data)
      setFilterable(data.meta.filterable)
    }).catch(e => {

    })

    return () => {
      cancel()
    }
  }, [params])

  useEffect(() => {

    console.log('useBookSearch', params)
    if (offset > 0 && !hasMore) {
      return
    }

    setLoading(true)
    setError(false)

    let cancel
    let doneLoadingTimeout

    axios({
      method: 'GET',
      url: `${BASE_API}/pageblock`,
      params: { ...default_params, ...params, offset },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(response => {
      let data = response.data.data
      console.log('get data', data)
      // npage_url.current = data.meta.npage_url
      setHasMore(!data.meta.end)
      setItems(prev => [...prev, ...data.block_items])
      doneLoadingTimeout = doneLoading()

    }).catch(e => {
      if (axios.isCancel(e)) return
      console.log(e)
      setError(true)
      doneLoadingTimeout = doneLoading()
    })

    return () => {
      cancel()
      clearTimeout(doneLoadingTimeout)
    }
  }, [offset, params])

  return { loading, error, items, hasMore, filterable }
}

export function convertBlockToLineRow(block) {
  return {
    label: block.label,
    type: 'LINE_ROW',
    items: block.items,
    link: block.link
  }
}