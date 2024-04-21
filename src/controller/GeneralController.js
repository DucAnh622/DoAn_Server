import GeneralService from '../service/GeneralService';

const handleRequest = async (func, req, res) => {
    try {
        let data = await func();
        if (data) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            EM: "Error of serve!",
            EC: '-1',
            DT: ''
        });
    }
};

const getGenderFunc = async (req, res) => {
    return await handleRequest(GeneralService.getGender, req, res);
};

const getRoleFunc = async (req, res) => {
    return await handleRequest(GeneralService.getRole, req, res);
};

const getPositionFunc = async (req, res) => {
    return await handleRequest(GeneralService.getPosition, req, res);
};

const getPriceFunc = async (req, res) => {
    return await handleRequest(GeneralService.getPrice, req, res);
};

const getPaymentFunc = async (req, res) => {
    return await handleRequest(GeneralService.getPayment, req, res);
};

const getProvinceFunc = async (req, res) => {
    return await handleRequest(GeneralService.getProvince, req, res);
};

const getTimeFunc = async (req, res) => {
    return await handleRequest(GeneralService.getTime, req, res);
};

const getTotalFunc = async (req, res) => {
    try {
        let data = await GeneralService.getTotal();
        if (data) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            EM: "Error of serve!",
            EC: '-1',
            DT: ''
        });
    }
}

module.exports = {
    getRoleFunc,
    getPositionFunc,
    getGenderFunc,
    getPriceFunc,
    getProvinceFunc,
    getPaymentFunc,
    getTimeFunc,
    getTotalFunc
}