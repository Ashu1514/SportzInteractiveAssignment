const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET ALL COUNTRIES
router.get('/countries', async (req, res) => {
    try{ 
        let rawdata = fs.readFileSync(path.resolve(__dirname, '../../data/data.json'));
        let contries = JSON.parse(rawdata);
        let response = {};
        response.code = 200;
        response.data = contries;
        res.status(200).send(response);
    }
    catch(error){
        console.log(error);
        let err = {};
        err.code = 500;
        err.message = error.message;
        res.status(500).send(err);
    }
});

// GET COUNTRY BY ID
router.get('/country/:id', async (req, res) => {
    try{ 
        let contry_id = req.params.id;
        let rawdata = fs.readFileSync(path.resolve(__dirname, '../../data/data.json'));
        let json = JSON.parse(rawdata);
        let selected_country = json.countries[json.countries.findIndex(el => el.id == contry_id)];
        let response = {};
        response.code = 200;
        console.log(json.countries.findIndex(el => el.rank == contry_id));
        response.data = selected_country;
        response.image = "http://localhost:5000/"+selected_country.flag;
        res.status(200).send(response);
    }
    catch(error){
        console.log(error);
        let err = {};
        err.code = 500;
        err.message = error.message;
        res.status(500).send(err);
    }
});

// POST ADD CONTRY WITH FLAG
router.post('/country', async (req, res) => {
    try{ 
        let body = req.body;

        let rawdata = fs.readFileSync(path.resolve(__dirname, '../../data/data.json'));
        let json = JSON.parse(rawdata);

        console.log({body}, json.countries.findIndex(el => el.name === body.name), json.countries.findIndex(el => el.rank === body.rank));

        if(json.countries.findIndex(el => el.name === body.name) === -1 && json.countries.findIndex(el => el.rank === body.rank) === -1){
            let contry_obj = {
                "name":body.name,
                "continent":body.continent,
                "rank":Number(body.rank)
            };
    
            let flag = req.files.flag;
    
            flag.mv(path.resolve(__dirname, '../../images/' + flag.name));
    
            contry_obj.flag = "images/"+flag.name;
            console.log({contry_obj})
    
            json.countries.push(contry_obj)
            fs.writeFileSync(path.resolve(__dirname, '../../data/data.json'), JSON.stringify(json));
    
            if (req.files == undefined) {
                throw { message: "Please upload a file!" };
            }
        } else {
            throw { message: "Contry Name and Rank must be unique!" };
        }
        let response = {};
        response.code = 200;
        response.message = "Created";
        res.status(200).send(response);
    }
    catch(error){
        console.log(error);
        let err = {};
        err.code = 500;
        err.message = error.message;
        res.status(500).send(err);
    }
});


module.exports = router;