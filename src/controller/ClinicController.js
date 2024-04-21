import ClinicService from '../service/ClinicService';

let checkRequired = (rawData) => {
    let arrInput = ['nameClinic','addressClinic','image']
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

const createClinicFunc = async (req, res) => {
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
            data = await ClinicService.createClinic(req.body)
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

const getClinicFunc = async (req, res) => {
    try {
        let limit = req.query.limit
        let data = await ClinicService.getClinic(+limit)
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

const getDetailClinicFunc = async (req, res) => {
    try {
        if(!req.query.clinicID) {
            return res.status(500).json({
                EM: 'Missing parameter!',
                EC: -1,
                DT: ''
            })
        }
        let data = await ClinicService.getDetailClinic(req.query.clinicID)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            EM: 'Error of serve!',
            EC: -1,
            DT: ''
        }) 
    }
}

const getClinicByAddressFunc = async (req,res) => {
    try {
        let keyword = req.query.keyword,
            page = req.query.page,
            limit = req.query.limit,
            data = await ClinicService.getClinicByAddress(keyword,+page,+limit)
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

const deleteClinicFunc = async (req, res) => {
    try {
        let data = await ClinicService.deleteClinic(req.body.clinicId)
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

const getAllClinicFunc = async (req,res) => {
    try {
        if(req.query.limit || req.query.page) {
        let limit = req.query.limit,
            page = req.query.page,
            data = await ClinicService.getAllClinic(+page,+limit)
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
    createClinicFunc,
    deleteClinicFunc,
    getClinicFunc,
    getDetailClinicFunc,
    getClinicByAddressFunc,
    getAllClinicFunc
}