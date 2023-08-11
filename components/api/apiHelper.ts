import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export async function createAnonUrl(url: string) {
  try {
    const res = await api.post("/jurl/createAnon", { url });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllHashedUrls() {
  try {
    const res = await api.get("/jurl/all");
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getFullUrl(hashUrl: string) {
  try {
    const res = await api.get(`/${hashUrl}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default api;
