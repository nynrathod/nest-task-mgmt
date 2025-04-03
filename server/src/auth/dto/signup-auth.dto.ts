import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class SignupAuthDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
