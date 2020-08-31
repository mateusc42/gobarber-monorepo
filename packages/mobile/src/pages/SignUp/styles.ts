import styled, { css } from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Platform, Keyboard } from 'react-native';

interface ContainerProps {
  keyboardOpen?: boolean;
}

export const Container = styled.View<ContainerProps>`
  flex: 1;
  align-items: center;
  justify-content: center;

  padding: 0 30px;

  ${props =>
    props.keyboardOpen &&
    Platform.OS === 'android' &&
    css`
      padding-bottom: 170px;
    `}
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;
`;

export const BackToSignIn = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #312e38;
  border-top-width: 1px;
  border-color: #232129;

  padding: 16px 0 ${15 + getBottomSpace()}px;

  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const BackToSignInText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: 'RobotoSlab-Medium';
  margin-left: 8px;
`;
