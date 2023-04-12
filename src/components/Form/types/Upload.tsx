import React from "react";
import { Form, Input as Field } from "antd";
import { TextMessage } from "../../TextMessage/TextMessage";

interface props {
  name: string;
  label?: string;
  classes: string[];
  rules?: {}[];
  children?: JSX.Element;
  getValueFromEvent?: (e: {
    file: { status: string; name: any };
    fileList: any;
  }) => void;
}

export const Upload: React.FC<props> = ({
  name,
  label,
  classes,
  rules,
  children,
  getValueFromEvent,
  ...rest
}): JSX.Element => {
  return (
    <Form.Item
      className={`mb-6 ${classes[0]}`}
      name={name}
      label={label}
      rules={rules}
      getValueFromEvent={getValueFromEvent}
    >
      {children}
    </Form.Item>
  );
};
