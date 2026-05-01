import { 
    IsEmail, IsNotEmpty, IsOptional, IsString, 
    IsEnum, IsStrongPassword, MaxLength, MinLength, IsPhoneNumber, 
    IsBoolean
} from 'class-validator';
import { UserRole } from '../enum/user-role.enum'; 
import { Trim } from '@/common/helpers/transforms/trim.transform';
import { ToPhoneNumber } from '@/common/helpers/transforms/to-phone-number.transform';
import { ToLowerCase } from '@/common/helpers/transforms/to-lower-case.transform';

export class CreateUserDto {
    
    // --- EMAIL ---
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @Trim() // Elimina espacios vacíos al inicio y al final
    @ToLowerCase() // Convierte el email a minúsculas
    email!: string;

    // --- PASSWORD ---
    @IsString()
    @MaxLength(50, { message: 'La contraseña es demasiado larga' }) 
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0, 
    }, {
        message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números'
    })
    password!: string;

    // --- FULL NAME ---
    @IsString()
    @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
    @MinLength(3, { message: 'El nombre es muy corto' })
    @MaxLength(100, { message: 'El nombre es demasiado largo' })
    @Trim() // Elimina espacios vacíos al inicio y al final
    fullName!: string;

    // --- PHONE ---
    @ToPhoneNumber() // Elimina espacios en blanco tanto al inicio como al final y dentro del número
    @IsOptional()
    @IsPhoneNumber('AR', { message: 'Debe ser un teléfono válido de Argentina (+54...)' })
    phone?: string;

    // --- ROLES ---
    @IsEnum(UserRole, 
        { 
            each: true, // Permite validar cada elemento del array
            message: 'El rol debe ser BARBER o ADMIN' 
        }
    )
    roles!: UserRole[];

    // --- IS ACTIVE ---
    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser un valor booleano' })
    isActive?: boolean;

}