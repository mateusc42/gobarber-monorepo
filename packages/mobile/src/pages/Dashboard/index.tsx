import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProviderContainer,
  ProviderAvatar,
  ProviderListTitle,
  ProvidersList,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';
import api from '../../services/api';

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string | null;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<IProvider[]>([]);
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();

  const navigationToProfile = useCallback(() => {
    // navigate('Profile');
    signOut();
  }, [signOut]);

  const navigationToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  useEffect(() => {
    api.get<IProvider[]>('/providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo,{'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton activeOpacity={0.7} onPress={navigationToProfile}>
          <UserAvatar
            source={{
              uri: user.avatar_url
                ? user.avatar_url
                : '../../assets/default-profile.jpg',
            }}
          />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProviderListTitle>Cabeleleiros</ProviderListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => {
              navigationToCreateAppointment(provider.id);
            }}
          >
            <ProviderAvatar
              source={{
                uri: provider.avatar_url
                  ? provider.avatar_url
                  : '../../assets/default-profile.jpg',
              }}
            />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>
              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>08:00h às 18:00h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
