import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

//Работа с почтой
class MailService {
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

  constructor() {
    const configOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    }

    this.transporter = nodemailer.createTransport(configOptions)
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html: `
        <div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    })
  }
}

module.exports = new MailService()
