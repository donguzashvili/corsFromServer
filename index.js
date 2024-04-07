const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const baseUrl = "https://pro-api.coinmarketcap.com/";

app.get("/latest-currency", async (req, res) => {
  const { start, limit } = req.query;
  const apiKey = req.headers["x-api-key"];

  try {
    const response = await getLatestCurrency({ start, limit, apiKey });
    res.json(response.data);
  } catch (error) {
    console.error(error.response.data);
    console.error("Error fetching latest currency:", error.message);
    res.status(500).json({ error: "Internal Server Error", errorFromApi: error.message, detailedInfo: `${error}` });
  }
});

app.get("/convert-currency", async (req, res) => {
  const { convertFromId, convertToSymbol } = req.query;
  const apiKey = req.headers["x-api-key"];

  try {
    const response = await getConvertCurrency({ convertFromId, convertToSymbol, apiKey });
    res.json(response.data);
  } catch (error) {
    console.error("Error converting currency:", error.response);
    res.status(500).json({ error: "Internal Server Error", errorFromApi: error.message, detailedInfo: `${error}` });
  }
});

const getLatestCurrency = async ({ start, limit, apiKey }) => {
  const url = `${baseUrl}v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}`;
  const headers = {
    "X-CMC_PRO_API_KEY": apiKey,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await axios.get(url, { headers });
  return response.data;
};

const getConvertCurrency = async ({ convertFromId, convertToSymbol, apiKey }) => {
  const url = `${baseUrl}v1/cryptocurrency/quotes/latest?id=${convertFromId}&convert=${convertToSymbol}`;
  const headers = {
    "X-CMC_PRO_API_KEY": apiKey,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await axios.get(url, { headers });
  return response.data;
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
