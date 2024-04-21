import UserService from '../service/UserService';

const getFunc = async (req, res)=> {
    try {
        if(req.query.page || req.query.limit) {
            let page = req.query.page
            let limit = req.query.limit
            let data = await UserService.Get(+page,+limit)
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

const createFunc = async (req, res)=> {
    try {
        if (!req.body.email || !req.body.phone || !req.body.password ) {
            return res.status(200).json({
                EM: 'Missing parameters',
                EC: '1',
                DT: ''
            })
        }
    
        if (req.body.password && req.body.password.length < 3) {
            return res.status(200).json({
                EM: 'Password must be longer than 3',
                EC: '1',
                DT: ''
            })  
        } 
        
        let data = await UserService.Create(req.body)
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

const editFunc = async (req, res)=> {
    try {
        let data = await UserService.Edit(req.body)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM: 'Error server!',
            EC: '-1',
            DT: []
        })
    }
}

const deleteFunc = async (req, res)=> {
    try {
        let  data = await UserService.Delete(req.body.id)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        }) 
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM: 'Error server!',
            EC: '-1',
            DT: []
        })
    }
}

const searchFunc = async (req, res)=> {
    try {
        if(req.query.limit && req.query.page) {
            let limit = req.query.limit 
            let page = req.query.page
            let data = await UserService.Search(+limit,+page,req.query.keyword)
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
            EM: 'Error of serve',
            EC: '-1',
            DT: []
        })
    }
}

const filterFunc = async (req, res)=> {
    try {
        if(req.query.limit && req.query.page) {
            let limit = req.query.limit 
            let page = req.query.page
            let type = req.query.type
            let data = await UserService.Filter(+limit,+page,+type)
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
            EM: 'Error of serve',
            EC: '-1',
            DT: []
        }) 
    }
}

const loginFunc = async (req, res) => {
    try {
        if(!req.body.valueLogin && !req.body.password) {
            return res.status(500).json({
                EM1: 'Missing parameters',
                EM2: 'Không có dữ liệu!',
                EC: '-1',
                DT: ''
            }) 
        }
        let data = await UserService.login(req.body)
        if(data && data.DT && data.DT.access_token) {
            res.cookie('jwt',data.DT.access_token,{httpOnly: true, maxAge: 60*60*1000})
        }
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
            EM1: 'Error of serve',
            EM2: 'Lỗi hệ thống',
            EC: '-1',
            DT: ''
        }) 
    }
}

const registerFunc = async (req, res) => {
    try {
        if(!req.body.fullname && !req.body.email && !req.body.phone && !req.body.password) {
            return res.status(500).json({
                EM1: 'Missing parameters',
                EM2: 'Không có dữ liệu!',
                EC: '-1',
                DT: ''
            }) 
        }

        if(req.body.password && req.body.password.length < 3) {
            return res.status(500).json({
                EM1: 'Password must be longer than 3!',
                EM2: 'Mật khẩu tối thiểu 3 kí tự!',
                EC: '-1',
                DT: ''
            })
        }

        let data = await UserService.register(req.body)
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
            EM1: 'Error of serve',
            EM2: 'Lỗi hệ thống',
            EC: '-1',
            DT: ''
        }) 
    } 
}

const getDetailFunc = async (req, res) => {
    try {
        if(req.query.id) {
            let id = req.query.id
            let data = await UserService.getDetail(id) 
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
        else {
            return res.status(200).json({
                EM: "Missing params",
                EC: 1,
                DT: ""
            })
        }
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM: 'Error of serve',
            EC: '-1',
            DT: ''
        }) 
    }
}

const getTotalFunc = async (req, res) => {
    try {
        if(!req.query.id) {
            return res.status(200).json({
                EM: "Missing params",
                EC: 1,
                DT: ""
            })
        }
        let data = await UserService.getTotal(req.query.id)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        return res.status(500).json({
            EM: 'Error of serve',
            EC: '-1',
            DT: ''
        })  
    }
} 

const getStaffFunc = async (req, res) => {
    try {
        let data = await UserService.getStaff()
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM: 'Error of serve',
            EC: '-1',
            DT: ''
        }) 
    }
} 

const getPatientFunc = async (req,res) => {
    try {
        if(!req.query.page || !req.query.limit) {
            return res.status(200).json({
                EM: "Missing parameter",
                EC: -1,
                DT: ""
            })
        }
        let page = req.query.page,
        limit = req.query.limit,
        data = await UserService.getPatient(+limit,+page)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM: "Error of server",
            EC: -1,
            DT: ""
        })
    }
}

const getPatientBookFunc = async (req,res) => {
    try {
        if(!req.query.patientId||!req.query.page || !req.query.limit) {
            return res.status(200).json({
                EM: "Missing parameter",
                EC: -1,
                DT: ""
            })
        }
        let
        patientId = req.query.patientId,
        page = req.query.page,
        limit = req.query.limit,
        data = await UserService.getPatientBook(patientId,+limit,+page)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            EM: "Error of server",
            EC: -1,
            DT: ""
        })
    }
}

module.exports = {
    getFunc,
    createFunc,
    editFunc,
    deleteFunc,
    searchFunc,
    filterFunc,
    loginFunc,
    registerFunc,
    getDetailFunc,
    getTotalFunc,
    getStaffFunc,
    getPatientFunc,
    getPatientBookFunc
}