import express from "express";

app = express();


const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server is listening at http://localhost:5000`);
})