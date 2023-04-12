import { useState } from "react";
import Dashboard from "../Layout/Dashboard";
import { Navbar } from "../Layout/Navbar/Navbar";
// import jwt from "jsonwebtoken";

import type { ColumnsType } from "antd/es/table";
import { Table, Space, Form, Select, DatePicker, DatePickerProps } from "antd";
import { Button } from "../components/Button/Button";
import { Header } from "../components/Header/Header";
import { Modal } from "../components/Modal/Modal";
import { FormControl } from "../components/Form/FormControl";
import { ToastRender } from "../utils/toast";
import {
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesQuery,
  useTotalExpenseQuery,
  useUpdateExpenseMutation,
} from "../utils/apis/expense";
import { disabledDate } from "../utils/date";
import dayjs from "dayjs";
import { Trash } from "../components/Svg/Trash";
import { Edit } from "../components/Svg/Edit";

const { Option } = Select;
interface DataType {
  _id: number;
  name: string;
}

interface formValues {
  title: string;
  amount: string;
  date: any;
}
const Expense = () => {
  const [modalMode, setModalMode] = useState("");
  const [openModal, onOpenModal] = useState(false);
  const [currDate, setCurrDate] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [form] = Form.useForm();
  const initialValues: formValues = {
    title: "",
    amount: "",
    date: "",
  };
  const [expense, { data: loginResponse, error: loginError }] =
    useAddExpenseMutation();
  const [expenseUpdate] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const { data: expenses, isFetching } = useGetExpensesQuery({
    date: currDate,
    searchQuery,
    ...pagination,
  });
  const { data: totalExpense } = useTotalExpenseQuery({
    date: currDate,
  });

  const onToggleModal = () => {
    if (openModal) {
      form.resetFields();
    }
    onOpenModal(!openModal);
  };
  const onAdd = () => {
    setModalMode("add");
    onToggleModal();
  };
  const onUpdate = (record: any) => {
    form.setFieldsValue({ ...record, date: dayjs(record.date) });
    setModalMode("update");
    form.setFieldValue("id", record._id);
    onToggleModal();
  };

  const onDelete = async (value: any) => {
    try {
      const result = await deleteExpense(value).unwrap();
      const { message } = result;
      ToastRender(message);
    } catch (error: any) {
      const { message } = error.data;
      ToastRender(message, true);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "id",
      dataIndex: "_id",
      key: "_id",
      render: (value) => <p>{value}</p>,
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a className="capitalize">{text}</a>,
    },
    {
      title: "amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <a className="capitalize">{text}</a>,
    },
    {
      title: "date",
      dataIndex: "date",
      key: "date",
      render: (text) => <a className="capitalize">{text.split("T")[0]}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Edit classes="w-4 cursor-pointer" onClick={() => onUpdate(record)} />
          <Trash
            classes="w-4 cursor-pointer"
            onClick={() => onDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const validationSchema = {
    name: {
      required: true,
    },
    amount: {
      required: true,
    },
    date: {
      required: true,
    },
  };

  const handleTable = (paginate: any) => {
    const page = {
      ...pagination,
      current: paginate.current,
      pageSize: paginate.pageSize,
    };
    setPagination(page);
  };

  const onFinishedExpense = async (values: any) => {
    try {
      if (modalMode !== "add") {
        const result = await expenseUpdate({
          ...values,
          date: values.date.format("YYYY-MM-DD"),
        }).unwrap();
        form.resetFields();
        const { message } = result;
        ToastRender(message);
      } else {
        const result = await expense({
          ...values,
          date: values.date.format("YYYY-MM-DD"),
        }).unwrap();
        form.resetFields();
        const { message } = result;
        ToastRender(message);
      }
    } catch (error: any) {
      const { message } = error.data;
      ToastRender(message, true);
    }
  };
  const currDateHandler: DatePickerProps["onChange"] = (
    value,
    dateString: string
  ) => {
    if (!dateString) {
      setCurrDate(undefined);
    }
    setCurrDate(dateString);
  };
  return (
    <Dashboard title="analytics">
      <>
        <Modal
          title="Create a new Expense"
          onToggle={onToggleModal}
          toggle={openModal}
          width={720}
        >
          <Form
            layout="vertical"
            initialValues={initialValues}
            autoComplete="off"
            form={form}
            onFinish={onFinishedExpense}
          >
            <FormControl
              type="text"
              element="input"
              name="id"
              classes={["hidden"]}
            />
            <div className="flex gap-4">
              <FormControl
                type="text"
                element="input"
                name="title"
                label="title"
                placeholder="transport"
                classes={["basis-6/12"]}
                rules={[validationSchema.name]}
              />
              <FormControl
                type="text"
                element="input"
                name="amount"
                label="Amount"
                placeholder="1000"
                classes={["basis-6/12"]}
                rules={[validationSchema.amount]}
                suffix={<p>RWF</p>}
              />
            </div>
            <div className="flex gap-4">
              <FormControl
                element="date"
                name="date"
                label="Date"
                placeholder="2022-01-01"
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                classes={["basis-6/12"]}
                rules={[validationSchema.date]}
              />
            </div>
            <Space>
              <Button
                type="button"
                onClick={onToggleModal}
                classes="bg-secondary text-primary"
              >
                <>
                  <h6>Cancel</h6>
                </>
              </Button>
              <Button type="submit" classes="bg-secondary text-primary">
                <>
                  <h6>Submit</h6>
                </>
              </Button>
            </Space>
          </Form>
        </Modal>
        <div className="flex flex-col gap-6 px-6 py-6">
          <Header title="Expense" onClick={onAdd} />
          <div className="flex flex-col bg-primary p-4 gap-4 rounded border border-text/10">
            <div className="operation-header">
              <div className="flex justify-between items-center">
                <div className="md:w-5/12 xl:w-4/12 2xl:w-3/12">
                  <DatePicker
                    name="currDate"
                    // placeholder="2022-01-01"
                    className="w-7/12"
                    value={currDate ? dayjs(currDate) : undefined}
                    onChange={currDateHandler}
                    disabledDate={disabledDate}
                  />
                </div>
                <p>total Amount: {totalExpense && totalExpense.data}</p>
              </div>
            </div>
            <Table
              columns={columns}
              loading={isFetching ? true : false}
              // locale={
              //   isFetching ? { emptyText: <Skeleton active /> } : categories
              // }
              dataSource={expenses ? expenses.data.items : undefined}
              rowKey="_id"
              pagination={{
                ...pagination,
                total: expenses ? expenses.data.total : 0,
              }}
              onChange={handleTable}
            />
          </div>
        </div>
      </>
    </Dashboard>
  );
};

export default Expense;
