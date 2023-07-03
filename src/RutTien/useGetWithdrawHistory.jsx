import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { BASE_API } from "../constants"

export default function useGetWithDrawHistory(offset) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const npage_url = useRef('')
  const prevGetTime = useRef()
  const [data, setData] = useState([])
  useEffect(() => {
    setError(false)
    setLoading(true)
    setHasMore(true)
    let cancel
    axios({
      method: 'GET',
      url: `${BASE_API}/users/payment-requests`,
      params: { offset: 0, limit: 10 },
      cancelToken: new axios.CancelToken(c => cancel = c),
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    }).then(response => {
      if (response.data.code !== 200) {
        setError(true)
        return
      }
      const data = response.data.data
      setLoading(false)
      setData(data.payment_requests)
      setHasMore(!data.meta.end)
      npage_url.current = data.meta.npage_url
      prevGetTime.current = new Date()

    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })

    return () => {
      cancel()
    }
  }, [])

  useEffect(() => {
    if (!hasMore || offset === 0) return
    // if (new Date().getTime() - prevGetTime.current.getTime() < 500) return
    prevGetTime.current = new Date()
    setLoading(true)
    setError(false)

    let cancel
    axios({
      method: 'GET',
      url: `${BASE_API}/${npage_url.current}`,
      cancelToken: new axios.CancelToken(c => cancel = c),
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    }).then(response => {
      if (response.data.code !== 200) {
        setError(true)
        return
      }
      let data = response.data.data
      setLoading(false)
      setData(prev => [...prev, ...data.payment_requests])
      setHasMore(!data.meta.end)
      npage_url.current = data.meta.npage_url
      prevGetTime.current = new Date()
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })

    return () => cancel()
  }, [offset])

  return { loading, error, hasMore, data }
} 