import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.get(baseUrl, config);
  return request.then((response) => response.data);
};

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (id, updatedBlog) => {
  const config = { headers: { Authorization: token } };
  const request = axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return request.data;
};

export default { getAll, setToken, create, update };
