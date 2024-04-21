import express from 'express';
import SpecialityController from '../controller/SpecialityController';
let route = express.Router();

const initSpecialityApi = (app) => {
    route.get('/speciality/get',SpecialityController.getSpecialityFunc);
    route.get('/speciality/get-detail',SpecialityController.getDetailSpecialityFunc);
    route.get('/speciality/get-all',SpecialityController.getAllSpecialityFunc);
    route.post('/speciality/create',SpecialityController.createSpecialityFunc);
    route.get('/speciality/get-doctor-by-Province',SpecialityController.getDoctorByProvinceSpecialityFunc);
    route.delete('/speciality/delete',SpecialityController.deleteSpecialityFunc);
    return app.use('/',route);
}

export default initSpecialityApi;

