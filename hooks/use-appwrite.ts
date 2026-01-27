import { useEffect, useState } from 'react'
import { Alert } from 'react-native'


interface UseAppwriteResult<T> {
    data: T
    dataLoading: boolean
    refetch: () => Promise<void>
  }

const useAppwrite = <T,>(fn: () => Promise<T>): UseAppwriteResult<T> => {
    const [data, setData] = useState<T>(null as unknown as T)
    const [dataLoading, setDataLoading] = useState(false)

    const fetchData = async () => {
        setDataLoading(true)
        try {
            const response = await fn();
            setData(response)
        }
        catch (err: any) {
            Alert.alert("Error", err.message || 'Error fetching videos')
            console.log('Error fetching videos:', err);
        }
        finally {
            setDataLoading(false)
        }
    }

    useEffect(() => {
        // fetch videos
        
        fetchData();
    }, [])

    const refetch = () => fetchData();

    return { dataLoading, data, refetch }
}

export default useAppwrite