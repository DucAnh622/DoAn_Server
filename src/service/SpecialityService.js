import db from '../models/index';
import bcrypt from 'bcryptjs';
import {Op} from 'sequelize';
require('dotenv').config();

const createSpeciality = async (rawData) => {
    try {
        if(rawData.specialityId) {
            await db.Speciality.update({
                name: rawData.speciality,
                image: rawData.image,
                descriptionHTML: rawData.HTML,
                descriptionMarkdown: rawData.Markdown
            },{
                where:{
                    id: rawData.specialityId
                }
            })
        }
        else {
            await db.Speciality.create({
                name: rawData.speciality,
                image: rawData.image,
                descriptionHTML: rawData.HTML,
                descriptionMarkdown: rawData.Markdown,
            })
        }
        return {
            EM: "Save successfully!",
            EC: 0,
            DT: []
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

const getAllSpeciality = async (page,limit) => {
    try {
        let offset = (page - 1) * limit
        const {count, rows} = await db.Speciality.findAndCountAll({
            order: [
                ['id','DESC']
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
            EM:"Get speciality successfully!",
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

const getSpeciality = async (limit) => {
    try {
        let data = []
        if(limit) {
            data = await db.Speciality.findAll({
                attributes: {
                    exclude: ['descriptionHTML','descriptionMarkdown']
                },
                limit: limit
            })
        }
        else {
            data = await db.Speciality.findAll({
                attributes: {
                    exclude: ['descriptionHTML','descriptionMarkdown']
                },
            }) 
        }
        if(!data) {
            data = []
        }
        if(data && data.image) {
          data.image = new Buffer(data.image,'base64').toString('binary')
        }

        return {
            EM: "Get succesfully",
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

const getDetailSpeciality = async (specialityID) => {
    try {
        let data = await db.Speciality.findOne({
            where: {
                id: specialityID
            },
            include: [
                {model: db.Doctor_Infor, attributes: ['doctorId']},
            ]
        })
        return {
            EM: "Get succesfully",
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

const getDoctorByProvinceSpeciality = async (provinceID,specialityID) => {
    try {
        let data = ''
        if(provinceID === '0') {
            data = await db.Doctor_Infor.findAll({
                where: {
                    specialityId: specialityID
                },
                attributes: [ 'doctorId']        
            })
    
            return {
                EM: "Get succesfully",
                EC: 0,
                DT: data
            }
        }
        else {
            data = await db.Doctor_Infor.findAll({
                where: {
                    provinceId: provinceID,
                    specialityId: specialityID
                },
                attributes: [ 'doctorId']        
            })
    
            return {
                EM: "Get succesfully",
                EC: 0,
                DT: data
            }
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

const deleteSpeciality = async (specialityId) => {
    try {
        let data = await db.Speciality.findOne({
            where: {
                id: specialityId
            }
        })
        if(data) {
            data.destroy()
            return {
                EM1: 'Delete successfully!',
                EM2: 'Xóa thành công!',
                EC: 0,
                DT: ''
            }
        }
        return {
            EM1: 'Speciality is not exist!',
            EM2: 'Chuyên khoa không tồn tại!',
            EC: 1,
            DT: ''
        }
    }
    catch(err) {
        console.log(err)
        return {
            EM1: 'Something wrong',
            EM2: 'Đã xảy ra lỗi',
            EC: -1,
            DT: ''
        }
    }
}
 
module.exports = {
    deleteSpeciality,
    createSpeciality,
    getAllSpeciality,
    getSpeciality,
    getDetailSpeciality,
    getDoctorByProvinceSpeciality
}