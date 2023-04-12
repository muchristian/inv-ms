import { useState } from "react";
import Dashboard from "../Layout/Dashboard";
import {
  Input,
  InputNumber,
  Table,
  Form,
  Typography,
  DatePicker,
  DatePickerProps,
} from "antd";
import { ToastRender } from "../utils/toast";
import WithPrivateRoute from "../components/HOC/WithPrivateRoute";
import {
  useAddComptoirMutation,
  useGetComptoirQuery,
  useTotalComptoirQuery,
  useUpdateComptoirMutation,
} from "../utils/apis/comptoir";
import omit from "lodash.omit";
import dayjs from "dayjs";
import axios from "axios";
import { disabledDate } from "../utils/date";
import fileDownload from "js-file-download";
import { Excel } from "../components/Svg/Excel";
import { Edit } from "../components/Svg/Edit";

interface Item {
  _id: number;
  productName: string;
  lastNight: number;
  new: number;
  now: number;
  consumed: number;
  amount: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

interface DataType {
  _id: number;
  name: string;
}
interface formValues {
  lastNight: string;
  new: string;
  now: string;
  consumed: string;
  amount: string;
}
const Comptoir = () => {
  const [currDate, setCurrDate] = useState<string>(
    dayjs(new Date().toISOString().slice(0, 10)).format("YYYY-MM-DD")
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [editingKey, setEditingKey] = useState<string | undefined>("");
  const [form] = Form.useForm();
  const initialValues: formValues = {
    lastNight: "",
    new: "",
    now: "",
    consumed: "",
    amount: "",
  };

  const { data: comptoir, isFetching } = useGetComptoirQuery({
    date: currDate,
    searchQuery,
    ...pagination,
  });
  const { data: totalComptoir } = useTotalComptoirQuery({
    date: currDate,
  });
  const [comptoirCreate] = useAddComptoirMutation();
  const [comptoirUpdate] = useUpdateComptoirMutation();

  const onChangeHandler = (value: any, record: any) => {
    const lastNight = form.getFieldValue("lastNight");
    const newProd = form.getFieldValue("new");
    const nowProd = form.getFieldValue("now");
    if (
      isValid(lastNight) &&
      isValid(newProd) &&
      isValid(nowProd) &&
      nowProd <= lastNight + newProd
    ) {
      const consumedProd = lastNight + newProd - nowProd;
      form.setFieldValue("consumed", consumedProd);
      form.setFieldValue("amount", consumedProd * +record.productPrice);
    }
    if (!isValid(lastNight) || !isValid(newProd) || !isValid(nowProd)) {
      form.setFieldValue("consumed", null);
      form.setFieldValue("amount", null);
    }
  };

  const isValid = (value: any) => {
    return value || value === 0 ? true : false;
  };
  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "number" ? (
        <InputNumber
          onChange={(value) => onChangeHandler(value, record)}
          disabled={["consumed", "amount"].includes(dataIndex) && true}
        />
      ) : (
        <Input />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              ...(!["consumed", "amount"].includes(dataIndex)
                ? [
                    {
                      required: true,
                      message: `Please Input ${title}!`,
                    },
                    {
                      validator: (_: any, value: any) => {
                        if (dataIndex === "now") {
                          if (
                            value >
                            form.getFieldValue("lastNight") +
                              form.getFieldValue("new")
                          ) {
                            return Promise.reject(
                              new Error(
                                "Now should not exceed lastNight and new"
                              )
                            );
                          }
                          return Promise.resolve();
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]
                : []),
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record: Item) => record.productName === editingKey;

  const edit = (record: Partial<Item>) => {
    const formValues = {
      ...initialValues,
      ...omit(record, ["productId", "productName", "productPrice"]),
    };
    form.setFieldsValue(formValues);
    setEditingKey(record.productName);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (record: Item, mode: string) => {
    try {
      if (mode !== "add") {
        const row = (await form.validateFields()) as Item;
        const data = {
          ...omit(record, ["productName", "productPrice", "amount"]),
          ...row,
        };
        const result = await comptoirUpdate(data).unwrap();
        form.resetFields();
        cancel();
        const { message } = result;
        ToastRender(message);
      } else {
        const row = (await form.validateFields()) as Item;
        const data = {
          ...omit(record, ["productName", "productPrice", "_id", "amount"]),
          ...row,
          date: currDate,
        };
        const result = await comptoirCreate(data).unwrap();
        form.resetFields();
        cancel();
        const { message } = result;
        ToastRender(message);
      }
    } catch (error: any) {
      if (error.errorFields.length > 0) return;
      const { message } = error.data;
      ToastRender(message, true);
    }
  };

  const columns = [
    {
      title: "productName",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "lastNight",
      dataIndex: "lastNight",
      key: "lastNight",
      width: "15%",
      editable: true,
    },
    {
      title: "new",
      dataIndex: "new",
      key: "new",
      width: "15%",
      editable: true,
    },
    {
      title: "now",
      dataIndex: "now",
      key: "now",
      width: "15%",
      editable: true,
    },
    {
      title: "consumed",
      dataIndex: "consumed",
      key: "consumed",
      width: "15%",
      editable: true,
    },
    {
      title: "amount",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      editable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <div className="flex">
            <Typography.Link
              onClick={() => save(record, `${!record._id ? "add" : "update"}`)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <p onClick={cancel} className="cursor-pointer">
              Cancel
            </p>
          </div>
        ) : (
          <Edit classes="w-4 cursor-pointer" onClick={() => edit(record)} />
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType:
          col.dataIndex === "lastNight" ||
          col.dataIndex === "new" ||
          col.dataIndex === "now" ||
          col.dataIndex === "consumed" ||
          col.dataIndex === "amount"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const currDateHandler: DatePickerProps["onChange"] = (
    value,
    dateString: string
  ) => {
    if (!dateString) {
      setCurrDate(
        dayjs(new Date().toISOString().slice(0, 10)).format("YYYY-MM-DD")
      );
    } else {
      setCurrDate(dateString);
    }
  };
  const onSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    setSearchQuery(inputValue);
  };
  const handleTable = (paginate: any) => {
    const page = {
      ...pagination,
      current: paginate.current,
      pageSize: paginate.pageSize,
    };
    setPagination(page);
  };

  const onExportCsV = () => {
    axios
      .get(
        `http://localhost:8001/api/inventory/comptoir/export?date=${currDate}`,
        {
          responseType: "arraybuffer",
        }
      )
      .then((e) => {
        fileDownload(e.data, `comptoir-report-${currDate}.xlsx`);
      })
      .catch((err) => {
        ToastRender(err);
      });
  };
  return (
    <Dashboard title="comptoir">
      <>
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="page-header flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Comptoir</h2>
              <p>total Amount: {totalComptoir && totalComptoir.data}</p>
            </div>
            <div>
              <DatePicker
                name="currDate"
                className="flex-1"
                value={dayjs(currDate)}
                onChange={currDateHandler}
                disabledDate={disabledDate}
              />
            </div>
          </div>
          <div className="flex flex-col bg-primary p-4 gap-4 rounded border border-text/10">
            <div className="operation-header">
              <div className="flex justify-between items-center">
                <div className="md:w-5/12 xl:w-4/12 2xl:w-3/12">
                  <Input
                    onChange={onSearchHandler}
                    placeholder="Search credits..."
                    className="w-7/12"
                  />
                </div>
                <div>
                  <p className="cursor-pointer" onClick={onExportCsV}>
                    <Excel />
                  </p>
                </div>
              </div>
            </div>
            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                loading={isFetching ? true : false}
                // locale={
                //   isFetching ? { emptyText: <Skeleton active /> } : categories
                // }
                dataSource={comptoir ? comptoir.data.items : undefined}
                columns={mergedColumns}
                rowClassName="editable-row"
                rowKey="productName"
                pagination={{
                  ...pagination,
                  total: comptoir ? comptoir.data.total : 0,
                }}
                onChange={handleTable}
              />
            </Form>
          </div>
        </div>
      </>
    </Dashboard>
  );
};

export default WithPrivateRoute(Comptoir);
