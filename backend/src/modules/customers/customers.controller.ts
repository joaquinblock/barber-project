import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('register')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    // Aquí el ValidationPipe ya chequeó todo
    return {
    message: "¡Éxito! Esto crea un Customer con rol CLIENT y lo mete en la tabla 'customers'",
    data: createCustomerDto, // Aquí ves el JSON final
    timestamp: new Date().toISOString() // Opcional: para saber cuándo se procesó
  };
  }

}
