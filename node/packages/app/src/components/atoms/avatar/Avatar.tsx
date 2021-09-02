import React, {FC} from 'react';
import styled from 'styled-components/native';

const DEFAULT_IMAGE =
  'https://static.productionready.io/images/smiley-cyrus.jpg';

interface PropsType {
  uri?: string;
  size: number;
}

const Avatar: FC<PropsType> = props => {
  const {uri = DEFAULT_IMAGE, size} = props;
  return <StyledImage source={{uri}} size={size} />;
};

export default Avatar;

const StyledImage = styled.Image<{size: number}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: ${({size}) => size / 2}px;
`;
