import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export async function createAnonUrl(url: string) {
  try {
    const res = await api.post("/jurl/createAnon", { url });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default api;
