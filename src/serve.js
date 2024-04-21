require('dotenv').config();
import express from 'express';
import ConfigViewEngine from './config/viewEngine';
import bodyParser from 'body-parser';
import configCors from './config/cors.js';
import connection from './config/connectDB';
import initUserApi from './route/UserApi';
import initDoctorApi from './route/DoctorApi';
import initPatientApi from './route/PatientApi';
import initSpecialityApi from './route/Speciality';
import initClinicApi from './route/ClinicApi.js';
import initBookingApi from './route/BookingApi.js';
import initGeneralApi from './route/GeneralApi.js';
import cookieParser from "cookie-parser";

const app = express()
const port = process.env.PORT || 9999;

configCors(app)

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())

app.use(bodyParser.urlencoded({limit: '50mb',extended: true}))
app.use(bodyParser.json({limit: '50mb'}))

// connection()

ConfigViewEngine(app)

initUserApi(app)
initDoctorApi(app)
initPatientApi(app)
initSpecialityApi(app)
initClinicApi(app)
initBookingApi(app)
initGeneralApi(app)
app.use(cookieParser())
app.use((req, res) => {
    return res.send("404 NOT FOUND")
})

app.listen(port,()=>{
    console.log(`BACKEND is running at http://localhost:${port}`)
})
