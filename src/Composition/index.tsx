import { ReactNode } from "react";
import styled from "styled-components";

function withLabel(Component: Function) {
  return ({ children, ...rest }: { children: ReactNode; [x: string]: any }) => (
    <>
      <LabelBox>{children}</LabelBox>
      <Component {...rest} />
    </>
  );
}

export default withLabel;

const LabelBox = styled.label`
  ${({ theme }) => theme.text10R};
  color: ${({ theme }) => theme.colors.grey9C};
  padding-bottom: 8px;
`;

import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";

type TValue = string | number;

interface IProps {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  color?: string;
  radius?: string;
  className?: string;
  isVisible?: boolean;
  type?: string;
  value?: TValue;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Input({
  isVisible,
  value = "",
  type = "text",
  onChange,
  ...rest
}: IProps) {
  return (
    <CustomInput type={type} value={value} onChange={onChange} {...rest} />
  );
}

export default React.memo(Input);

const CustomInput = styled.input<IProps>`
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "43px")};
  margin: ${(props) => props.margin};
  padding: ${(props) => (props.padding ? props.padding : "13.5px 16px")};
  border-radius: ${(props) => (props.radius ? props.radius : "6px")};
  background-color: ${(props) =>
    props.color ? props.color : theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.greyE9};
`;


import styled from 'styled-components';
import VisiblOffImg from '../../assets/visibilityoff.png';
import VisiblOnImg from '../../assets/visibilityon.png';

function Icon(Component: Function) {
  return ({ isVisible, onClick, ...rest }: { [x: string]: any }) => {
    return (
      <Container>
        <Component {...rest} />
        <IconBox src={isVisible ? VisiblOnImg : VisiblOffImg} onClick={onClick} />
      </Container>
    );
  };
}

export default Icon;

const Container = styled.div`
  position: relative;
`;
const IconBox = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 17px;
  top: 50%;
`;
