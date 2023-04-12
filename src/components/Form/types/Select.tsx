import React, { Children } from "react";
import { Form, Input as Field, Select as Slt } from "antd";
import { TextMessage } from "../../TextMessage/TextMessage";

const { Option } = Slt;

interface props {
  name: string;
  label?: string;
  classes: string[];
  rules?: {}[];
  children?: JSX.Element;
  onChange?: (value: any) => any;
}

export const Select: React.FC<props> = ({
  name,
  label,
  classes,
  rules,
  children,
  onChange,
  ...rest
}): JSX.Element => {
  return (
    <Form.Item
      className={`mb-6 ${classes[0]}`}
      name={name}
      label={label}
      rules={rules}
    >
      <Slt {...rest} onChange={onChange}>
        {children}
      </Slt>
    </Form.Item>
  );
};
