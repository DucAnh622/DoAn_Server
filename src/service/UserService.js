import db from '../models/index';
import bcrypt from 'bcryptjs';
import {Op} from 'sequelize';
import {CreateJWT} from '../middleware/JWTAction';
require ('dotenv').config();

const salt = bcrypt.genSaltSync(10)

let PasswordHash = (UserPassword)=> {
    let hashPassword = bcrypt.hashSync(UserPassword,salt)
    return hashPassword
}

const checkPassword = (userPassword, dataPassword) => {
    return bcrypt.compareSync(userPassword, dataPassword);
}

const checkEmail = async (userEmail) => {
    let userExist = await db.User.findOne({
        where: {
            email: userEmail
        }
    })

    if(userExist) {
        return true
    }

    return false
}

const checkPhone = async (userPhone) => {
    let userExist = await db.User.findOne({
        where: {
            phone: userPhone
        }
    })

    if(userExist) {
        return true
    }

    return false
}

const Get = async (page,limit) => {
    try {
        let offset = (page - 1) * limit
        const {count, rows} = await db.User.findAndCountAll({
            attributes: ['id','fullName','image','genderId','email','phone','address','roleId','positionId'],
            include: [
                {model: db.Role, attributes: ['valueEN','valueVI']},
                {model: db.Position, attributes: ['valueEN','valueVI']},
                {model: db.Gender, attributes: ['valueEN','valueVI']},
            ],
            order: [
                ['id','ASC']
            ],
            offset: offset,
            limit: limit
        })
        let totalPages = Math.ceil(count/limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            data: rows
        }
        return {
            EM:"Get user successfully!",
            EC: 0,
            DT: data
        } 
    }
    catch(err) {
        console.log(err)
        return {
            EM: 'Something wrong',
            EC: -1,
            DT: ''
        }
    }
}

const Create = async (rawData) => {
    try{
        let emailExist = await checkEmail(rawData.email)
        let phoneExist = await checkPhone(rawData.phone)
        if(emailExist === true) {
            return {
                EM: 'The email has already exist!',
                EC: 1,
                DT: 'email'
            }
        }
    
        if(phoneExist === true) {
            return {
                EM: 'The phone number has already exist!',
                EC: 1,
                DT: 'phone'
            }
        }
        
        let hashPassword = PasswordHash(rawData.password)

        let data = await db.User.create({  
            fullName: rawData.fullName,
            image: rawData.image,
            genderId: rawData.genderId,
            email: rawData.email,
            phone: rawData.phone,
            address: rawData.address,
            roleId: rawData.roleId,
            positionId: rawData.positionId,
            password: hashPassword
        })
        return {
            EM: 'Create successfully!',
            EC: 0,
            DT: ''
        }
    }
    catch(err) {
        console.log(err)
        return {
            EM: 'Something wrong',
            EC: -1,
            DT: ''
        }
    }
}

const Edit = async (rawData) => {
    try {
        await db.User.update({
            fullName: rawData.fullName,
            image: rawData.image,
            email: rawData.email,
            genderId: rawData.genderId,
            roleId: rawData.roleId,
            positionId: rawData.positionId,
            address: rawData.address
        },{
            where:{
                id: rawData.id
            }
        })
        let data = await db.User.findOne({
            where: {
                id: rawData.id,
            },
            attributes: 
            {
                exclude: ['password']
            }, 
        })
        if(data) {
            return {
                EM: 'Update successfully!',
                EC: 0,
                DT: data
            }
        } 
    }
    catch(err) {
        console.log(err)
        return {
            EM: 'Something wrongs!',
            EC: '1',
            DT: ''
        }
    }
}

const Delete = async (userId) => {
    try{
        let data = await db.User.findOne({
                where: {
                    id: userId
                }
            })
            if(data) {
                data.destroy()
                return {
                    EM: 'Delete successfully!',
                    EC: 0,
                    DT: ''
                }
            }
            return {
                EM: 'User is not exist!',
                EC: 1,
                DT: ''
            }
        }
        catch(err) {
            console.log(err)
            return {
                EM: 'Something wrongs!',
                EC: '1',
                DT: ''
            }
        }
}

const Search = async (limit,page,keyword) => {
    try {
        let offset = (page - 1) * limit
        const {count, rows} = await db.User.findAndCountAll({
            attributes: ['id','fullName','image','genderId','email','phone','address','roleId','positionId'],
            include: [
                {model: db.Role, attributes: ['valueEN','valueVI']},
                {model: db.Position, attributes: ['valueEN','valueVI']},
                {model: db.Gender, attributes: ['valueEN','valueVI']},
            ],
            order: [
                ['id','ASC']
            ],
            offset: offset,
            limit: limit,
            where: {
                [Op.or]: [
                  {
                      fullName: {
                          [Op.like]: `%${keyword}%`
                    } 
                  }
                ]
              }
        })
        let totalPages = Math.ceil(count/limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            data: rows
        }
        return {
            EM:"Search successfully!",
            EC: 0,
            DT: data
        } 
    }
    catch(err) {
        console.log(err)
        return {
            EM: 'Something wrong',
            EC: -1,
            DT: ''
        }
    }
}

const Filter = async (limit,page,type) => {
    try {
        let offset = (page-1)*limit
        const {count, rows} = await db.User.findAndCountAll({
            attributes: ['id','fullName','image','genderId','email','phone','address','roleId','positionId'],
            include: [
                {model: db.Role, attributes: ['valueEN','valueVI']},
                {model: db.Position, attributes: ['valueEN','valueVI']},
                {model: db.Gender, attributes: ['valueEN','valueVI']},
            ],
            offset: offset,
            limit: limit,
            where: {
                roleId: type
            }
        })
        let totalPages = Math.ceil(count/limit)
        let data = {
            totalRows: count,
            totalPages: totalPages,
            data: rows
        }
        return {
            EM: 'Filter successfully!',
            EC: 0,
            DT: data
        }
    }
    catch(err) {
        console.log(err)
        return {
            EM: 'something wrongs!',
            EC: 2,
            DT: []
        }
    }
}

const login = async (rawData) => {
    try {
        let data = await db.User.findOne({
            attributes: ['id','fullName','image','email','roleId','password','genderId'],
            where: {
                [Op.or]: [
                    {
                        email: rawData.valueLogin
                    },
                    {
                        phone: rawData.valueLogin                    }
                ]
            },
            raw: true
        })
        if(data) {
            let check = checkPassword(rawData.password,data.password)
            if(check) {
                delete data['password'];
                let payload = {
                    id: data.id,
                    roleId: data.roleId,
                    fullName: data.fullName,
                    email: data.email
                }
                let token = CreateJWT(payload)
                return {
                    EM1: 'Login successfully!',
                    EM2: 'Đăng nhập thành công!',
                    EC: 0,
                    DT: {
                        access_token: token,
                        id: data.id,
                        roleId: data.roleId,
                        genderId: data.genderId,
                        fullName: data.fullName,
                        image: data.image
                    }
                }
            }
        }
        else {
            return {
                EM1: 'Email or phone number or password is not correct!',
                EM2: 'Email hoặc số điện thoại không đúng!',
                EC: 1,
                DT: ''
            }
        }
    }
    catch(err) {
        console.log(err)
        return {
            EM1: 'something wrongs!',
            EM2: 'Lỗi không xác định!',
            EC: 2,
            DT: ''
        } 
    }
}

const register = async (rawData) => {
    try {
        let emailExist = await checkEmail(rawData.email)
        let phoneExist = await checkPhone(rawData.phone)
        if(emailExist === true) {
            return {
                EM1: 'The email has already exist!',
                EM2: 'Email này đã tồn tại!',
                EC: 1
            }
        }
    
        if(phoneExist === true) {
            return {
                EM1: 'The phone number has already exist!',
                EM2: 'Số điện thoại này đã tồn tại!',
                EC: 1
            }
        }

        let hashPassword = PasswordHash(rawData.password)

        await db.User.create({
            fullName: rawData.fullName,
            image: rawData.image,
            genderId: rawData.genderId,
            email: rawData.email,
            phone: rawData.phone,
            address: rawData.address,
            roleId: 4,
            positionId: 1,
            password: hashPassword
        })

        return {
            EM1: 'Registered successfully!',
            EM2: 'Đăng kí thành công!',
            EC: 0
        }
    }
    catch(err) {
        console.log(err)
        return {
            EM1: 'something wrongs!',
            EM2: 'Lỗi không xác định!',
            EC: 2,
            DT: ''
        }   
    }
}

const getDetail = async (id) => {
    try {
        let data = await db.User.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['password','roleId','positionId']
            },
        })
        if(data) {
            return {
                EM: 'Get detail successful',
                EC: 0,
                DT: data
            }
        }
        else {
            return {
                EM: 'User is not exists!',
                EC: 1,
                DT: []
            }
        }
    }
    catch(err) {
        console.log(err)
        return {
            EM: 'something wrongs!',
            EC: 2,
            DT: ''
        }  
    }
}

const getTotal = async (userID) => {
    try {
        let 
        countUsers = 0,
        countDoctors = 0,
        countStaffs = 0,
        countPatients=0,
        countAdmins = 0,
        countSpecialities = 0,
        countClinics = 0,
        data,
        user = await db.User.findOne({
            where: {
                id: userID
            }
        })
        if(!user)  {
            return {
                EM: 'User is not exists!',
                EC: 1,
                DT: []
            }
        }
        switch(user.roleId) {
            case 1: 
            countUsers = await db.User.count(),
            countPatients = await db.User.count({
                where: {
                    roleId: 4
                }
            }),
            countDoctors = await db.User.count({
                where: {
                    roleId: 2
                }
            }),
            countStaffs = await db.User.count({
                where: {
                    roleId: 3
                }
            }),
            countAdmins = await db.User.count({
                where: {
                    roleId: 1
                }
            })

            countSpecialities = await db.Speciality.count()
            countClinics = await db.Clinic.count()
            break;
            case 2:
                countPatients = await db.Booking.count({
                    distinct: true,
                    col: 'patientId',
                    where: {
                        doctorId: user.id,
                        statusId: 3
                    }
                })
                break;
            case 3:
                countPatients = await db.Booking.count({
                    where: {
                        staffId: user.id,
                    },
                    distinct: true,
                    col: 'patientId'
                });
                countDoctors = await db.Doctor_Infor.count({
                    where: {
                        staffId: user.id
                    }
                })
                break;          
            }
    
        data = {
            totalUser: countUsers,
            totalDoctor: countDoctors,
            totalAdmin: countAdmins,
            totalStaff: countStaffs,
            totalPatient: countPatients,
            totalClinic: countClinics,
            totalSpecialities: countSpecialities
        }
        
        return {
            EM: 'Get total successfully!',
            EC: 0,
            DT: data
        };

    } catch(err) {
        console.log(err);
        return {
            EM: 'something wrongs!',
            EC: 2,
            DT: ''
        };
    }
};

const getStaff = async () => {
    try {
        let data = await db.User.findAll({
            where: {
                roleId: 3
            },
            attributes: {
                exclude: ['password','image']
            },
        })
        return {
            EM: 'Get staff successfully!',
            EC: 0,
            DT: data
        };
    }
    catch(err) {
        console.log(err);
        return {
            EM: 'something wrongs!',
            EC: 2,
            DT: ''
        };
    }
} 

const getPatient = async (limit, page) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.User.findAndCountAll({
            attributes: {exclude: ['password','image','phone','address','createdAt','updatedAt','postionId']},
            include:[
                {
                    model: db.Gender, attributes: ['valueEN','valueVI']
                }
            ],
            where: {
                roleId: 4
            },
            offset: offset,
            limit: limit,
        });

        const countPromises = rows.map(async user => {
            let count = await db.Booking.count({
                where: {
                    patientId: user.id,
                    statusId: 3,
                }
            }),
            latestAppointment = await db.Booking.findOne({
                where: {
                    patientId: user.id,
                    statusId: 3
                },
                attributes: [[db.sequelize.fn('MAX', db.sequelize.col('date')), 'latestDate']],
                raw: true,
            });
            return { ...user.toJSON(), bookingCount: count, lastDate: latestAppointment.latestDate };
        });

        const usersWithBookingCount = await Promise.all(countPromises);

        const totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            data: usersWithBookingCount
        };

        return {
            EM: "Get patient successfully!",
            EC: 0,
            DT: data
        };
    }
    catch (err) {
        console.log(err);
        return {
            EM: 'Something went wrong!',
            EC: 2,
            DT: ''
        };
    }
};

const getPatientBook = async (patientId,limit,page) => {
    try {
        let offset = (page - 1) * limit,
        {count, rows} = await db.Booking.findAndCountAll({
            where: {
                patientId: patientId,
            },
            include: [
                {model: db.Time, attributes: ['timeType']},
                {model: db.Status, attributes: ['valueEN','valueVI']},
                {model: db.User, as:"doctorDataBooking" ,attributes: ['fullname'],
                include: [
                    {model: db.Doctor_Infor, attributes: ['doctorId'], include:[
                        {model: db.Speciality, attributes:['name']},
                        {model: db.Clinic, attributes:['name']},
                    ]}
                ]
                },
                {model: db.User, as:"staffDataBooking" ,attributes: ['fullname']},
                {model: db.User, as:"patientData" ,attributes: ['fullname','email','phone','address']},
                {model: db.Gender, attributes: ['valueEN','valueVI']},
            ],
            order: [
                ['id','DESC']
            ],
            offset: offset,
            limit: limit,
        }),
        totalPages = Math.ceil(count/limit),
        data = {
            totalRows: count,
            totalPages: totalPages,
            data: rows
        }
        return {
            EM:"Get history successfully!",
            EC: 0,
            DT: data
        } 
    }
    catch(err) {
        console.log(err);
        return {
            EM: 'Something went wrong!',
            EC: 2,
            DT: ''
        };
    }
}

module.exports = {
    Get,
    Create,
    Edit,
    Delete,
    Search,
    Filter,
    register,
    login,
    getDetail,
    getTotal,
    getStaff,
    getPatient,
    getPatientBook
}