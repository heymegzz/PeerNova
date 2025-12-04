import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

function useApi(url, { method = 'get', body = null, params = {}, enabled = true, dependencies = [] } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!enabled) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.request({
          url,
          method,
          data: body,
          params,
        });

        if (isMounted) {
          setData(response.data?.data ?? response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, enabled, JSON.stringify(params), ...dependencies]);

  return { data, loading, error, setData };
}

export default useApi;


