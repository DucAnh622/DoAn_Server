import express from 'express';
import UserController from '../controller/UserController';
let route = express.Router();

const initUserApi = (app) => {
    route.post('/login',UserController.loginFunc)
    route.post('/register',UserController.registerFunc)
    route.get('/user/get',UserController.getFunc);
    route.post('/user/create',UserController.createFunc);
    route.put('/user/update',UserController.editFunc);
    route.delete('/user/delete',UserController.deleteFunc);
    route.get('/user/search',UserController.searchFunc);
    route.get('/user/filter',UserController.filterFunc);
    route.get('/user/get-detail',UserController.getDetailFunc);
    route.get('/user/total',UserController.getTotalFunc);
    route.get('/staff/get',UserController.getStaffFunc);
    route.get('/patient/get',UserController.getPatientFunc)
    route.get('/patient/book-history',UserController.getPatientBookFunc)
    return app.use('/',route);
}

export default initUserApi;

    
