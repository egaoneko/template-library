import { SetMetadata } from '@nestjs/common';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';

export const NO_AUTH_META_DATA_KEY = 'no-auth';

export const NoAuth: () => CustomDecorator<string> = () => SetMetadata(NO_AUTH_META_DATA_KEY, true);
