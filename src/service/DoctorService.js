import db from '../models/index';
import bcrypt from 'bcryptjs';
import {Op} from 'sequelize';
import { where } from 'sequelize/lib/sequelize';
require('dotenv').config();

const get = async (limit) => {
    try {
        let data = []
        if(limit) {
            data = await db.User.findAll({
                where: {
                    roleId: 2
                },
                order: [['createdAt','DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Position, attributes: ['valueEN','valueVI']},
                    {model: db.Gender, attributes: ['valueEN','valueVI']},
                    {model: db.Doctor_Infor, 
                        attributes: ['doctorId','specialityId'],
                        include: [
                            {model: db.Speciality, attributes: ['name']}
                        ]
                    }
                ],
                limit: limit,
                raw: true,
                nest: true
            })
        }
        else {
            data = await db.User.findAll({
                where: {
                    roleId: 2
                },
                order: [['createdAt','DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Position, attributes: ['valueEN','valueVI']},
                    {model: db.Gender, attributes: ['valueEN','valueVI']},
                    {model: db.Doctor_Infor, 

                        attributes: ['doctorId','specialityId'],
                        include: [
                            {model: db.Speciality, attributes: ['name']}
                        ]
                    }
                ],
                raw: true,
                nest: true
            })
        }
        if(data) {
            return {
                EM: 'Get doctor success',
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


const getById = async (doctorId) => {
    try {
        let data = []
        data = await db.User.findAll({
            where: {
                roleId: 2,
                id: doctorId
            },
            order: [['createdAt','DESC']],
            attributes: {
                exclude: ['password']
            },
            include: [
                {model: db.Position, attributes: ['valueEN','valueVI']},
                {model: db.Gender, attributes: ['valueEN','valueVI']},
                {model: db.Doctor_Infor, 

                    attributes: ['doctorId','specialityId'],
                    include: [
                        {model: db.Speciality, attributes: ['name']}
                    ]
                }
            ],
            raw: true,
            nest: true
        })
        if(data) {
            return {
                EM: 'Get doctor success',
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

const createInfo = async (rawData) => {
    try {
        if(rawData.action === 'CREATE') {
            await db.Doctor_Infor.create({
                doctorId: rawData.doctorId,
                staffId: rawData.selectedStaf,
                priceId: rawData.selectedPrice,
                paymentId: rawData.selectedPay,
                provinceId: rawData.selectedProv,
                specialityId: rawData.selectedSpec,
                clinicId: rawData.selectedClin,
                description: rawData.description,
                contentHTML: rawData.contentHTML,
                contentMarkdown: rawData.contentMarkdown,
                note: rawData.note
            })
            return {
                EM: 'Create successfully!',
                EC: 0,
                DT: ''
            }
        }
        if(rawData.action === 'EDIT') {
            await db.Doctor_Infor.update({
                staffId: rawData.selectedStaf,
                priceId: rawData.selectedPrice,
                paymentId: rawData.selectedPay,
                provinceId: rawData.selectedProv,
                specialityId: rawData.selectedSpec,
                clinicId: rawData.selectedClin,
                description: rawData.description,
                contentHTML: rawData.contentHTML,
                contentMarkdown: rawData.contentMarkdown,
                note: rawData.note
            },{
                where:{
                    doctorId: rawData.doctorId
                }
            })
            return {
                EM: 'Update successfully!',
                EC: 0,
                DT: ''
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

const getDetail = async (id) => {
    try {
        let data = await db.User.findOne({
            where: {
                id: id,
                roleId: 2
            },
            attributes: {
                exclude: ['password','genderId','positionId','roleId','address']
            },
            include: [
                {model: db.Position, attributes: ['valueEN','valueVI']},
                {model: db.Doctor_Infor, 
                    attributes: ['specialityId','clinicId','priceId','paymentId','provinceId','staffId','description','contentHTML','contentMarkdown','note'],
                    include: [
                        {model: db.Price, attributes: ['valueEN','valueVI']},
                        {model: db.Province, attributes: ['valueEN','valueVI']},
                        {model: db.Payment, attributes: ['valueEN','valueVI']},
                        {model: db.Speciality, attributes: ['name']},
                        {model: db.Clinic, attributes: ['name','address']},
                    ]
                }
            ],
        })
        if(data && data.image) {
          data.image = new Buffer(data.image,'base64').toString('binary')
        }
        if (!data) {
            data = {}
        }
        return {
            EM: 'Get successfully!',
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

const getPrice = async (Id) => {
    try {
        let data = await db.Doctor_Infor.findOne({
            where: {
                doctorId: Id
            },
            attributes: {
                exclude: ['id','doctorId']
            },
            include: [
                {model: db.Price, attributes: ['valueEN','valueVI']},
                {model: db.Province, attributes: ['valueEN','valueVI']},
                {model: db.Payment, attributes: ['valueEN','valueVI']},
                {model: db.Clinic,attributes: ['name','address']},
            ]
        })
        return {
            EM: 'Get successfully!',
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

const createSchedule = async (rawData) => {
    try {
      await db.Schedule.destroy({
        where: {
          doctorId: +rawData.doctorId,
          date: rawData.date
        }
      });
  
      let result = [];
      let data = rawData.timeArr;
      if (data && data.length > 0) {
        result = data.map(item => {
          return {
            ...item,
          };
        });
      }
  
      await db.Schedule.bulkCreate(result);
  
      return {
        EM: 'Create schedule successfully!',
        EC: 0,
        DT: ''
      };
    } catch (err) {
      console.log(err);
      return {
        EM: 'Something wrong',
        EC: -1,
        DT: ''
      };
    }
  };

const getSchedule = async (doctorId, date) => {
    try {
        let data = []
        data = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: date
            },
            include: [
                {model: db.Time, attributes: ['timeType']},
            ]
        })
        if(data) {
            return {
                EM: 'Get successfully!',
                EC: 0,
                DT: data
            }
        }
        else {
            return {
                EM: 'Get successfully!',
                EC: 0,
                DT: []
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

const getInfo = async (doctorId) => {
    try {
        let data = await db.User.findOne({
            where: {
                id: doctorId,
                roleId: 2
            },
            attributes: {
                exclude: ['password','genderId','positionId','roleId','address','createdAt','updatedAt']
            },
            include: [
                {model: db.Position, attributes: ['valueEN','valueVI']},
                {model: db.Doctor_Infor, 
                    attributes: {
                        exclude: ['id','doctorId','createdAt','updatedAt']
                    },
                    include: [
                        {model: db.Price, attributes: ['valueEN','valueVI']},
                        {model: db.Province, attributes: ['valueEN','valueVI']},
                        {model: db.Payment, attributes: ['valueEN','valueVI']},
                        {model: db.User, as:"staffData" ,attributes: ['fullname']},
                        {model: db.Clinic,attributes: ['name','address']},
                    ]
                }
            ],
        })
        if(data && data.image) {
          data.image = new Buffer(data.image,'base64').toString('binary')
        }
        if (!data) {
            data = {}
        }
        return {
            EM: 'Get info successfully!',
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

const getComment = async (docID) => {
    try {
        let data = await db.Booking.findAll({
            attributes: ['comment','date'],
            include: [
                {model: db.User, as: 'patientData', attributes: ['fullName','image']}
            ],
            where: {
                doctorId: docID,
                comment: {
                    [Op.ne]: null 
                }
            }
        })
        return {
            EM: 'Get successfully!',
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

const getAllDoctor = async (page,limit) => {
    try {
        let offset = (page - 1) * limit
        const {count, rows} = await db.User.findAndCountAll({
            attributes: {
                exclude: ['password']
            },
            include: [
                {model: db.Position, attributes: ['valueEN','valueVI']},
                {model: db.Gender, attributes: ['valueEN','valueVI']},
                {model: db.Doctor_Infor, 
                    attributes: ['doctorId','specialityId'],
                    include: [
                        {model: db.Speciality, attributes: ['name']}
                    ]
                }
            ],
            where: {
                roleId: 2
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
            EM:"Get doctor successfully!",
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
    get,
    getInfo,
    createInfo,
    getDetail,
    createSchedule,
    getSchedule,
    getPrice,
    getById,
    getComment,
    getAllDoctor
}