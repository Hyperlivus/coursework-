import { IsInt } from 'class-validator';

export class CreateReactionDto {
  @IsInt()
  reactionTypeId: number;

  @IsInt()
  messageId: number;

  @IsInt()
  chatId: number;
}
