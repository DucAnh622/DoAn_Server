import { query } from 'express';
import PatientService from '../service/PatientService';

const bookingFunc = async (req, res) => {
    try {
        if(!req.body.fullName || !req.body.userId || !req.body.timeId || !req.body.date) {
            return res.status(500).json({
                EM1: 'Invalid information',
                EM2: 'Thông tin không hợp lệ!',
                EC: -1,
                DT: ''
            }) 
        }
        let data = await PatientService.bookingAppointment(req.body)
        return res.status(200).json({
            EM1: data.EM1,
            EM2: data.EM2,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM1: 'Error of serve!',
            EM2: 'Lỗi hệ thống!',
            EC: -1,
            DT: ''
        })
    }
}

const confirmBookingFunc = async (req, res) => {
    try {
        if(!req.body.staffId || !req.body.doctorId || !req.body.patientId ) {
            return res.status(200).json({
                EM1: 'Invalid information',
                EM2: 'Thông tin không hợp lệ!',
                EC: -1,
                DT: ''
            }) 
        }
        let data = await PatientService.confirmAppointment(req.body)
        return res.status(200).json({
            EM1: data.EM1,
            EM2: data.EM2,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM1: 'Error of serve!',
            EM2: 'Lỗi hệ thống!',
            EC: -1,
            DT: ''
        })
    }
}

const searchFunc = async (req,res) => {
    try {
        let keyword = req.query.keyword,
            type = req.query.type,
            sort = req.query.sort,
        data = await PatientService.search(keyword,type,sort)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM: 'Error of serve!',
            EC: -1,
            DT: ''
        })
    }
}

const cancelBookingFunc = async (req, res) => {
    try {
        if(!req.body.Delete || !req.body.patientId || !req.body.doctorId || !req.body.staffId) {
            return res.status(200).json({
                EM1: 'Invalid information',
                EM2: 'Thông tin không hợp lệ!',
                EC: -1,
                DT: data.DT
            })  
        }
        let data = await PatientService.cancelBooking(req.body)
        return res.status(200).json({
            EM1: data.EM1,
            EM2: data.EM2,
            EC: data.EC,
            DT: data.DT
        }) 
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM1: 'Error of serve!',
            EM2: 'Lỗi hệ thống!',
            EC: -1,
            DT: ''
        }) 
    }
}

const rateBookingFunc = async (req, res) => {
    try {
        let data = await PatientService.rateBooking(req.body)
        return res.status(200).json({
            EM1: data.EM1,
            EM2: data.EM2,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM1: 'Error of serve!',
            EM2: 'Lỗi hệ thống!',
            EC: -1,
            DT: ''
        })
    }
}

module.exports = {
    bookingFunc,
    confirmBookingFunc,
    searchFunc,
    cancelBookingFunc,
    rateBookingFunc
}