import db from '../models/index';
import bcrypt from 'bcryptjs';
import {Op} from 'sequelize';
require('dotenv').config();
import EmailService from './EmailService';

const getBookingManage = async (id,Date,page,limit) => {
    try {
        let offset = (page - 1) * limit
        let data = {}
        let user = await db.User.findOne({
            where: {
                id: id
            }
        })
        if(!user) {
            return {
                EM: 'User not exist!',
                EC: 1,
                DT: ''
            }
        }
        let totalPages, result 
        switch(user.roleId) {
            case 1:
                result = await db.Booking.findAndCountAll({
                            include: [
                                {model: db.Time, attributes: ['timeType']},
                                {model: db.Status, attributes: ['valueEN','valueVI']},
                                {model: db.Gender, attributes: ['valueEN','valueVI']},
                                {model: db.User, as:"patientData" ,attributes: ['fullname','phone','email','address']},
                                {model: db.User, as:"doctorDataBooking" ,attributes: ['fullname']},
                            ],
                            where: {
                                date: Date
                            },  
                            offset: offset,
                            limit: limit,
                            order: [['statusId', 'ASC']]
                        })
                break;
            case 2:
                result = await db.Booking.findAndCountAll({
                    include: [
                        {model: db.Time, attributes: ['timeType']},
                        {model: db.Status, attributes: ['valueEN','valueVI']},
                        {model: db.Gender, attributes: ['valueEN','valueVI']},
                        {model: db.User, as:"patientData" ,attributes: ['fullname','phone','email','address']},
                        {model: db.User, as:"doctorDataBooking" ,attributes: ['fullname']},
                    ],
                    where: {
                        date: Date,
                        doctorId: id,
                        statusId: { [Op.ne]: 1 }
                    },  
                    offset: offset,
                    limit: limit,
                    order: [['statusId', 'ASC']]
                })
                break;  
        case 3:
            result = await db.Booking.findAndCountAll({
                include: [
                    {model: db.Time, attributes: ['timeType']},
                    {model: db.Status, attributes: ['valueEN','valueVI']},
                    {model: db.Gender, attributes: ['valueEN','valueVI']},
                    {model: db.User, as:"patientData" ,attributes: ['fullname','phone','email','address']},
                    {model: db.User, as:"doctorDataBooking" ,attributes: ['fullname']},
                ],
                where: {
                    date: Date,
                    staffId: id
                },  
                offset: offset,
                limit: limit,
                order: [['statusId', 'ASC']]
            })
            break;              
            default:
                result = ''
                break;
        }
        totalPages = Math.ceil(result.count/limit);
        data = {
            totalRows: result.count,
            totalPages: totalPages,
            data: result.rows
        }
        return {
            EM:"Get successfully!",
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

const completedBookingManage = async (rawData) => {
    try {
        let data = await db.Booking.findOne({
            where: {
                id: rawData.id,
                statusId: 2
            }
        })
        if(!data) {
            return {
                EM1: 'Booking not exists!',
                EM2: 'Lịch hẹn không tồn tại!',
                EC: -1,
                DT: []
            }  
        }
        data.statusId = 3
        await data.save()

        await EmailService.sendEmailConfirm({
            emailReceived: rawData.email,
            doctorName: rawData.doctor,
            username: rawData.username,
            date: rawData.date,
            time: rawData.timeData,
            lang: rawData.LangType,
            file: rawData.file
        })

        return {
            EM1: 'Completed successfully!',
            EM2: 'Lịch hẹn hoàn tất!',
            EC: 0,
            DT: []
        } 
    }
    catch(err) {
        console.log(err)
        return {
            EM1: 'Something wrong',
            EM2: 'Đã có lỗi xảy ra',
            EC: -1,
            DT: ''
        }
    }
}

const getHistoryBooking = async (patientId,page,limit) => {
    try {
        let offset = (page - 1) * limit
        const {count, rows} = await db.Booking.findAndCountAll({
            where: {
                patientId: patientId,
            },
            include: [
                {model: db.Time, attributes: ['timeType']},
                {model: db.Status, attributes: ['valueEN','valueVI']},
                {model: db.User, as:"doctorDataBooking" ,attributes: ['fullname']},
                {model: db.User, as:"patientData" ,attributes: ['fullname','email','phone','address']},
                {model: db.Gender, attributes: ['valueEN','valueVI']},
            ],
            order: [
                ['id','DESC']
            ],
            offset: offset,
            limit: limit,
        })
        let totalPages = Math.ceil(count/limit);
        let data = {
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
        console.log(err)
        return {
            EM: 'Something wrong',
            EC: -1,
            DT: ''
        }
    }
}

const cancelBookingManage = async (rawData) => {
    try {
        let data = await db.Booking.findOne({
            where: {
                id: rawData.id,
                statusId: 2
            }
        })
        if(!data) {
            return {
                EM1: 'Booking not exists!',
                EM2: 'Lịch hẹn không tồn tại!',
                EC: -1,
                DT: []
            }  
        }

        data.statusId = 4
        data.cancel = 'Bệnh nhân không đến khám!'
        await data.save()

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
            doctorName: rawData.doctorDataBooking.fullname,
            username: rawData.patientData.fullname,
            patientName: rawData.patientName,
            cancel: data.cancel,
            date: rawData.date,
            time: rawData.timeData,
            lang: rawData.LangType,
        })

        return {
            EM1: 'Cancel successfully!',
            EM2: 'Hủy thành công!',
            EC: 0,
            DT: []
        } 

    }
    catch(err) {
        console.log(err)
        return {
            EM1: 'Something wrong',
            EM2: 'Có vấn đề xảy ra!',
            EC: -1,
            DT: ''
        }
    }
}

const filterBookingManage = async (UserId,type,date,page,limit) => {
    try {
        let user = await db.User.findOne({
            where: {
                id: UserId
            }
        })
        if(!user) {
            return {
                EM: 'User not exist!',
                EC: 1,
                DT: ''
            }
        }
        let offset = (page - 1) * limit
        let totalPages, result 
        switch(user.roleId) {
            case 1:
                result = await db.Booking.findAndCountAll({
                    include: [
                        {model: db.Time, attributes: ['timeType']},
                        {model: db.Status, attributes: ['valueEN','valueVI']},
                        { model: db.User, as:"patientData" ,attributes: ['fullname','phone','email']},
                        { model: db.User, as:"doctorDataBooking" ,attributes: ['fullname'],
                            include: [
                                {model: db.Doctor_Infor, include: [
                                    {model: db.Speciality, attributes: ['name']}
                                ]}
                            ]
                        },
                    ],
                    offset: offset,
                    limit: limit,
                    where: {
                        statusId: +type,
                        date: date    
                    },
                    order: [['statusId', 'ASC']]
                })
                break;
            case 2:
                result = await db.Booking.findAndCountAll({
                    include: [
                        {model: db.Time, attributes: ['timeType']},
                        {model: db.Status, attributes: ['valueEN','valueVI']},
                        { model: db.User, as:"patientData" ,attributes: ['fullname','phone','email']},
                        { model: db.User, as:"doctorDataBooking" ,attributes: ['fullname'],
                            include: [
                                {model: db.Doctor_Infor, include: [
                                    {model: db.Speciality, attributes: ['name']}
                                ]}
                            ]
                        },
                    ],
                    offset: offset,
                    limit: limit,
                    where: {
                        statusId: +type,
                        date: date,
                        doctorId: UserId    
                    },
                    order: [['statusId', 'ASC']]
                })
                break; 
            case 3:
                result = await db.Booking.findAndCountAll({
                    include: [
                        {model: db.Time, attributes: ['timeType']},
                        {model: db.Status, attributes: ['valueEN','valueVI']},
                        { model: db.User, as:"patientData" ,attributes: ['fullname','phone','email']},
                        { model: db.User, as:"doctorDataBooking" ,attributes: ['fullname'],
                            include: [
                                {model: db.Doctor_Infor, include: [
                                    {model: db.Speciality, attributes: ['name']}
                                ]}
                            ]
                        },
                    ],
                    offset: offset,
                    limit: limit,
                    where: {
                        statusId: +type,
                        date: date,
                        staffId: UserId    
                    },
                    order: [['statusId', 'ASC']]
                })
                break;  
            case 4:
                result = ''
                break;                              
        }
        totalPages = Math.ceil(result.count/limit);
        let data = {
            totalRows: result.count,
            totalPages: totalPages,
            data: result.rows
        }
        return {
            EM:"Filter successfully!",
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

const getTotal = async (userID,currentDate) => {
    try {
        let user = await db.User.findOne({
            where: {
                id: userID
            }
        })
        if(user) {
            if(user.roleId === 1) {
            let countBook = await db.Booking.count(),
                countNew = await db.Booking.count({
                    where: {
                        statusId: 1,
                        date: currentDate
                    },
                }),
                BestDoc = await db.Booking.findOne({
                    attributes: [
                        'doctorId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                        ],
                        include: [
                        { model: db.User, as:"doctorDataBooking" ,attributes: ['fullname','image'],
                            include: [
                            {model: db.Position, attributes: ['valueEN','valueVI']},
                            {model: db.Doctor_Infor, attributes: ['doctorId'],
                                include: [
                                    {model: db.Speciality, attributes: ['name']}
                                ]
                            }
                            ]  
                        },
                        ],
                        where: {
                        date: currentDate,
                        statusId: 3
                        }, 
                        group: ['doctorId'],
                        order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                        limit: 1,                    
                }),
                BestSpe = await db.Booking.findOne({
                    attributes: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'SpeCount'],
                    ],
                    include: [
                        {
                        model: db.User,
                        as: "doctorDataBooking",
                        attributes: ['fullname'],
                        include: [
                            {model: db.Doctor_Infor, 
                                attributes: ['specialityId'],
                                include: [
                                    {model: db.Speciality, attributes: ['name','image']}
                                ]
                            }
                        ],
                        }
                    ],
                    where: {
                        date: currentDate,
                        statusId: 3
                    },
                    group: [db.sequelize.col('doctorDataBooking.Doctor_Infor.Speciality.id')],
                    order: [[db.sequelize.literal('SpeCount'), 'DESC']],
                    limit: 1
                }),
                BestCli = await db.Booking.findOne({
                    attributes: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'CliCount'],
                    ],
                    include: [
                        {
                        model: db.User,
                        as: "doctorDataBooking",
                        attributes: ['fullname'],
                        include: [
                            {model: db.Doctor_Infor, 
                                attributes: ['clinicId'],
                                include: [
                                    {model: db.Clinic, attributes: ['name','image']}
                                ]
                            }
                        ],
                        }
                    ],
                    where: {
                        date: currentDate,
                        statusId: 3,
                    },
                    group: [db.sequelize.col('doctorDataBooking.Doctor_Infor.Clinic.id')],
                    order: [[db.sequelize.literal('CliCount'), 'DESC']],
                    limit: 1
                }), 
                MostSpe = await db.Booking.findOne({
                    attributes: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'SpeCount'],
                    ],
                    include: [
                        {
                        model: db.User,
                        as: "doctorDataBooking",
                        attributes: ['fullname'],
                        include: [
                            {model: db.Doctor_Infor, 
                                attributes: ['specialityId'],
                                include: [
                                    {model: db.Speciality, attributes: ['name','image']}
                                ]
                            }
                        ],
                        }
                    ],
                    group: [db.sequelize.col('doctorDataBooking.Doctor_Infor.Speciality.id')],
                    order: [[db.sequelize.literal('SpeCount'), 'DESC']],
                    limit: 1
                }),
                MostCli = await db.Booking.findOne({
                    attributes: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'CliCount'],
                    ],
                    include: [
                        {
                        model: db.User,
                        as: "doctorDataBooking",
                        attributes: ['fullname'],
                        include: [
                            {model: db.Doctor_Infor, 
                                attributes: ['clinicId'],
                                include: [
                                    {model: db.Clinic, attributes: ['name','image']}
                                ]
                            }
                        ],
                        }
                    ],
                    where: {
                        statusId: 3
                    },
                    group: [db.sequelize.col('doctorDataBooking.Doctor_Infor.Clinic.id')],
                    order: [[db.sequelize.literal('CliCount'), 'DESC']],
                    limit: 1
                }), 
                BestPat = await db.Booking.findOne({
                    attributes: [
                        'patientId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                        ],
                        include: [
                        { model: db.User, as:"patientData" ,attributes: ['fullname','image']},
                        ],
                    where: {
                        date: currentDate,
                        statusId: 3
                    },  
                        group: ['patientId'],
                        order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                        limit: 1,                    
                }),     
                countConfirm = await db.Booking.count({
                    where: {
                        statusId: 2,
                        date: currentDate
                    }
                }),
                countDone = await db.Booking.count({
                where: {
                    statusId: 3,
                    date: currentDate
                }
                }),
                countCancel = await db.Booking.count({
                where: {
                    statusId: 4,
                    date: currentDate
                }
                }),
                MostDoc = await db.Booking.findOne({
                    attributes: [
                        'doctorId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                      ],
                      include: [
                        { model: db.User, as:"doctorDataBooking" ,attributes: ['fullname','image'],
                          include: [
                            {model: db.Position, attributes: ['valueEN','valueVI']},
                            {model: db.Doctor_Infor, attributes: ['doctorId'],
                                include: [
                                    {model: db.Speciality, attributes: ['name']}
                                ]
                            }
                          ]  
                        },
                        ],
                      where: {statusId: 3},  
                      group: ['doctorId'],
                      order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                      limit: 1,                    
                }),
                MostPat = await db.Booking.findOne({
                    attributes: [
                        'patientId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                      ],
                      include: [
                        { model: db.User, as:"patientData" ,attributes: ['fullname','image']},
                        ], 
                      where:{statusId: 3},  
                      group: ['patientId'],
                      order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                      limit: 1,                    
                }), 
                data = {
                    totalBook: countBook,
                    totalNew: countNew,
                    totalConfirm: countConfirm,
                    totalDone: countDone,
                    totalCancel: countCancel,
                    bestDoc: BestDoc,
                    bestSpe: BestSpe,
                    bestCli: BestCli,
                    bestPat: BestPat,
                    mostDoc: MostDoc,
                    mostPat: MostPat,
                    mostCli: MostCli,
                    mostSpe: MostSpe
                };
                return {
                    EM: 'Get total successfully!',
                    EC: 0,
                    DT: data
                };
            }
            if(user.roleId === 2) {
                let countNew = await db.Booking.count({
                    where: {
                        statusId: 2,
                        doctorId: user.id,
                        date: currentDate
                    }
                }),
                    countDone = await db.Booking.count({
                    where: {
                        statusId: 3,
                        doctorId: user.id,
                        date: currentDate
                    }
                }),
                    countCancel = await db.Booking.count({
                    where: {
                        statusId: 4,
                        doctorId: user.id,
                        date: currentDate
                    }
                }),
                MostPat = await db.Booking.findOne({
                    attributes: [
                        'patientId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                      ],
                      include: [
                        { model: db.User, as:"patientData" ,attributes: ['fullname','image']},
                        ],
                      where: {
                        doctorId: user.id,
                      }, 
                      where: {statusId: 3, doctorId: user.id},
                      group: ['patientId'],
                      order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                      limit: 1,                    
                }), 
                
                data = {
                    totalNew: countNew,
                    totalDone: countDone,
                    totalCancel: countCancel,
                    mostPat: MostPat
                };
                return {
                    EM: 'Get total successfully!',
                    EC: 0,
                    DT: data
                };
            }
            if(user.roleId === 3) {
                let countNew = await db.Booking.count({
                    where: {
                        statusId: 1,
                        staffId: user.id,
                        date: currentDate
                    }
                }),
                    countConfirm = await db.Booking.count({
                    where: {
                        statusId: 2,
                        staffId: user.id,
                        date: currentDate
                    }
                }),
                    countDone = await db.Booking.count({
                    where: {
                        statusId: 3,
                        staffId: user.id,
                        date: currentDate
                    }
                }),
                    countCancel = await db.Booking.count({
                    where: {
                        statusId: 4,
                        staffId: user.id,
                        date: currentDate
                    }
                }),
                BestDoc = await db.Booking.findOne({
                    attributes: [
                        'doctorId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                      ],
                      include: [
                        { model: db.User, as:"doctorDataBooking" ,attributes: ['fullname','image'],
                          include: [
                            {model: db.Position, attributes: ['valueEN','valueVI']},
                            {model: db.Doctor_Infor, attributes: ['doctorId'],
                                include: [
                                    {model: db.Speciality, attributes: ['name']}
                                ]
                            }
                          ]  
                        },
                        ],
                      where: {
                        date: currentDate,
                        staffId: user.id,
                        statusId: 3
                      }, 
                      group: ['doctorId'],
                      order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                      limit: 1,                    
                }),
                BestPat = await db.Booking.findOne({
                    attributes: [
                        'patientId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                      ],
                      include: [
                        { model: db.User, as:"patientData" ,attributes: ['fullname','image']},
                        ],
                      where: {
                        staffId: user.id,
                        date: currentDate,
                        statusId: 3
                      }, 
                      group: ['patientId'],
                      order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                      limit: 1,                    
                }), 
                MostDoc = await db.Booking.findOne({
                    attributes: [
                        'doctorId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                      ],
                      include: [
                        { model: db.User, as:"doctorDataBooking" ,attributes: ['fullname','image'],
                          include: [
                            {model: db.Position, attributes: ['valueEN','valueVI']},
                            {model: db.Doctor_Infor, attributes: ['doctorId'],
                                include: [
                                    {model: db.Speciality, attributes: ['name']}
                                ]
                            }
                          ]  
                        },
                        ],
                      where: {
                        staffId: user.id,
                        statusId: 3
                      }, 
                      group: ['doctorId'],
                      order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                      limit: 1,                    
                }),
                MostPat = await db.Booking.findOne({
                    attributes: [
                        'patientId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Max_Booking'],
                      ],
                      include: [
                        { model: db.User, as:"patientData" ,attributes: ['fullname','image']},
                        ],
                      where: {
                        staffId: user.id,
                      }, 
                      where: {
                        statusId: 3
                      },
                      group: ['patientId'],
                      order: [[db.sequelize.literal('Max_Booking'), 'DESC']],
                      limit: 1,                    
                }), 
                data = {
                    totalNew: countNew,
                    totalConfirm: countConfirm,
                    totalDone: countDone,
                    totalCancel: countCancel,
                    bestDoc: BestDoc,
                    bestPat: BestPat,
                    mostDoc: MostDoc,
                    mostPat: MostPat
                };
                return {
                    EM: 'Get total successfully!',
                    EC: 0,
                    DT: data
                };
            }
        }
        
        return {
            EM: 'User is not exist or not permission!',
            EC: 0,
            DT: []
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

const getTotalByDate = async (userID,date) => {
    try {
        let user = await db.User.findOne({
            where: {
                id: userID
            }
        })
        if(!user) {
            return {
                EM: 'User not exists!',
                EC: 1,
                DT: ''
            }
        }
        let TotalByDay = 0
        switch(user.roleId) {
            case 1: 
                TotalByDay = await db.Booking.count({
                    where: {
                        date: date,
                        statusId: 3
                    }
                })
                break;
            case 2:
                TotalByDay = await db.Booking.count({
                    where: {
                        date: date,
                        doctorId: user.id,
                        statusId: 3
                    }
                })
                break;   
            case 3:
                TotalByDay = await db.Booking.count({
                    where: {
                        date: date,
                        staffId: user.id,
                        statusId: 3
                    }
                })
                break;  
            default:
                break;    
        }
        let data = {
            totalByDay: TotalByDay,
            date: date
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

const getScheduleByDate = async (userID,Date) => {
    try {
        let user = await db.User.findOne({
            where: {
                id: userID
            }
        })
        if(!user) {
            return {
                EM: 'User not exists!',
                EC: 1,
                DT: ''
            }
        }
        let data = ''
        switch(user.roleId) {
            case 1:
                data = await db.Booking.findAll({
                    attributes: [
                        'timeId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Book'],
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Dat']
                    ],
                    include: [
                        {model: db.Time, attributes: ['timeType']}
                    ],
                    group: ['timeId'],
                    where: {
                        date: Date,
                        statusId: 3
                    }
                });
                break;
            case 2:
                data = await db.Booking.findAll({
                    attributes: [
                        'timeId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Book'],
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Dat']
                    ],
                    include: [
                        {model: db.Time, attributes: ['timeType']}
                    ],
                    group: ['timeId'],
                    where: {
                        date: Date,
                        doctorId: user.id,
                        statusId: 3
                    }
                });
                break;  
            case 3:
                data = await db.Booking.findAll({
                    attributes: [
                        'timeId',
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Book'],
                        [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'Dat']
                    ],
                    include: [
                        {model: db.Time, attributes: ['timeType']}
                    ],
                    group: ['timeId'],
                    where: {
                        date: Date,
                        staffId: user.id,
                        statusId: 3
                    }
                });
                break;  
            default:
                break;             
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

module.exports = {
    getBookingManage,
    filterBookingManage,
    completedBookingManage,
    cancelBookingManage,
    getHistoryBooking,
    getTotal,
    getTotalByDate,
    getScheduleByDate
}