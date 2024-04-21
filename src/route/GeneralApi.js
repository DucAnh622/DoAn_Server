import express from 'express';
import GeneralController from '../controller/GeneralController';
let route = express.Router();

const initGeneralApi = (app) => {
    route.get('/get-role',GeneralController.getRoleFunc);
    route.get('/get-gender',GeneralController.getGenderFunc);
    route.get('/get-position',GeneralController.getPositionFunc);
    route.get('/get-price',GeneralController.getPriceFunc);
    route.get('/get-payment',GeneralController.getPaymentFunc);
    route.get('/get-province',GeneralController.getProvinceFunc);
    route.get('/get-time',GeneralController.getTimeFunc);
    route.get('/get-total',GeneralController.getTotalFunc);
    return app.use('/',route);
}

export default initGeneralApi;