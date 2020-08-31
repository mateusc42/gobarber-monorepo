import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    > div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      a {
        text-decoration: none;
        padding: 12px;
        background: transparent;
        border: 0;
        border-radius: 8px;
        transition: all 0.2s;

        svg {
          vertical-align: bottom;
          color: #999591;
          font-size: 20px;
        }

        &:hover {
          background: #222222;
        }
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -130px 0 auto;

  width: 100%;

  form {
    margin: 40px 0;
    width: 340px;

    text-align: center;

    h1 {
      font-size: 20px;
      text-align: left;
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
`;

export const AvatarInput = styled.div`
  margin: 0 auto 32px;
  width: 186px;
  position: relative;

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    border: none;
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    right: 10px;
    bottom: 0;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }

    input {
      display: none;
    }
  }
`;
