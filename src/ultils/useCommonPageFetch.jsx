import { useEffect, useRef, useState } from "react"
import axios from "axios"

export default function useCommonPageFetch(
  url,
  arrayKey,
  offset,
  params = {}
) {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [items, setItems] = useState([])

  const doneLoading = () => {
    return setTimeout(() => setLoading(false), 200)
  }

  useEffect(() => {
    setItems([])
    setHasMore(true)
  }, [url, arrayKey, params])

  useEffect(() => {

    console.log('useCommonPageFetch', params)
    if (offset > 0 && !hasMore) {
      return
    }

    setLoading(true)
    setError(false)

    let cancel
    let doneLoadingTimeout

    axios({
      method: 'GET',
      url: url,
      params: { ...params, offset },
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(response => {
      const { data } = response.data
      console.log('get data', data)
      setHasMore(!data.meta.end)
      setItems(prev => [...prev, ...data[arrayKey]])
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

  return { loading, error, items, hasMore }
}