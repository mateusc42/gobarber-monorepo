import React, { useRef, useCallback, useState } from 'react';
import * as Yup from 'yup';
import { FiLogIn, FiMail } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { Link } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import Logo from '../../assets/img/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface IForgotPassowordFormData {
  email: string;
  password: string;
}

const ForgotPassoword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  // const history = useHistory();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: IForgotPassowordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });

        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
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
            <h1>Recuperar Senha</h1>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              icon={FiMail}
            />

            <Button loading={loading} type="submit">
              Entrar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn /> Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassoword;
