import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import turso from 'src/turso';
import { v7 as uuidv7 } from 'uuid';
import { CreateUserDto, UpdateUserByIdDto } from './crud.dto';

interface User {
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
  created_at?: number;
  updated_at?: number;
  id?: string;
}

type QueryField = 'firstName' | 'lastName' | 'position' | 'phone' | 'email';

@ApiTags('CRUD')
@Controller('crud')
export class CrudController {
  @Get()
  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiQuery({ name: 'sort', required: false, description: 'Sort by field' })
  async getList(@Query('sort') sort?: QueryField): Promise<User[]> {
    let sql = 'SELECT * FROM users';
    if (sort) {
      sql += ` ORDER BY ${sort} ASC`;
    }
    const users = await turso.execute(sql);
    const data: User[] = [];
    users.rows.map((user: any) =>
      data.push({
        id: user.id as string,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        position: user.position as string,
        phone: user.phone as string,
        email: user.email as string,
      }),
    );

    return data;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    // email validation
    const email_validation = await turso.execute({
      sql: 'select * from users where email = $email',
      args: { email: createUserDto.email },
    });
    if (email_validation.rows.length > 0) {
      return new HttpException('Email already exists', 400);
    }

    const payload = {
      id: uuidv7(),
      ...createUserDto,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    await turso.execute({
      sql: 'insert into users (id, firstName, lastName, position, email, phone, created_at, updated_at) values ($id, $firstName, $lastName, $position, $email, $phone, $created_at, $updated_at)',
      args: { ...payload },
    });

    return {
      message: 'User created successfully',
    };
  }

  @Put()
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiBody({ type: UpdateUserByIdDto })
  async update(
    @Body() updateUserDto: UpdateUserByIdDto,
  ): Promise<{ message: string }> {
    const email_validation = await turso.execute({
      sql: 'select * from users where email = $email',
      args: { email: updateUserDto.email },
    });
    if (email_validation.rows.length > 0) {
      return new HttpException('Email already exists', 400);
    }

    const payload = {
      ...updateUserDto,
      updated_at: Date.now(),
    };

    const fields = ['updated_at'];
    Object.keys(updateUserDto).map((key) => {
      if (key !== 'id') {
        fields.push(key);
      }
    });

    let sqlCombination = '';
    fields.map(
      (field, index) =>
        (sqlCombination += `${field} = $${field}${index + 1 !== fields.length ? ', ' : ''}`),
    );

    const sql = `update users set ${sqlCombination} where id = $id`;

    await turso.execute({
      sql,
      args: { ...payload },
    });

    // console.log('field:', sql, payload);

    return {
      message: 'User updated successfully',
    };
  }
}
