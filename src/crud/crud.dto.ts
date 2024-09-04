import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Wick' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Ninja Warrior' })
  @IsString()
  position: string;

  @ApiProperty({ example: '(999) 0809 8 9999' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'john.wick@ninja.war' })
  @IsEmail()
  email: string;
}

export class UpdateUserByIdDto {
  @ApiProperty({ example: 'Nobisuke' })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Nobita' })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'Ninja Warrior' })
  @IsString()
  @IsOptional()
  position: string;

  @ApiProperty({ example: '(999) 0809 8 9999' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'john.wick@ninja.war' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '0191b940-4d4d-7af6-94a0-f4bd6652412f' })
  @IsString()
  id: string;
}
