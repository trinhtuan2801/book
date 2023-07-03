import { useEffect, useState } from "react"
import { axiosPost } from "./axiosUtils"

const useUploadImage = (url, blobFile) => {
  const [largeURL, setLargeURL] = useState('')
  const [thumbURL, setThumbURL] = useState('')
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // console.log(blobFile)

  })

  useEffect(() => {
    if (!blobFile) {
      setLargeURL('')
      setThumbURL('')
      setProgress(0)
      setLoading(false)
      return
    }
    setLoading(true)

    const uploadFunc = (progressEvent) => {
      const { loaded, total } = progressEvent
      let percent = Math.floor(loaded * 100 / total)
      setProgress(percent)
    }

    const upload = async () => {
      let formData = new FormData()
      formData.append("fileToUpload", blobFile)
      let response = await axiosPost(url, formData, true, uploadFunc)
      if (!response) return
      setLargeURL(response.data.large_url)
      setThumbURL(response.data.thumb_url)
      setLoading(false)
      setProgress(0)
    }

    upload()
  }, [url, blobFile])

  return { largeURL, thumbURL, progress, loading }
}

export default useUploadImage