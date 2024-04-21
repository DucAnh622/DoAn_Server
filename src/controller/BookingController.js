import BookingService from "../service/BookingService"

const getBookingManageFunc = async (req, res) => {
    try {
        if(req.query.page || req.query.limit || req.query.date) {
            let page = req.query.page
            let limit = req.query.limit
            let id = req.query.id
            let date = req.query.date
            let data = await BookingService.getBookingManage(id,date,+page,+limit)
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            }) 
        }
        else {
            return res.status(200).json({
                EM: `Missing parameters`,
                EC: '1',
                DT: ''
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            EM: 'Error of serve!',
            EC: -1,
            DT: ''
        }) 
    }
}

const completedBookingManageFunc = async (req, res) => {
    try {
        if ( !req.body.patientId || !req.body.doctorId || !req.body.email || !req.body.username) {
            return res.status(200).json({
                EM: `Missing parameters`,
                EC: '1',
                DT: ''
            })
        }
        let data = await BookingService.completedBookingManage(req.body)
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
            EM: 'Error of serve!',
            EC: -1,
            DT: ''
        }) 
    }
}

const getHistoryBookingFunc = async (req,res) => {
    try {
        if(req.query.patientId || req.query.limit || req.query.page) {
            let patientId = req.query.patientId
            let limit = req.query.limit
            let page = req.query.page
            let data = await BookingService.getHistoryBooking(patientId, +page, +limit)
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
        else {
            return res.status(200).json({
                EM: 'Missing parameters',
                EC: 1,
                DT: ''
            }) 
        }
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

const cancelBookingManageFunc = async (req, res) => {
    try {
        if ( !req.body.patientId || !req.body.doctorId || !req.body.email) {
            return res.status(200).json({
                EM1: 'Missing parameters',
                EM2: 'Thiếu dữ liệu đầu vào',
                EC: '1',
                DT: ''
            })
        }
        let data = await BookingService.cancelBookingManage(req.body)
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
            EM2: 'Server gặp sự cố',
            EC: -1,
            DT: ''
        })
    }
}

const filterBookingManageFunc = async (req, res) => {
    try {
        if(req.query.id || req.query.type || req.query.limit || req.query.page) {
            let type = req.query.type,
                UserId = req.query.id,
                date = req.query.date,
                limit = req.query.limit,
                page = req.query.page,
                data = await BookingService.filterBookingManage(UserId,type,date,+page,+limit)
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
        else {
            return res.status(200).json({
                EM: 'Missing parameters',
                EC: 1,
                DT: ''
            }) 
        }
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM1: 'Error of serve!',
            EM2: 'Server gặp sự cố',
            EC: -1,
            DT: ''
        })
    }
}

const getTotalFunc = async (req, res) => {
    try {
        if ( !req.query.id) {
            return res.status(200).json({
                EM: 'Missing parameters',
                EC: '1',
                DT: ''
            })
        }
        let data = await BookingService.getTotal (req.query.id,req.query.date)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM1: 'Error of serve!',
            EM2: 'Server gặp sự cố',
            EC: -1,
            DT: ''
        })
    }
}

const getTotalByDateFunc = async (req, res) => {
    try {
        if ( !req.query.id || !req.query.date) {
            return res.status(200).json({
                EM: 'Missing parameters',
                EC: '1',
                DT: ''
            })
        }
        let data = await BookingService.getTotalByDate(req.query.id,req.query.date)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM1: 'Error of serve!',
            EM2: 'Server gặp sự cố',
            EC: -1,
            DT: ''
        })
    }
}

const getScheduleByDateFunc = async (req, res) => {
    try {
        if ( !req.query.id || !req.query.date) {
            return res.status(200).json({
                EM: 'Missing parameters',
                EC: '1',
                DT: ''
            })
        }
        let data = await BookingService.getScheduleByDate(req.query.id,req.query.date)
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

module.exports = {
    getBookingManageFunc,
    completedBookingManageFunc,
    cancelBookingManageFunc,
    getHistoryBookingFunc,
    filterBookingManageFunc,
    getTotalFunc,
    getTotalByDateFunc,
    getScheduleByDateFunc
}