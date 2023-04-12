import { useState } from "react";
import Dashboard from "../Layout/Dashboard";
import type { ColumnsType } from "antd/es/table";
import { Table, Space, Form } from "antd";
import { Button } from "../components/Button/Button";
import { Header } from "../components/Header/Header";
import { Modal } from "../components/Modal/Modal";
import { FormControl } from "../components/Form/FormControl";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../utils/apis/categories";
import { ToastRender } from "../utils/toast";
import { categoriesBody } from "../utils/models";
import { Edit } from "../components/Svg/Edit";
import { Trash } from "../components/Svg/Trash";

interface DataType {
  _id: number;
  name: string;
}
interface formValues {
  name: string;
}
const Category = () => {
  const [modalMode, setModalMode] = useState("");
  const [openModal, onOpenModal] = useState(false);
  const onToggleModal = () => {
    if (openModal) form.resetFields();
    onOpenModal(!openModal);
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [form] = Form.useForm();
  const initialValues: formValues = { name: "" };
  const [category, { data: loginResponse, error: loginError }] =
    useAddCategoryMutation();
  const [categoryUpdate] = useUpdateCategoryMutation();
  const [categoryDelete] = useDeleteCategoryMutation();
  const { data: categories, isFetching } = useGetCategoriesQuery({
    ...pagination,
  });
  const onAdd = () => {
    setModalMode("add");
    onToggleModal();
  };
  const onUpdate = (record: any) => {
    form.setFieldsValue({ ...record });
    setModalMode("update");
    form.setFieldValue("id", record._id);
    onToggleModal();
  };
  const onDelete = async (value: any) => {
    try {
      const result = await categoryDelete(value).unwrap();
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
      title: "name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="capitalize">{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Edit classes="w-4 cursor-pointer" onClick={() => onUpdate(record)} />
          <Trash
            classes="w-4 cursor-pointer"
            onClick={() => onDelete({ id: record._id })}
          />
        </Space>
      ),
    },
  ];
  const validationSchema = {
    name: {
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

  const onFinishedCategory = async (values: categoriesBody) => {
    try {
      if (modalMode !== "add") {
        const result = await categoryUpdate(values).unwrap();
        form.resetFields();
        const { message } = result;
        ToastRender(message);
      } else {
        const result = await category(values).unwrap();
        form.resetFields();
        const { message } = result;
        ToastRender(message);
      }
    } catch (error: any) {
      const { message } = error.data;
      ToastRender(message, true);
    }
  };
  return (
    <Dashboard title="analytics">
      <>
        <Modal
          title="Create a new category"
          onToggle={onToggleModal}
          toggle={openModal}
          width={378}
        >
          <Form
            layout="vertical"
            initialValues={initialValues}
            autoComplete="off"
            form={form}
            onFinish={onFinishedCategory}
          >
            <FormControl
              type="text"
              element="input"
              name="id"
              classes={["hidden"]}
            />
            <FormControl
              type="text"
              element="input"
              name="name"
              label="Name"
              placeholder="Beverage"
              classes={[]}
              rules={[validationSchema.name]}
            />
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
          <Header title="Category" onClick={onAdd} />
          <div className="flex flex-col bg-primary p-4 gap-4 rounded border border-text/10">
            <Table
              columns={columns}
              loading={isFetching ? true : false}
              // locale={
              //   isFetching ? { emptyText: <Skeleton active /> } : categories
              // }
              dataSource={categories ? categories.data.items : undefined}
              pagination={{
                ...pagination,
                total: categories ? categories.data.total : 0,
              }}
              onChange={handleTable}
              rowKey="_id"
            />
          </div>
        </div>
      </>
    </Dashboard>
  );
};

export default Category;
