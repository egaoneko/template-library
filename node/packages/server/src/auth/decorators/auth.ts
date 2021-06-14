import { SetMetadata } from '@nestjs/common'
import { NO_AUTH_META_DATA_KEY } from '@auth/constants/auth';

export const NoAuth = () => SetMetadata(NO_AUTH_META_DATA_KEY, true);