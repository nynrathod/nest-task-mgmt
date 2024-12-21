import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserResponseDto } from '../../auth/dto/user.dto';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  assignee?: UserResponseDto;

  @IsOptional()
  @IsDateString()
  reminder?: Date;
}
