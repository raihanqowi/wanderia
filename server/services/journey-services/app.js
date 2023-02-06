if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express')
const cors = require('cors')
const app = express()
const { connectDB } = require("./configs/mongoDb");
const port =  process.env.PORT || 4001
const router = require('./routes');
const errorHandler = require("./middlewares/errorHandler");

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.get("/", (req, res) => res.status(200).json({msg: "HAI"}))
app.use('/routes', router)
app.use(errorHandler)
// console.log("connect DB");
connectDB()
    .then(() => {
        if (process.env.NODE_ENV !== 'test'){
            app.listen(port, () => {
                console.log(`Example app listening on port ${port}`);

            });
        }
      
    })
    .catch((err) => console.log(err));


module.exports = app; 

