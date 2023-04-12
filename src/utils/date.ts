import { RangePickerProps } from "antd/lib/date-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return dayjs().endOf("day") < current;
};
