import { IsDefined, IsUrl } from "class-validator";

export class ValidUrlDto {
  @IsUrl()
  @IsDefined()
  url: string;
}
