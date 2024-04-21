import db from '../models/index';
import bcrypt from 'bcryptjs';
import { raw } from 'body-parser';
import {Op} from 'sequelize';

const createClinic = async (rawData) => {
    try {
        if(rawData.clinicId) {
            await db.Clinic.update({
                name: rawData.nameClinic,
                image: rawData.image,
                address: rawData.addressClinic,
                descriptionHTML: rawData.HTML,
                descriptionMarkdown: rawData.Markdown
            },{
                where:{
                    id: rawData.clinicId
                }
            })
        }
        else {
            await db.Clinic.create({
                name: rawData.nameClinic,
                image: rawData.image,
                address: rawData.addressClinic,
                descriptionHTML: rawData.HTML,
                descriptionMarkdown: rawData.Markdown
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

const getClinic = async (limit) => {
    try {
        let data = []
        if(limit) {
            data = await db.Clinic.findAll({
                attributes: {
                    exclude: ['descriptionHTML','descriptionMarkdown']
                },
                limit: limit
            })
        }
        else {
            data = await db.Clinic.findAll({
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

const getDetailClinic = async (clinicID) => {
    try {
        let data = await db.Clinic.findOne({
            where: {
                id: clinicID
            },
            include: [
                {model: db.Doctor_Infor, attributes: ['doctorId']},
            ]
        })
        if(!data) {
            data = []
        }
        return {
            EM: "Get detail succesfully",
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

const getClinicByAddress = async (keyword,page,limit) => {
    try {
        let offset = (page - 1) * limit
        const {count, rows} = await db.Clinic.findAndCountAll({
            where: {
                address: { [Op.like]: `%${keyword}%` }                  
            },
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
            EM:"Get clinic successfully!",
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

const deleteClinic = async (clinicId) => {
    try {
        let data = await db.Clinic.findOne({
            where: {
                id: clinicId
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
            EM1: 'Hospital is not exist!',
            EM2: 'Cơ sở y tế không tồn tại!',
            EC: 1,
            DT: ''
        }
    }
    catch(err) {
        console.log(err)
        return {
            EM1: 'Something wrong!',
            EM2: 'Đã xảy ra lỗi!',
            EC: -1,
            DT: ''
        }
    }
}

const getAllClinic = async (page,limit) => {
    try {
        let offset = (page - 1) * limit
        const {count, rows} = await db.Clinic.findAndCountAll({
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
            EM:"Get clinic successfully!",
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

module.exports = {
    createClinic,
    deleteClinic,
    getClinic,
    getDetailClinic,
    getClinicByAddress,
    getAllClinic
}