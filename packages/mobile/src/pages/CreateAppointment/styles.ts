import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Platform, FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { IProvider } from './index';

interface IProviderContainerProps {
  selected: boolean;
}

interface IProviderNameProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 24}px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'Roboto-Medium';
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProviderListContainer = styled.View`
  /* flex: 1; */
  /* padding-right: 24px; */
`;

export const ProviderList = styled(FlatList as new () => FlatList<IProvider>)`
  /* flex: 1; */

  padding: 32px 24px;
`;

export const ProviderContainer = styled(RectButton)<IProviderContainerProps>`
  background: ${props => (props.selected ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  padding: 8px 12px;
  align-items: center;
  margin-right: 16px;
  border-radius: 10px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text<IProviderNameProps>`
  margin-left: 8px;
  font-family: 'Roboto-Medium';
  font-size: 16px;
  color: ${props => (props.selected ? '#232129' : '#f4ede8')};
`;
