require('dotenv').config();
import nodemailer from 'nodemailer';

let sendEmail = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_EMAIL_PASSWORD,
        },
      });
    let info = await transporter.sendMail({
    from: '"Booking.Com" <Booking.Com@gmail.com>', // sender address
    to: data.emailReceived, // list of receivers
    subject: 'Thông tin lịch khám bệnh', // Subject line
    html: getHTML(data),// html body
    });
}

const getHTML = (data) => {
  let result = ''
  if(data.lang === 'vi') {
    result = 
    `<h3>Xin chào ${data.username}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên Booking.Com.</p>
    <p>Thông tin lịch hẹn:</p>
    <div>Thời gian: <b>${data.time} ${data.date}</b></div>
    <div>Bác sỹ: <b>${data.doctorName}</b></div>
    <div>Người khám: <b>${data.patientName}</b></div>
    <div>Nhà: <b>${data.address}</b></div>
    <div>Điện thoại: <b>${data.phone}</b></div>
    <div>Lí do khám: <b>${data.reason}</b></div>
    <div>Nơi khám: <b>${data.infomation && data.infomation.Clinic && data.infomation.Clinic.name}</b></div>
    <div>Địa chỉ khám: <b>${data.infomation && data.infomation.Clinic && data.infomation.Clinic.address}</b></div>
    <div>Giá khám: <b>${data.infomation && data.infomation.Price && data.infomation.Price.valueVI}</b></div>
    <p>Nếu các thông tin trên là đúng, xin vui lòng xác nhận để hoàn tất thủ tục đặt lịch khám bệnh.</p>
    <div>Booking.Com cám ơn bạn vì đã tin tưởng chúng tôi!</div>
    <div>Nhân viên: <b>${data.infomation && data.infomation.staffData && data.infomation.staffData.fullName}</b></div>
    <a href="${data.url}" target="_blank">Xác nhận</a>   
    `
  }
  else {
    result =
    `<h3>Hello ${data.username}!</h3>
    <p>You received this email because you booked a medical appointment on Booking.Com.</p>
    <p>Appointment information:</p>
    <div>Time: <b>${data.time} ${data.date}</b></div>
    <div>Doctor: <b>${data.doctorName}</b></div>
    <div>Patient: <b>${data.patientName}</b></div>
    <div>Home: <b>${data.address}</b></div>
    <div>Phone: <b>${data.phone}</b></div>
    <div>Reason for appointment: <b>${data.reason}</b></div>
    <div>Clinic: <b>${data.infomation && data.infomation.Clinic && data.infomation.Clinic.name}</b></div>
    <div>Address: <b>${data.infomation && data.infomation.Clinic && data.infomation.Clinic.address}</b></div>
    <div>Cost: <b>${data.infomation && data.infomation.Price && data.infomation.Price.valueVI}</b></div>
    <p>If the above information is correct, please confirm to complete the medical appointment booking procedure.</p>
    <div>Booking.Com thanks you for everything!</div>
    <div>Staff: <b>${data.infomation && data.infomation.staffData && data.infomation.staffData.fullName}</b></div>
    <a href="${data.url}" target="_blank">Confirm</a>   
    `
  }
  return result
}

const sendEmailConfirm = async (data) => {
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });
  // send mail with defined transport object
  let info = await transporter.sendMail({
  from: '"Booking.Com" <Booking.Com@gmail.com>', // sender address
  to: data.emailReceived, // list of receivers
  subject: 'Thông tin kết quả khám bệnh', // Subject line
  html: confirmHTML(data),// html body
  attachments: [
    {   
      filename: 'text.png',
      content: data.file.split("base64,")[1],
      encoding: 'base64'
    },
  ]
  });
}

const sendEmailCancel = async (data) => {
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });
  // send mail with defined transport object
  let info = await transporter.sendMail({
  from: '"Booking.Com" <Booking.Com@gmail.com>', // sender address
  to: data.emailReceived, // list of receivers
  subject: 'Thông báo hủy đặt lịch hẹn', // Subject line
  html: cancelHTML(data)
  });
}

const confirmHTML = (data) => {
  let result = ''
  if(data.lang === 'vi') {
    result = 
    `<h3>Xin chào ${data.username}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên Booking.Com.</p>
    <p>Thông tin kết quả khám bệnh:</p>
    <div>Thời gian: <b>${data.time} ${data.date}</b></div>
    <div>Bác sỹ: <b>${data.doctorName}</b></div>
    <div>Kết quả khám bệnh trong file đính kèm.</div>
    <p>Cám ơn bạn vì đã khám bệnh trên Booking.Com.</p>
    `
  }
  else {
    result =
    `<h3>Hello ${data.username}!</h3>
    <p>You received this email because you booked a medical appointment on Booking.Com.</p>
    <p>Medical information:</p>
    <div>Time: <b>${data.time} ${data.date}</b></div>
    <div>Doctor: <b>${data.doctorName}</b></div>
    <div>Medical examination results in the attached file.</div>
    <p>Thank you for checking out Booking.com.</p> 
    `
  }
  return result
}

const cancelHTML = (data) => {
  let result = ''
  if(data.lang === 'vi') {
    result = 
    `<h3>Xin chào ${data.username}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên Booking.Com.</p>
    <p>Thông báo hủy đặt lịch:</p>
    <div>Thời gian: <b>${data.time} ${data.date}</b></div>
    <div>Bác sỹ: <b>${data.doctorName}</b></div>
    <div>Lí do hủy: <b>${data.cancel}</b></div>
    <div>Chúng tôi rất lấy làm tiếc khi lịch hẹn đã bị hủy bỏ.</div>
    <p>Booking.Com chúc bạn mạnh khỏe bình an!</p>
    `
  }
  else {
    result =
    `<h3>Hello ${data.username}!</h3>
    <p>You received this email because you booked a medical appointment on Booking.Com.</p>
    <p>Cancel appointment:</p>
    <div>Time: <b>${data.time} ${data.date}</b></div>
    <div>Doctor: <b>${data.doctorName}</b></div>
    <div>Cancel: <b>${data.cancel}</b></div>
    <div>We are very sorry that the appointment has been cancelled.</div>
    <p>Booking.Com wishes you health and peace!</p> 
    `
  }
  return result
}
 
module.exports = {
    sendEmail,
    sendEmailConfirm,
    sendEmailCancel
}