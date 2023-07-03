import { useEffect, useState } from "react"
import axios from "axios"
import { useRef } from "react"
import { BASE_API } from "../constants"

export default function useGetOrder(url, status, offset) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [carts, setCarts] = useState([])
  const npage_url = useRef('')
  const prevGetTime = useRef()

  useEffect(() => {
    setCarts([])
    setError(false)
    setLoading(true)
    setHasMore(true)
    let cancel
    axios({
      method: 'GET',
      url: url,
      params: { status: status, offset: 0, limit: 10 },
      cancelToken: new axios.CancelToken(c => cancel = c),
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    }).then(response => {
      setLoading(false)
      const data = response.data.data
      if (response.data.code !== 200) {
        setError(true)
        return
      }
      console.log('carts', data.carts.filter(cart=>cart.status !== 'ACTIVE'))
      setCarts(data.carts.filter(cart=>cart.status !== 'ACTIVE'))
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

  }, [url, status])

  useEffect(() => {
    if (!hasMore || offset === 0) return
    if (new Date().getTime() - prevGetTime.current.getTime() < 500) return
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
      setLoading(false)
      if (response.data.code !== 200) {
        setError(true)
        return
      }
      let data = response.data.data
      setHasMore(!data.meta.end)
      npage_url.current = data.meta.npage_url
      setCarts(prev => [...prev, ...data.carts.filter(cart=>cart.status !== 'ACTIVE')])
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })

    return () => cancel()
  }, [offset])

  return { loading, error, hasMore, carts }
}