import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiParam({ name: 'userId', description: 'user id of profile', type: 'number' })
  @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Param('userId') userId: number, @Req() req: Request): Promise<ProfileDto> {
    return this.profileService.get((req.user as UserDto).id, userId);
  }

  @Post('/:userId/follow')
  @ApiOperation({ summary: 'follow user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiParam({ name: 'userId', description: 'user id to follow', type: 'number' })
  @ApiResponse({ status: 201, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async follow(@Param('userId') userId: number, @Req() req: Request): Promise<ProfileDto> {
    return this.profileService.followUser((req.user as UserDto).id, userId);
  }

  @Delete('/:userId/follow')
  @ApiOperation({ summary: 'unfollow user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiParam({ name: 'userId', description: 'user id to unfollow', type: 'number' })
  @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unfollow(@Param('userId') userId: number, @Req() req: Request): Promise<ProfileDto> {
    return this.profileService.unfollowUser((req.user as UserDto).id, userId);
  }
}
