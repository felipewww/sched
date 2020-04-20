import express from 'express';
import {json, urlencoded} from 'express';
import {Routes} from "./Routes";
import cors from 'cors';

const app = express();

app.use(json()); //bodyParser
app.use(urlencoded());

var corsOptions = {
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

new Routes(app).setRoutes();

app.listen(5000, () => {
    console.log('Listening on port ' + 5000)
});
