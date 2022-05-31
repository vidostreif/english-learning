import { useRef, useEffect } from 'react'

//хук с помощью которого можно определить существует ли еще объект
export function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}
