import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impha2VAamFrZS5qYWtlIiwidXNlcm5hbWUiOiJKYWNvYiIsImlhdCI6MTYyMzYzMTI5MSwiZXhwIjoxNjIzNjMxMzUxfQ.RMev83pXKAlQVbjsGyhVsZHEoohEoClmfGiFstWJ1uo',
    description: 'refresh token',
    type: 'string',
  })
  refreshToken!: string;
}
