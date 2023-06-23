const express = require('express');
const router = express.Router();

router.get('/:code', (req, res) => {
    const code = req.params.code;
    const jsonCars = JSON.parse(fs.readFileSync("../json/messages.json"));
    if(jsonCars.cars.length == 0){
        res.json(
            {
                code : 404,
                message : "No cars found"
            }
        )
    }else{
        const car = jsonCars.cars.find(car => car.code == code);
        if(car){
            res.json(
                {
                    code : 200,
                    message : "Car found",
                    idCar : car.id
                }
            )
        }else{
            res.json(
                {
                    code : 404,
                    message : "Car not found"
                }
            )
        }
    }
});

module.exports = router;