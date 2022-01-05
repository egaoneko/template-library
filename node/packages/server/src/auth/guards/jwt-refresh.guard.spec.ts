import { JwtRefreshGuard } from './jwt-refresh.guard';

describe('JwtRefreshGuard', () => {
  let guard: JwtRefreshGuard;

  beforeEach(async () => {
    guard = new JwtRefreshGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
