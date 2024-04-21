import express from 'express';
import PatientController from '../controller/PatientController';
let route = express.Router();

const initPatientApi = (app) => {
    route.post('/patient/booking',PatientController.bookingFunc);
    route.get('/patient/search',PatientController.searchFunc)
    route.post('/verify-booking',PatientController.confirmBookingFunc)
    route.post('/patient/cancel-booking',PatientController.cancelBookingFunc)
    route.post('/patient/rate-booking',PatientController.rateBookingFunc)
    return app.use('/',route);
}

export default initPatientApi;

