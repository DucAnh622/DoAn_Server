import express from 'express';
import BookingController from '../controller/BookingController';
let route = express.Router();

const initBookingApi = (app) => {
    route.get('/booking/manage/get',BookingController.getBookingManageFunc);
    route.get('/booking/manage/filter',BookingController.filterBookingManageFunc);
    route.post('/booking/manage/confirmSubmit',BookingController.completedBookingManageFunc);
    route.post('/booking/manage/cancelSubmit',BookingController.cancelBookingManageFunc);
    route.get('/booking/get/history',BookingController.getHistoryBookingFunc);
    route.get('/booking/total',BookingController.getTotalFunc);
    route.get('/booking/total-by-date',BookingController.getTotalByDateFunc);
    route.get('/booking/schedule-by-date',BookingController.getScheduleByDateFunc);
    return app.use('/',route);
}

export default initBookingApi;