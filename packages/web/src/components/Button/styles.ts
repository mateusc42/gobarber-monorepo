import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9000;
  height: 56px;
  color: #312e38;
  border-radius: 10px;
  padding: 0 16px;
  width: 100%;
  font-weight: 600;
  border: none;
  margin-top: 16px;
  transition: background 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;
