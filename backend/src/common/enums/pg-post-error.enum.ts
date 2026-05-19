export enum PgPostError {
  UNIQUE_VIOLATION = '23505', // intentar insertar un valor duplicado en una columna con restricción UNIQUE.
  FOREIGN_KEY_VIOLATION = '23503', // intentar insertar un valor que no existe en la tabla referenciada.
  NOT_NULL_VIOLATION = '23502', // intentar insertar un valor nulo en una columna que no permite nulos.
  CHECK_VIOLATION = '23514', // intentar insertar un valor que no cumple con una condición definida.
  EXCLUSION_VIOLATION = '23P01', // intentar insertar un valor que entra en conflicto con una restricción de exclusión.
  INVALID_TEXT_REPRESENTATION = '22P02', // intentar convertir un valor de texto a un tipo de dato incompatible.
  STRING_DATA_RIGHT_TRUNCATION = '22001', // intentar insertar un valor que excede la longitud máxima de la columna.
  NUMERIC_VALUE_OUT_OF_RANGE = '22003', // intentar insertar un valor que excede el rango permitido para el tipo de dato.
  INVALID_DATETIME_FORMAT = '22007', // intentar insertar un valor que no cumple con el formato esperado.
  DATETIME_FIELD_OVERFLOW = '22008', // intentar insertar un valor que excede los límites del tipo de dato.
  DEADLOCK_DETECTED = '40P01', 
  SERIALIZATION_FAILURE = '40001',  //Si dos personas intentan sacar el mismo turno al mismo tiempo, el sistema detecta que se ha producido un conflicto de concurrencia y lanza esta excepción para indicar que la transacción no se pudo completar debido a un problema de serialización.
}

/*
  Deadlock: ocurre cuando por ejemplo A quiere sacar un turno y bloquea la tabla de turnos para escribir pero necesita leer Professionalo para confirmar,
  mientras que B quiere sacar un turno y bloquea la tabla de Professionalo para escribir pero necesita leer Turnos para confirmar, entonces ambos procesos 
  quedan bloqueados esperando el uno al otro, lo que se conoce como un deadlock. 
  Cuando PostgreSQL detecta esta situación, lanza la excepción DEADLOCK_DETECTED para indicar que se ha producido un conflicto de concurrencia 
  y que una de las transacciones debe ser abortada para resolver el bloqueo. 
*/