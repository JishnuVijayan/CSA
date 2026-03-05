import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsObject()
  @IsNotEmpty()
  formData: any;
}
