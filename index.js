const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

const User = require('./src/modules/User');
const Snack = require('./src/modules/Snacks');
const Order = require('./src/modules/Customer');
// const Order = require('./src/modules/Order');

dotenv.config();

app.use(express.json());
const port = process.env.PORT || 5000
app.use(cors());

app.get("/", (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).send({ error: "Message is required" });

  res.send({ message });
});

// Altere a rota no backend para '/snacks'
app.get("/snacks", async (request, response) => {  
  const { snack } = request.query;

  if (!snack) return response.status(400).send({ error: "Snack is required" });

  try {
    const snacks = await Snack.findAll({
      where: {
        snack: snack.toString(),
      },
    });

    response.send(snacks);

  } catch (error) {
    console.error("Error in /snacks route:", error);
    response.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/orders/:id", async (request, response) => {
  const { id } = request.params

  try {
    const order = await Order.findUnique({
      where: {
        id: +id,
      },
    })

    if (!order) return response.status(404).send({ error: "Order not found" })

    response.send(order)
  } catch (error) {
    console.error("Error in /order route:", error);
    response.status(500).send({ error: "Internal Server Error" });
  }
})

app.get("/customers", async (request, response) => {  
  const { customer } = request.query;

  if (!customer) return response.status(400).send({ error: "Customer is required" });

  try {
    const customers = await Customer.findAll({
      where: {
        customer: customer.toString(),
      },
    });

    response.send(customers);

  } catch (error) {
    console.error("Error in /customer route:", error);
    response.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/users", async (request, response) => {
  try {
    const Users = await User.findAll();
    return response.json({
      erro: false,
      Users
    });
  } catch (error) {
    return response.status(500).json({
      erro: true,
      mensagem: "Erro ao buscar usuários no banco de dados"
    });
  }
});

// app.post("/cadastrar", async (request, response, next) => {
//     // console.log(request.body);
//     await User.create(request.body)
//     .then(() => {
//         return response.json({
//             erro: false,
//             mensagem: "Usuario Cadastrado!"
//         })
//     }).catch(() => {
//         return response.status(400).json({
//             erro: true,
//             mensagem: "Erro: Usuario Não Cadastrado!"
//         })
//     })
// })

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// app.listen(process.env.PORT, () => console.log('Server is running!'));
