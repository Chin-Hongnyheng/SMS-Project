import { IsString, IsEmail, IsEnum, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHERS = 'Others',
}

export enum Status {
  SINGLE = 'Single',
  MARRIED = 'Married',
  RELATIONSHIP = 'Relationship',
}

class FileUpload {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateUserInfoDto {
  // English Name
  @IsString() @IsNotEmpty() firstNameEn: string;
  @IsString() @IsNotEmpty() lastNameEn: string;

  // Khmer Name
  @IsString() @IsNotEmpty() firstNameKh: string;
  @IsString() @IsNotEmpty() lastNameKh: string;

  // Status & Gender
  @IsEnum(Status) @IsNotEmpty() status: Status;
  @IsEnum(Gender) @IsNotEmpty() gender: Gender;

  // Race & Nationality
  @IsString() @IsNotEmpty() race: string;
  @IsString() @IsNotEmpty() nationality: string;

  // Date of Birth
  @IsString() @IsNotEmpty() dob: string;

  // Email
  @IsEmail() @IsNotEmpty() email: string;

  // Place of Birth
  @IsString() @IsNotEmpty() village: string;
  @IsString() @IsNotEmpty() commune: string;
  @IsString() @IsNotEmpty() district: string;
  @IsString() @IsNotEmpty() province: string;

  // Current Address
  @IsString() @IsNotEmpty() address: string;

  // Course selection
  @IsNotEmpty() courseId: number;

  // User ID from auth-service
  @IsNotEmpty() userId: number;

  // Uploaded files
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileUpload)
  files: FileUpload[];
}
