import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from '@root/profile/dto/profile.response';
import { Request } from 'express';
import { ProfileService } from '@root/profile/profile.service';
import { UserDto } from '@user/dto/user.response';

@ApiTags('profile')
@Controller('/api/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/:userId')
  @ApiOperation({ summary: 'get user profile' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token' })
  @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  async getProfile(@Param('userId') userId: number, @Req() req: Request): Promise<ProfileDto> {
    const profile = await this.profileService.get(userId);

    if (!profile) {
      throw new NotFoundException('Not found profile');
    }

    const user = req.user as UserDto;
    profile.following = await this.profileService.isFollow(user.id, userId);

    return profile;
  }
}
