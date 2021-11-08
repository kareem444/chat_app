import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    Matches,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @Matches(RegExp('^[a-z A-Z0-9]*$'), {
        message: 'this field should have alpha or number',
    })
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(8)
    password: string;
}
