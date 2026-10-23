import express from "express";

const app = express();
app.get("/api/invoices/:id", async (request, response) => {
  const invoice = await db.invoice.findUnique({ where: { id: request.params.id } });
  return response.json(invoice);
});

app.listen(3000);
