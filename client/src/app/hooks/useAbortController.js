import { useRef } from 'react'

const useAbortController = () => {
    const abortControllerRef = useRef(null)

    const createAbortController = () => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        return abortControllerRef.current
    }

    const abort = () => {
        abortControllerRef.current?.abort()
    }

    return {
        createAbortController,
        abort,
        signal: abortControllerRef.current?.signal,
    }
}

export default useAbortController