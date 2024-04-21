import db from '../models/index';
import bcrypt from 'bcryptjs';
import {Op} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();
import EmailService from './EmailService';

const verifyToken = (doctorId,staffId,patientId) => {
    let url = `${process.env.React_Url}/verify-booking?staffId=${staffId}&doctorId=${doctorId}&patientId=${patientId}`
    return url
}

const bookingAppointment = async (rawData) => {
    try {
        let data = await db.User.findOne({
            where:{
                id: rawData.userId,
                roleId: 4
            }
        })
        if(!data) {
            return {
                EM1: 'Account not exits, please try again or sign up!',
                EM2: 'Tài khoản không tồn tại, vui lòng thử lại hoặc đăng ký!',
                EC: -1,
                DT: []
            } 
        }

        let infoDoc = await db.Doctor_Infor.findOne({
          attributes: {
            exclude: ['contentMarkdown','contentHTML','description','note','createdAt','updatedAt'],
          },
          include: [
            { model: db.Price, attributes: ['valueEN', 'valueVI'] },
            { model: db.Province, attributes: ['valueEN', 'valueVI'] },
            { model: db.Payment, attributes: ['valueEN', 'valueVI'] },
            { model: db.User, as: "staffData", attributes: ['fullName'] },
            { model: db.Clinic, attributes: ['name', 'address'] },
          ],
          where: {
            doctorId: rawData.doctorId
          }
        });

        if(infoDoc) {
          await db.Booking.destroy({
              where: {
                  doctorId: rawData.doctorId,
                  patientId: data.id,
                  staffId: infoDoc.staffId,
                  date: rawData.date,
                  statusId: 1
              }
          })

          await db.Booking.create({
            statusId: 1,
            doctorId: rawData.doctorId,
            staffId: infoDoc.staffId,
            patientId: data.id,
            patientName: rawData.patientName,
            patientGenderId: rawData.genderId,
            reason: rawData.reason,
            date: rawData.date,
            timeId: rawData.timeId,
          })
        }

        await EmailService.sendEmail({
            emailReceived: data.email,
            doctorName: rawData.doctorName,
            username: data.fullName,
            patientName: rawData.patientName,
            infomation: infoDoc,
            address: data.address,
            phone: data.phone,
            date: rawData.date,
            time: rawData.timeData,
            reason: rawData.reason,
            lang: rawData.LangType,
            url: verifyToken(rawData.doctorId,infoDoc.staffId,data.id)
        })

        await db.Schedule.update({
            check: true  
          },{
            where: {
                doctorId: rawData.doctorId,
                date: rawData.date,
                timeId: rawData.timeId
            }
        })

        return {
            EM1: 'Save successfully, please wait for a confirmation call or email confirmation!',
            EM2: 'Lưu thành công, vui lòng chờ cuộc gọi xác nhận hoặc xác nhận qua email!',
            EC: 0,
            DT: []
        } 
    }

    catch(err) {
        console.log(err)
        return {
            EM1: 'Something wrong',
            EM2: 'Lỗi không xác định!',
            EC: -1,
            DT: ''
        }
    }
}

const confirmAppointment = async (rawData) => {
    try {
        let book = await db.Booking.findOne({
            where: {
                id: rawData.id,
                statusId: 1
            }
        })

        if(!book) {
            return {
                EM1: 'Booking not exists!',
                EM2: 'Lịch hẹn không tồn tại!',
                EC: -1,
                DT: []
            }  
        }
        book.statusId = 2
        await book.save()
        return {
            EM1: 'Confirm successfully!',
            EM2: 'Xác nhận thành công!',
            EC: 0,
            DT: []
        } 
    }
    catch(err) {
        console.log(err)
        return {
            EM1: 'Something wrong',
            EM2: 'Lỗi không xác định!',
            EC: -1,
            DT: ''
        }
    }
}

const search = async (keyword, type, sort) => {
    try {
      let data = {
        rsDoc: [],
        rsSpe: [],
        rsCli: []
      };

      if (type === "DOC") {
        data.rsDoc = await db.User.findAll({ 
          where: 
              { 
                fullName: { [Op.like]: `%${keyword}%` }, 
                roleId: 2
              }, 
              order: sort ? [['fullName', sort]] : [['fullName','ASC']], 
              attributes: 
              {
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
              })
        return {
          EM: 'Search successfully!',
          EC: 0,
          DT: data
        };
      }
      else if (type === "SPE") {
        data.rsSpe = await db.Speciality.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, order: sort ? [['name', sort]] : [['name','ASC']] });
        return {
          EM: 'Search successfully!',
          EC: 0,
          DT: data
        };
      }
      else if (type === "CLI") {
        data.rsCli = await db.Clinic.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, order: sort ? [['name', sort]] : [['name','ASC']] });
        return {
          EM: 'Search successfully!',
          EC: 0,
          DT: data
        };
      }
      else {
        const [doctors, specialties, clinics] = await Promise.all([
          db.User.findAll({ 
            where: 
                { 
                  fullName: { [Op.like]: `%${keyword}%` }, 
                  roleId: 2
                }, 
                order: sort ? [['fullName', sort]] : [['fullName','ASC']], 
                attributes: 
                {
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
                }),
          db.Speciality.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, order: sort ? [['name', sort]] : [['name','ASC']]}),
          db.Clinic.findAll({ where: { name: { [Op.like]: `%${keyword}%` } }, order: sort ? [['name', sort]] : [['name','ASC']]})
        ]);
        data.rsDoc = doctors;
        data.rsSpe = specialties;
        data.rsCli = clinics;
        return {
          EM: 'Search successfully!',
          EC: 0,
          DT: data
        };
      }
    } catch (err) {
      console.log(err);
      return {
        EM: 'Something wrong',
        EC: -1,
        DT: ''
      };
    }
  };

const cancelBooking = async (rawData) => {
  try {
      let data = await db.Booking.findOne({
        where: {
          id: rawData.id
        }
      })
      if(data) {
        await db.Booking.update({
          statusId: 4,
          cancel: rawData.Delete
        },{
          where: {
            id: rawData.id
          }
        })

        await db.Schedule.update({
          check: false
        },{
            where: {
                doctorId: rawData.doctorId,
                date: rawData.date,
                timeId: rawData.timeId
            }
        })

        await EmailService.sendEmailCancel({
          emailReceived: rawData.email,
          doctorName: rawData.doctor,
          username: rawData.username,
          patientName: rawData.patientName,
          cancel: rawData.Delete,
          date: rawData.date,
          time: rawData.timeData,
          lang: rawData.LangType,
        })

        return {
          EM1: 'Cancel appointment successfully!',
          EM2: 'Lịch hẹn đã được hủy!',
          EC: 0,
          DT: []
        };
      }
      return {
        EM1: 'Appointment not exists!',
        EM2: 'Lịch hẹn không tồn tại!',
        EC: 1,
        DT: []
      };
  }
  catch(err) {
    console.log(err);
      return {
        EM1: 'Something wrong',
        EM2: 'Đã xảy ra lỗi',
        EC: -1,
        DT: ''
      };
  }
}  

const rateBooking = async (rawData) => {
  try {
    let data = await db.Booking.findOne({
      where: {
        id: +rawData.id,
        patientId: rawData.patientId,
        doctorId :rawData.doctorId,
        statusId: rawData.statusId
      }
    })
    if(!data) {
      return {
          EM1: 'Appointment not exists!',
          EM2: 'Lịch hẹn không tồn tại!',
          EC: 1,
          DT: ''
      }
    }
    data.comment = rawData.Comment
    data.save()
    return {
      EM1: 'Feedback is recorded!',
      EM2: 'Phản hồi đã được ghi nhận!',
      EC: 0,
      DT: ''
    }
  }
  catch(err) {
    console.log(err);
      return {
        EM1: 'Something wrong',
        EM2: 'Đã xảy ra lỗi',
        EC: -1,
        DT: ''
      };
  }
}

module.exports = {
    bookingAppointment,
    confirmAppointment,
    search,
    cancelBooking,
    rateBooking
}