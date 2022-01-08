import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from 'src/profile/dto/response/profile.dto';
import { ProfileService } from 'src/profile/profile.service';
import { NoAuth } from 'src/shared/decorators/auth/no-auth';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';

@ApiTags('profile')
@Controller('/api/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @NoAuth()
  @Get('/:username')
  @ApiOperation({ summary: 'get user profile' })
  @ApiBearerAuth()
  @ApiParam({ name: 'username', description: 'username of profile', type: 'number' })
  @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Param('username') username: string, @CurrentUser('id') currentUserId: number): Promise<ProfileDto> {
    return this.profileService.getProfileByName(currentUserId, username);
  }

  @Post('/:username/follow')
  @ApiOperation({ summary: 'follow user' })
  @ApiBearerAuth()
  @ApiParam({ name: 'username', description: 'username to follow', type: 'number' })
  @ApiResponse({ status: 201, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async follow(@Param('username') username: string, @CurrentUser('id') currentUserId: number): Promise<ProfileDto> {
    return this.profileService.followUser(currentUserId, username);
  }

  @Delete('/:username/follow')
  @ApiOperation({ summary: 'unfollow user' })
  @ApiBearerAuth()
  @ApiParam({ name: 'username', description: 'username to unfollow', type: 'number' })
  @ApiResponse({ status: 200, description: 'Profile', type: ProfileDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unfollow(@Param('username') username: string, @CurrentUser('id') currentUserId: number): Promise<ProfileDto> {
    return this.profileService.unfollowUser(currentUserId, username);
  }
}
