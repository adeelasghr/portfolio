import axios from 'axios';
import { baseApiUrl } from '../utils/config';

const http = axios.create({
  baseURL: baseApiUrl
});

export default http;