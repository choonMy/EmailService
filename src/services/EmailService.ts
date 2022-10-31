import nodemailer, { SendMailOptions } from "nodemailer";
import { SendEmailDto } from "src/dtos/send-email.dto";
import config from '../config'

export default class EmailService {
    private transporter: nodemailer.Transporter

    constructor() {
        this.initTransport();
    }

    private async initTransport() {
        this.transporter = nodemailer.createTransport({
            host: config.emails.host,
            port: Number(config.emails.smtpPort),
            secure: config.emails.secure == '1' ? true : false,
            requireTLS: true,
            auth: {
                user: config.emails.username,
                pass: config.emails.password,
            },
            logger: true
        });

    }



    public async send(emailInfo: SendEmailDto) {
        try {

            let mail: SendMailOptions = {
                from: config.emails.from,
                to: emailInfo.recipient,
                subject: emailInfo.subject,
                html: emailInfo.emailBody,
            }


            await this.transporter.sendMail(mail);
            return true;

        } catch (e) {
            return false;
        }

    }


}