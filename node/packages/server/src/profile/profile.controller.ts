import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from '@profile/dto/profile.response';
import { ProfileService } from '@profile/profile.service';
import { CurrentUser } from '@user/decorators/current-user.decorator';

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
  async getProfile(@Param('userId') userId: number, @CurrentUser('id') currentUserId: number): Promise<ProfileDto> {
    return this.profileService.findOne(currentUserId, userId);
  }

  @Post('/:userId/follow')
  @ApiOperation({ summary: 'follow user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiParam({ name: 'userId', description: 'user id to follow', type: 'number' })
  @ApiResponse({ status: 201, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async follow(@Param('userId') userId: number, @CurrentUser('id') currentUserId: number): Promise<ProfileDto> {
    return this.profileService.followUser(currentUserId, userId);
  }

  @Delete('/:userId/follow')
  @ApiOperation({ summary: 'unfollow user' })
  @ApiHeader({ name: 'Authorization', description: 'jwt token', required: true })
  @ApiParam({ name: 'userId', description: 'user id to unfollow', type: 'number' })
  @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unfollow(@Param('userId') userId: number, @CurrentUser('id') currentUserId: number): Promise<ProfileDto> {
    return this.profileService.unfollowUser(currentUserId, userId);
  }
}
