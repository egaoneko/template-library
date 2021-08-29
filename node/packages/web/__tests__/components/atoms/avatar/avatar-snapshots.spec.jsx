import React from 'react';
import renderer from 'react-test-renderer';
import Avatar from '../../../../src/components/atoms/avatar/Avatar';

describe('Avatar Snapshots', () => {
  it('renders avatar with default options', () => {
    const tree = renderer.create(<Avatar />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders avatar with small size', () => {
    const tree = renderer.create(<Avatar size="small" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders avatar with middle size', () => {
    const tree = renderer.create(<Avatar size="middle" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders avatar with large size', () => {
    const tree = renderer.create(<Avatar size="large" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders avatar with large size', () => {
    const tree = renderer.create(<Avatar size="large" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders avatar with url', () => {
    const tree = renderer.create(<Avatar url="http://example.com/sample.png" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders avatar with url and size', () => {
    const tree = renderer.create(<Avatar url="http://example.com/sample.png" size="small" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
