import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

//WEBSITE of the API: https://www.thecocktaildb.com/api.php
//Example website: https://www.weberranch.com/cocktails

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1"
app.use(express.static("public"));
app.use(bodyParser.urlencoded( { extended: true } ))


app.get("/", async (req, res) =>{
    try{
        const Numtostr  = Math.floor(Math.random() * 26) + 97;
        const letter = String.fromCharCode(Numtostr);
        const response = await axios.get(API_URL + "/search.php?f=" + letter)
        const result = response.data.drinks.splice(0, 12)
        console.log(result)
        res.render("index.ejs", { drink : result });
    }
    catch(error){
        console.error("Error fetching data:", error);
        res.status(500).send("Failed to fetch data. Please Refresh the Page.");
    }
})

app.get("/submit", async (req, res) => {
    const { search, category, type } = req.query;
    let url = "";
  
    // Case 1: Search by name
    if (search) {
      url = `${API_URL}/search.php?s=${search}`;
    }
    // Case 2: Filter by category
    else if (category && category !== "Filter by Category") {
      url = `${API_URL}/filter.php?c=${encodeURIComponent(category)}`;
    }
    // Case 3: Filter by alcohol content
    else if (type && type !== "Filter by Alcohol Level") {
      url = `${API_URL}/filter.php?a=${encodeURIComponent(type)}`;
    }
    // Default to all drinks starting with 'a'
    else {
      url = `${API_URL}/search.php?f=a`;
    }
  
    try {
      const response = await axios.get(url);
      const drinks = response.data.drinks || [];
  
      res.render("index.ejs", { drink: drinks });
    } catch (error) {
      console.error("Error fetching filtered drinks:", error);
      res.render("index.ejs", { drink: [] });
    }
  });
  

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
})
