import SpecialityService from'../service/SpecialityService';

const createSpecialityFunc = async (req,res) => {
    try {
        
        if(!req.body.speciality || !req.body.image) {
            return res.status(200).json({
                EM: 'Missing parameter',
                EC: -1,
                DT: ''
            })
        }
        let data = await SpecialityService.createSpeciality(req.body)
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

const getAllSpecialityFunc = async (req, res) => {
    try {
        if(req.query.page || req.query.limit) {
            let page = req.query.page
            let limit = req.query.limit
            let data = await SpecialityService.getAllSpeciality(+page,+limit)
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

const getSpecialityFunc = async (req, res) => {
    try {
        if(req.query.limit) {
            let limit = req.query.limit
            let data = await SpecialityService.getSpeciality(+limit)
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

const getDetailSpecialityFunc = async (req, res) => {
    try {
        if(!req.query.specialityID) {
            return res.status(500).json({
                EM: 'Missing parameter!',
                EC: -1,
                DT: ''
            })
        }
        let data = await SpecialityService.getDetailSpeciality(req.query.specialityID)
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

const getDoctorByProvinceSpecialityFunc = async (req, res) => {
    try {
        if(!req.query.provinceID && !req.query.specialityID) {
            return res.status(500).json({
                EM: 'Missing parameter!',
                EC: -1,
                DT: ''
            })
        }
        let data = await SpecialityService.getDoctorByProvinceSpeciality(req.query.provinceID,req.query.specialityID)
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

const deleteSpecialityFunc = async (req, res) => {
    try {
        let data = await SpecialityService.deleteSpeciality(req.body.specialityId)
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
    createSpecialityFunc,
    deleteSpecialityFunc,
    getAllSpecialityFunc,
    getSpecialityFunc,
    getDetailSpecialityFunc,
    getDoctorByProvinceSpecialityFunc
}