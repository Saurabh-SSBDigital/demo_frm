import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export function useApi<T>(url: string, page: number = 0, size: number = 10, searchTerm: string = '', method: string = 'GET', body: any = null): ApiResponse<PaginatedResponse<T>> {
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with pagination and search parameters
      // const params = new URLSearchParams({
      //   page: page.toString(),
      //   size: size.toString(),
      //   ...(searchTerm && { search: searchTerm })
      // });

      const fetchOptions: RequestInit = {
        method, // Use the provided HTTP method
        headers: {
          'Content-Type': 'application/json', // Set Content-Type for JSON body
        }
      };

      const response = await fetch(`${url}`, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // If the API doesn't return paginated data, wrap it
      if (Array.isArray(result)) {
        const filteredData = searchTerm
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? result.filter((item: any) =>
            Object.values(item).some(value =>
              value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          : result;

        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedItems = filteredData.slice(startIndex, endIndex);

        setData({
          content: paginatedItems,
          totalElements: filteredData.length,
          totalPages: Math.ceil(filteredData.length / size),
          number: page,
          size: size,
          first: page === 0,
          last: page >= Math.ceil(filteredData.length / size) - 1
        });
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [url, page, size, searchTerm]);

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}