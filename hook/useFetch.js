import { useState, useEffect } from "react";
import axios from "axios";


const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null)

  const options = {
    method: 'GET',
    url: `https://jsearch.p.rapidapi.com/${endpoint}`,
    params: { ...query },
    headers: {
      'X-RapidAPI-Key': '694ea0934fmshb221f27d654a927p1c23d5jsnd2b79fda8147',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.request(options);
      setData(response.data.data)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchData();
  }, []);

  const refetch = () =>{ 
    setIsLoading(true);
    fetchData()
  }

  return {data, isLoading, error, refetch}
}

export default useFetch;
