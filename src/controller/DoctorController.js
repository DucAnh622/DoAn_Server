import DoctorService from '../service/DoctorService';

let checkRequired = (rawData) => {
    let arrInput = ['doctorId','action','selectedSpec','selectedClin','selectedPrice','selectedProv','selectedPay']
    let isValid = true
    let element = ''
    for (let i = 0;i < arrInput.length;i++) {
        if(!rawData[arrInput[i]]) {
            isValid = false
            element = arrInput[i]
            break
        }
    }
    return {
        isvalid: isValid,
        element: element
    }
}

const getFunc = async (req, res)=> {
    try {
        let limit = req.query.limit
        let data = await DoctorService.get(+limit)
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

const getByIdFunc = async (req, res)=> {
    try {
        let doctorId = req.query.doctorId
        let data = await DoctorService.getById(doctorId)
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

const createInfoFunc = async (req, res) => {
    try {
        let data = ''
        let check = checkRequired(req.body)
        if(check.isvalid === false){
            return res.status(200).json({
                EM: `Missing parameters ${check.element}`,
                EC: '1',
                DT: ''
            })
        }
        else {
            data = await DoctorService.createInfo(req.body)
        }
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

const getDetailFunc = async (req, res) => {
    try {
        if(!req.query.id) {
            return res.status(500).json({
                EM: 'Missing parameter!',
                EC: -1,
                DT: ''
            })
        }
        let data = await DoctorService.getDetail(req.query.id)
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

const createScheduleFunc = async (req,res) => {
    try {
        let data = await DoctorService.createSchedule(req.body)
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

const getScheduleFunc = async (req, res) => {
    try {
        if(!req.query.doctorId || !req.query.date) {
            return res.status(500).json({
                EM: 'Invalid doctor or date!',
                EC: -1,
                DT: ''
            })
        }
        let data = await DoctorService.getSchedule(req.query.doctorId,req.query.date)
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

const getInfoFunc = async (req, res) => {
    try {
        if(!req.query.doctorId) {
            return res.status(500).json({
                EM: 'Invalid doctor!',
                EC: -1,
                DT: ''
            })
        }
        let data = await DoctorService.getInfo(req.query.doctorId)
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

const getPriceFunc = async (req, res) => {
    try {
        if(!req.query.doctorId) {
            return res.status(500).json({
                EM: 'Missing parameter!',
                EC: -1,
                DT: ''
            })
        } 
        let data = await DoctorService.getPrice(req.query.doctorId)
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

const getCommentFunc = async (req, res) => {
    try {
        if(!req.query.doctorId) {
            return res.status(500).json({
                EM: 'Missing parameter!',
                EC: -1,
                DT: ''
            })
        } 
        let data = await DoctorService.getComment(req.query.doctorId)
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

const getAllDoctorFunc = async (req,res) => {
    try {
        if(req.query.page || req.query.limit) {
            let page = req.query.page
            let limit = req.query.limit
            let data = await DoctorService.getAllDoctor(+page,+limit)
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
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
    
module.exports = {
    getFunc,
    getByIdFunc,
    getInfoFunc,
    createInfoFunc,
    getDetailFunc,
    createScheduleFunc,
    getScheduleFunc,
    getPriceFunc,
    getCommentFunc,
    getAllDoctorFunc
}