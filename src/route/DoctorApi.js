import express from 'express';
import DoctorController from '../controller/DoctorController';
let route = express.Router();

const initDoctorApi = (app) => {
    route.get('/doctor/get',DoctorController.getFunc);
    route.get('/doctor-detail/get',DoctorController.getDetailFunc);
    route.post('/doctor-schedule/create',DoctorController.createScheduleFunc);
    route.get('/doctor-price/get',DoctorController.getPriceFunc);
    route.get('/doctor/get-by-id',DoctorController.getByIdFunc);
    route.get('/doctor-info/get',DoctorController.getInfoFunc);
    route.post('/doctor-info/create',DoctorController.createInfoFunc);
    route.get('/doctor-schedule/get',DoctorController.getScheduleFunc);
    route.get('/doctor/get-comment',DoctorController.getCommentFunc);
    route.get('/doctor/get-all',DoctorController.getAllDoctorFunc);
    return app.use('/',route);
}

export default initDoctorApi;

