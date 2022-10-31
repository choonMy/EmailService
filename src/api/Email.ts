import { Router } from 'express'
import { success } from '../utils/apiResponse'
import validationMiddleware from '../middlewares/validation'
import { SendEmailDto } from '../dtos/send-email.dto'
import EmailService from '../services/EmailService'

const emailService = new EmailService();
const router = Router()


router.post('/send', validationMiddleware(SendEmailDto, 'body'), async (req, res, next) => {

    if (emailService.send(req.body)) {
        res.json(success('OK', {}, 200))
    } else {
        throw new Error("failed to send email")
    }
})


export = router