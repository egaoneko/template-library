import React from 'react';
import { render } from '@testing-library/react';
import Avatar from '../../../../src/components/atoms/avatar/Avatar';

describe('Avatar Snapshots', () => {
  it('renders avatar width default option', () => {
    const expected = 'https://static.productionready.io/images/smiley-cyrus.jpg';
    const { getByRole } = render(<Avatar />);
    const avatar = getByRole('img');
    expect(avatar).toHaveAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    expect(avatar).toHaveAttribute('alt', 'avatar');
    expect(avatar).toBeInTheDocument();
  });

  it('renders avatar with url', () => {
    const expected = 'http://example.com/sample.png';
    const { getByRole } = render(<Avatar url={expected} />);
    const avatar = getByRole('img');
    expect(avatar).toHaveAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    expect(avatar).toHaveAttribute('alt', 'avatar');
    expect(avatar).toBeInTheDocument();
  });
});
