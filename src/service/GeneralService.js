import db from '../models/index';
import {Op} from 'sequelize';

const fetchData = async (model) => {
    try {
        let data = await model.findAll();
        if (data) {
            return {
                EM: 'Get data successful',
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

const getGender = async () => {
    return await fetchData(db.Gender);
};

const getRole = async () => {
    return await fetchData(db.Role);
};

const getPosition = async () => {
    return await fetchData(db.Position);
};

const getPrice= async () => {
    return await fetchData(db.Price);
};

const getProvince = async () => {
    return await fetchData(db.Province);
};

const getPayment = async () => {
    return await fetchData(db.Payment);
};

const getTime = async () => {
    return await fetchData(db.Time);
};

const getTotal = async () => {
    try {
        let countCli = await db.Clinic.count(),
            countSpe =  await db.Speciality.count(),
            countDoc = await db.User.count({
                where: {
                    roleId: 2
                }
            }),
            countPat = await db.User.count({
                where: {
                    roleId: 4
                }
            }),
            data = {
               totalCli: countCli,
               totalSpe: countSpe,
               totalDoc: countDoc,
               totalPat: countPat 
            }
            return {
                EM: 'Get data successful',
                EC: 0,
                DT: data
            };
    } catch (err) {
        console.log(err);
        return {
            EM: 'Something wrong',
            EC: -1,
            DT: ''
        };
    }
}

module.exports = {
    getGender,
    getRole,
    getPosition,
    getPrice,
    getProvince,
    getPayment,
    getTime,
    getTotal
};