const express = require("express");
const app = express();
const port = process.env.PORT || 4002;
const cors = require("cors");
const router = require("./routes");
const handleError = require("./middleware/handleError");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);
app.use(handleError);

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });

// const data = require("./markers.json");
// console.log(data.dummyMarkers.length);

module.exports =  app