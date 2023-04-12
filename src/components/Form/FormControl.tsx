import React, { ReactElement } from "react";
import { Input } from "./types/Input";
import { Search } from "./types/Search";
import { Select } from "./types/Select";
import { Date } from "./types/Date";
import { TextArea } from "./types/TextArea";
import { Dayjs } from "dayjs";
import { RangePickerProps } from "antd/lib/date-picker";
import { Upload } from "./types/Upload";

interface props {
  element: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  classes: string[];
  rules?: {}[];
  prefix?: JSX.Element;
  children?: JSX.Element;
  rows?: number;
  showSearch?: boolean;
  mode?: string;
  format?: string;
  onChange?: (value: any, dateString?: any) => any;
  onSelect?: (value: any, dateString?: any) => any;
  onDeselect?: (value: any, dateString?: any) => any;
  value?: string | number;
  defaultValue?: Dayjs | string | number;
  picker?: "time" | "date" | "week" | "month" | "quarter" | "year";
  suffix?: ReactElement<any, any> | null;
  disabled?: boolean;
  disabledDate?: RangePickerProps["disabledDate"];
  getValueFromEvent?: (e: {
    file: { status: string; name: any };
    fileList: any;
  }) => void;
}

export const FormControl: React.FC<props> = ({
  element,
  children,
  onChange,
  ...rest
}): JSX.Element | null => {
  switch (element) {
    case "input":
      return <Input {...rest} />;
    case "search-input":
      return <Search {...rest} />;
    case "select":
      return (
        <Select {...rest} onChange={onChange}>
          {children}
        </Select>
      );
    case "date":
      return <Date {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "upload":
      return <Upload {...rest}>{children}</Upload>;
    default:
      return null;
  }
};
