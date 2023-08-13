import axios from "axios";
import Cookies from "js-cookie";

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

export async function createUrl(url: string) {
  try {
    const accessToken = Cookies.get("accessToken");
    const res = await api.post(
      "/jurl/create",
      { url },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getUsersUrls() {
  try {
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    console.log({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const res = await api.post("/user/urls", undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function createCustomUrl(url: string, customUrl: string) {
  try {
    const accessToken = Cookies.get("accessToken");
    const res = await api.post(
      "/jurl/createCustomUrl",
      { url, customUrl },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getQrCode(urlId: string) {
  try {
    const res = await api.post(`/jurl/getUrlQr/${urlId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteUrl(hashedUrl: string) {
  try {
    const accessToken = Cookies.get("accessToken");
    const res = await api.post(
      "/jurl/delete",
      { hashedUrl },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
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

export async function signUp(username: string, password: string) {
  try {
    const res = await api.post("/user/create", { username, password });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function signIn(username: string, password: string) {
  try {
    const res = await api.post("/auth/login", { username, password });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function verifyToken(token: string) {
  try {
    const res = await api.post("/auth/verifyToken", { token });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default api;
