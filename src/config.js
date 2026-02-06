const API = {
  AUTH:
    process.env.REACT_APP_API_AUTH ||
    'http://127.0.0.1:8081/api/v1',
  MARNEE:
    process.env.REACT_APP_API_MARNEE ||
    'http://127.0.0.1:8000/api/v1',
};

export default API;
