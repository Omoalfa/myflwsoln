const express = require('express')
const { validated, validateData, validateRule } = require('./validation');
const bodyPaser = require('body-parser');


const app = express();

app.use(bodyPaser.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: "My Rule-Validation API",
        status: "success",
        data: {
            name: "Sanni AbdulQuadri Olayinka",
            github: "@omoalfa",
            email: "engr.omoalfa@gmail.com",
            mobile: "09078862962",
            twitter: "@omoalfa_dev"
        }
    })
});

app.post('/validate-rule', validateRule, validateData, validated)

app.listen(3000, () => {
    console.log('...Listening on port 3000')
})

