const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
/////////////////
function readDataFromFile(callback) {
  fs.readFile('test.json', 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      callback(null, jsonData);
    } catch (err) {
      callback(err, null);
    }
  });
}

// Route to view data based on ID (optional)
app.get('/views/:id?', (req, res) => {
  const { id } = req.params;

  readDataFromFile((err, jsonData) => {
    if (err) {
      res.status(500).send('Error reading data');
      return;
    }

    if (id) {
      const foundData = jsonData.find(item => item.id === parseInt(id));
      if (foundData) {
        res.status(200).json(foundData);
      } else {
        res.status(404).send('Data not found');
      }
    } else {
      res.status(200).json(jsonData);
    }
  });
});
/////////////////

app.get("/check",(req,res)=>{
    fs.readFile('test.json',"utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).send("Something went wrong");
            return
        }
        const a = JSON.parse(data)
        res.status(200).send(a)
    })
    })

// Endpoint to handle POST requests and write data to a JSON file
app.post('/add', (req, res) => {
  const newData = req.body; // Data sent from Postman

  // Read existing data (if any) from the file
  let existingData = [];
  try {
    const data = fs.readFileSync('test.json', 'utf8');
    existingData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  // Add the new data to the existing data array
  existingData.push(newData);
  // Write the updated data back to the file
  fs.writeFile('test.json', JSON.stringify(existingData), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error writing to file');
    } else {
      res.status(200).send('Data saved successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
