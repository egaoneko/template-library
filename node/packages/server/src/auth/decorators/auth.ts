import { SetMetadata } from '@nestjs/common';
import { NO_AUTH_META_DATA_KEY } from '@root/auth/constants/auth.constant';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';

export const NoAuth: () => CustomDecorator<string> = () => SetMetadata(NO_AUTH_META_DATA_KEY, true);
