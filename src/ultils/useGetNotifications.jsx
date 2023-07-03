import { useEffect } from "react";
import axios from "axios"
import { useRef, useState } from "react";
import { BASE_API } from "../constants";

export default function useGetNotifications(offset, refresh) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nunread, setNunread] = useState(0)
  const [notifications, setNotifications] = useState([])
  const npage_url = useRef('')
  const prevGetTime = useRef()

  useEffect(() => {
    setNotifications([])
    setError(false)
    setLoading(true)
    setHasMore(true)
    let cancel
    axios({
      method: 'GET',
      url: `${BASE_API}/users/notifications`,
      params: { offset: 0, limit: 20 },
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
      const data = response.data.data
      setNotifications(data.notifications)
      setHasMore(!data.meta.end)
      npage_url.current = data.meta.npage_url
      prevGetTime.current = new Date()
      setNunread(data.meta.nunread)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })

    return () => {
      cancel()
    }
  }, [refresh])

  useEffect(() => {
    if (!hasMore || offset === 0) return
    if (new Date().getTime - prevGetTime.current.getTime() < 500) return
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
      setNotifications(prev => [...prev, ...data.notifications])
      setNunread(data.meta.nunread)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })

    return () => cancel()
  }, [offset])

  return { loading, error, hasMore, notifications, nunread }
}