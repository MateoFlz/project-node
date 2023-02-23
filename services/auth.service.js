const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const UserService = require('./user.service');
const { config } = require('../config/config');

const service = new UserService();

class AuthService {

  async getUser(email, password) {

    const user = await service.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw boom.unauthorized();
    }

    delete user.dataValues.password;

    return user;
  }

  singToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    }

    const token = jwt.sign(payload, config.secret);

    return {
      user,
      token
    }
  }


  async sendRecovery(email) {

    const user = await service.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }

    const payload = {
      sub: user.id
    }

    const token = jwt.sign(payload, config.secret, { expiresIn: '15min'});
    const link  = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: config.emailUser, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Email para restablecer contraseña", // Subject line
      html: `<b>Ingresa a este link: ${link}</b>`, // html body
    }

    const rta = await this.sendMail(mail);
    return rta;
  }


  async changePassword(token, newPassword) {

    try {

      const payload = jwt.verify(token, config.secret);
      const user = await service.findOne(payload.sub);

      if (user.recoveryToken !== token){
        throw boom.unauthorized();
      }

      const hash = await bcrypt.hash(newPassword, 10);

      await service.update(user.id, { recoveryToken: null, password: hash });

      return { message: 'Password change'};

    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.emailUser,
        pass: config.passwordEmail
      },
    });

    await transporter.sendMail(infoMail);

    return { message: 'Mail sended' }
  }
}

module.exports = AuthService;
