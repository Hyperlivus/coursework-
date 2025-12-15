import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MaxLength(1024)
  content: string;

  @IsInt()
  chatId: number;
}

export class EditMessageDto {
  @IsString()
  content: string;

  @IsInt()
  messageId: number;
}

export class DeleteMessageDto {
  @IsInt()
  messageId: number;
}
