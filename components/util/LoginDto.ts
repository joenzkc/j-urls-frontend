import { IsDefined, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
  @IsDefined()
  @IsString()
  public username: string;

  @IsDefined()
  @IsNotEmpty()
  @Length(8, 20)
  @IsString()
  public password: string;
}
