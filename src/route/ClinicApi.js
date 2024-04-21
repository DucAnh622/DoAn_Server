import express from 'express';
import ClinicController from '../controller/ClinicController';
let route = express.Router();

const initClinicApi = (app) => {
    route.get('/clinic/get',ClinicController.getClinicFunc);
    route.get('/clinic/get-all',ClinicController.getAllClinicFunc);
    route.get('/clinic/get-clinic-by-Address',ClinicController.getClinicByAddressFunc)
    route.post('/clinic/create',ClinicController.createClinicFunc);
    route.get('/clinic/get-detail',ClinicController.getDetailClinicFunc);
    route.delete('/clinic/delete',ClinicController.deleteClinicFunc);
    return app.use('/',route);
}

export default initClinicApi;

