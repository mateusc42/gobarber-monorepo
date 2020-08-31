import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import { useHistory, Link } from 'react-router-dom';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import defaultProfile from '../../assets/img/default-profile.jpg';

interface IProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  confirm_password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { user, updateUser } = useAuth();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: IProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('A nova senha é obrigatória'),
            otherwise: Yup.string(),
          }),
          confirm_password: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string()
                .required('A nova senha é obrigatória')
                .min(8, 'A nova senha deve ter no mínimo 8 caracteres'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'As senhas não coincidem'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, password, old_password } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
              }
            : {}),
        };

        const { data: userData } = await api.put('/profile', formData);

        updateUser(userData);

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso !',
          description: 'Suas informações foram atualizadas com sucesso',
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description:
            'Ocorreu um erro ao fazer a atualização. Tente novamente mais tarde',
        });
      }
    },
    [addToast, updateUser, history],
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        try {
          const { data: userData } = await api.patch('/users/avatar', data);

          updateUser(userData);

          addToast({
            type: 'success',
            title: 'Avatar atualizado com sucesso!',
            description: 'Seu avatar foi atualizado com sucesso',
          });
        } catch (error) {
          addToast({
            type: 'error',
            title: 'Ocorreu um erro!',
            description:
              'Não foi possível atualizar seu avatar, tente novamente mais tarde',
          });
        }
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img
              src={user.avatar_url ? user.avatar_url : defaultProfile}
              alt=""
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                name=""
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>
          <Input name="name" type="text" placeholder="Nome" icon={FiUser} />
          <Input name="email" type="email" placeholder="Email" icon={FiMail} />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            type="password"
            placeholder="Senha atual"
            icon={FiLock}
          />
          <Input
            name="password"
            type="password"
            placeholder="Nova Senha"
            icon={FiLock}
          />
          <Input
            name="confirm_password"
            type="password"
            placeholder="Confirme a Nova Senha"
            icon={FiLock}
          />

          <Button type="submit">Confirmar alterações</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
