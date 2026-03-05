import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'])
  status: string;
}
