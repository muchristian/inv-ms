import { Drawer, Space } from "antd";
import React from "react";
import { Button } from "../Button/Button";

export const Modal: React.FC<{
  title: string;
  children: JSX.Element;
  onToggle: () => void;
  toggle: boolean;
  width: number;
}> = ({ title, children, onToggle, toggle, width }) => {
  return (
    <Drawer
      title={title}
      width={width}
      onClose={onToggle}
      open={toggle}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <div className="modal">{children}</div>
    </Drawer>
  );
};
