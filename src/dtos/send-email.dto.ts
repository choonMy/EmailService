import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
    @IsString()
    public recipient: string;

    public subject: string;

    public emailBody: string;

}