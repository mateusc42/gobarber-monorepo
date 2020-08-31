import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import BackgroundImage from '../../assets/img/sign-up-background.png';

export const Container = styled.div`
  min-height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
  /* padding: 2em 0 !imp; */
`;

const apperFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  /* padding: 4rem 0; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${apperFromRight} 1s;

  form {
    margin: 40px 0;
    width: 340px;

    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;

      margin-top: 8px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#F4EDE8')};
      }
    }
  }

  > a {
    color: #ff9000;
    display: flex;
    align-items: center;

    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 4px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${BackgroundImage}) no-repeat center;
  background-size: cover;
`;
