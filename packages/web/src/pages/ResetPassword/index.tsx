import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';
import { FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { useHistory, useLocation } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import Logo from '../../assets/img/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ISignInFormData {
  password: string;
  confirm_password: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ISignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'As senhas não coincidem')
            .min(8, 'A senha deve ter no mínimo 8 caracteres'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password: data.password,
          token,
        });

        addToast({
          type: 'success',
          title: 'Senha alterada com sucesso!',
          description:
            'Sua senha foi alterada com sucesso, faça login para entrar novamente',
        });

        await history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          addToast({
            type: 'error',
            title: 'Erro na validação',
            description: 'Por favor, verifique todos os campos',
          });

          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={Logo} alt="" />
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            autoComplete="off"
            autoCorrect="off"
          >
            <h1>Resetar Senha</h1>

            <Input
              name="password"
              type="password"
              placeholder="Nova Senha"
              icon={FiLock}
            />
            <Input
              name="confirm_password"
              type="password"
              placeholder="Confirmação da Senha"
              icon={FiLock}
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
