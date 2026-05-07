import {
	BadRequestException,
	ConflictException,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { PgPostError } from '@/common/enums/pg-post-error.enum';
import { QueryFailedError } from 'typeorm';
import { ErrorCode } from '@barber/shared/errors';

type PostgresDriverError = {
	code?: string;
	constraint?: string;
	detail?: string;
	message?: string;
};

const logger = new Logger('DatabaseError'); // Logger es una clase de NestJS que se utiliza para registrar mensajes de log en la consola o en archivos. En este caso, se crea una instancia del logger con el contexto 'DatabaseError', lo que ayuda a identificar que los mensajes de log provienen de esta parte del código.

const getErrorDetail = (driverError: PostgresDriverError): string => {
	return driverError.detail || driverError.constraint || driverError.message || 'Sin detalle';
};

export const handleDbExceptions = (
	error: unknown,
	entityName = 'registro',
): never => { //never indica que esta función no retorna nada, es decir, siempre lanza una excepción
	if (error instanceof QueryFailedError) { //QueryFailedError es una clase de TypeORM que se lanza cuando ocurre un error en una consulta a la base de datos. Al verificar si el error es una instancia de QueryFailedError, podemos asegurarnos de que estamos manejando errores específicos relacionados con la base de datos.
		const driverError = error.driverError as PostgresDriverError; //driverError es una propiedad de QueryFailedError que contiene información detallada sobre el error que ocurrió en la base de datos. Al hacer un cast a PostgresDriverError, estamos indicando que esperamos que el error tenga la estructura definida en esa interfaz, lo que nos permite acceder a propiedades como code, constraint, detail y message.
		const detail = getErrorDetail(driverError);

		logger.error(`[${entityName}] ${driverError.code || 'UNKNOWN'}: ${detail}`);

		switch (driverError.code) {
			case PgPostError.UNIQUE_VIOLATION:
				throw new ConflictException({
					code: ErrorCode.DB_UNIQUE_VIOLATION,
					message: `Ya existe un ${entityName} con esos datos`,
				}); //Codigo 409, el dato es valido pero ya existe en la base de datos, por lo que no se puede crear un nuevo registro con esos mismos datos.

			case PgPostError.CHECK_VIOLATION:
			case PgPostError.EXCLUSION_VIOLATION:
				throw new ConflictException({
					code: ErrorCode.DB_VALIDATION_ERROR,
					message: `Los datos enviados para ${entityName} no cumplen las reglas de negocio`,
				});

			case PgPostError.FOREIGN_KEY_VIOLATION:
				throw new BadRequestException({
					code: ErrorCode.DB_FOREIGN_KEY_VIOLATION,
					message: `Uno de los recursos relacionados para ${entityName} no existe`,
				});

			case PgPostError.NOT_NULL_VIOLATION:
				throw new BadRequestException({
					code: ErrorCode.DB_VALIDATION_ERROR,
					message: `Faltan campos obligatorios para crear el ${entityName}`,
				});

			case PgPostError.INVALID_TEXT_REPRESENTATION:
			case PgPostError.INVALID_DATETIME_FORMAT:
			case PgPostError.DATETIME_FIELD_OVERFLOW:
			case PgPostError.STRING_DATA_RIGHT_TRUNCATION:
			case PgPostError.NUMERIC_VALUE_OUT_OF_RANGE:
				throw new BadRequestException({
					code: ErrorCode.DB_VALIDATION_ERROR,
					message: `Uno de los valores enviados para ${entityName} tiene un formato invalido`,
				});

			case PgPostError.DEADLOCK_DETECTED:
			case PgPostError.SERIALIZATION_FAILURE:
				throw new ConflictException({
					code: ErrorCode.DB_TIMEOUT,
					message: `El servidor está experimentando una alta carga, por favor intenta nuevamente`,
				});
		}
	}

	logger.error(error);
	throw new InternalServerErrorException({
		code: ErrorCode.DB_UNKNOWN_ERROR,
		message: `Ocurrio un error inesperado al guardar ${entityName}`,
	});
};