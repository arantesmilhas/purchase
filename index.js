
import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";

const app = express();
app.use(express.json());

const ACCESS_TOKEN = "EAAdnyBlEDDoBOxyfgGCiY3GbFUmUYNgxcrsBoWyxTmnBxlnqhyrLoZBC6y0mOxvUIiNlEA4d05HzKGfW7hY3FoYM1LlVila6I8pt6UeNXW2KDo7GVrl0gtbWiSxG7ZCZCNfeTs1MJGVGtllUDvSnBZCLlZAUpBxtvD38PkP5aDZB4ZB3pnz7Vnj0pbvH7tLswZDZD";
const PIXEL_ID = "601449855785389";

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

app.post("/api/purchase", async (req, res) => {
  const { nome, email, telefone, valor, event_id } = req.body;

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: "POST",
      body: JSON.stringify({
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(new Date().getTime() / 1000),
            event_id: event_id,
            user_data: {
              em: [sha256(email)],
              ph: [sha256(telefone)],
              fn: [sha256(nome)]
            },
            custom_data: {
              currency: "BRL",
              value: valor,
              content_name: "Compra Chama Gemea",
              content_category: "Consulta",
              content_ids: ["purchase_001"],
              content_type: "product"
            },
            action_source: "website"
          }
        ]
      }),
      headers: { "Content-Type": "application/json" }
    }
  );

  const data = await response.json();
  res.send(data);
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
