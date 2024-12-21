import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserResponseDto } from '../../auth/dto/user.dto';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  assignee: UserResponseDto;

  @IsOptional()
  @IsDateString()
  reminder?: Date;

  @IsOptional()
  tempId?: string;
}
