import axios from 'axios';

const API_KEY = '0341aff94a6641a68d0907537ceb9221'; 
const BASE_URL = 'https://newsapi.org/v2';

export const getNews = async (category, page) => {
  const url = `${BASE_URL}/top-headlines?country=us&category=${category}&page=${page}&apiKey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};
