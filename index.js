const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://404wear.vercel.app"]
}));
app.use(bodyParser.json());

mercadopago.configure({
  access_token: "APP_USR-8816027706096437-040807-875f959ba9a1cb82e85a58f1113e243b-450373505"
});

app.get("/", (req, res) => {
  res.send("404wear backend activo");
});

app.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    const preference = {
      items: items.map(item => ({
        title: item.title,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity)
      })),
      back_urls: {
        success: "https://404wear.vercel.app/success",
        failure: "https://404wear.vercel.app/failure",
        pending: "https://404wear.vercel.app/pending"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor backend escuchando en puerto", PORT);
});