const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");

const port = 7000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Using Sequelize to manage the database
const sequelize = new Sequelize("crud", "santhanakrishnan", "Askrrdc@#$sql1", {
  dialect: "mysql",
});

// Create a Table
const crud_table = sequelize.define(
  "crud_table",
  {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
  },
  { tableName: "crud_table" }
);

// Used to delete data  when refresh
crud_table.sync({ force: false }); 

// Check the connection is successful or not
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection made successful");
  })
  .catch(() => {
    {
      console.log(err, "This is error");
    }
  });

// Build method is used to create a data and save method is used to save the data in the table

// Post Data
app.post("/", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const post_data = crud_table.build({
    title,
    description,
  });
  await post_data.save();
  res.send("Data posted ");
});

// Get All data
app.get("/", async (req, res) => {
  const data = await crud_table.findAll();
  res.send(data);
});

// Get Unique data by ID
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const find_one = await crud_table.findOne({
      where: { id },
    });
    res.send(find_one);
  } catch (err) {
    res.send(err);
  }
});

// Update data
app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const update_data = await crud_table.update(data, {
      where: { id },
    });
    res.send("Data Updated");
    // res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

// Delete data
app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const delete_data = await crud_table.destroy({
      where: { id },
    });
    res.send("Data Deleted");
  } catch (err) {
    res.send(err);
  }
});

// Listening at the port
app.listen(port, () => {
  console.log(`Server connected at the port ${port}`);
});
