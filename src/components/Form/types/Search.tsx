import React from "react";
import { Form, Input as Field } from "antd";
import { TextMessage } from "../../TextMessage/TextMessage";

interface props {
  name: string;
  label?: string;
  classes: string[];
}

export const Search: React.FC<props> = ({
  name,
  label,
  classes,
  ...rest
}): JSX.Element => {
  return (
    <Form.Item name={name} label={label} className="w-full">
      <Field
        {...rest}
        className={`bg-primary-50 border-0 shadow-none text-typography-900 text-sm focus:outline-none ${classes[1]}`}
      />
    </Form.Item>
  );
};
