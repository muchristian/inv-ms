import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useState,
} from "react";
import Dashboard from "../Layout/Dashboard";
import type { ColumnsType } from "antd/es/table";
import { Table, Space, Form, Select, Input } from "antd";
import { Button } from "../components/Button/Button";
import { Header } from "../components/Header/Header";
import { Modal } from "../components/Modal/Modal";
import { FormControl } from "../components/Form/FormControl";
import { TextArea } from "../components/Form/types/TextArea";
import { useGetAllCategoriesQuery } from "../utils/apis/categories";
import { productBody } from "../utils/models";
import { ToastRender } from "../utils/toast";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../utils/apis/product";
import { Trash } from "../components/Svg/Trash";
import { Edit } from "../components/Svg/Edit";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const { Option } = Select;

interface DataType {
  _id: number;
  name: string;
  price: string;
  quantity: number;
}

const Product = () => {
  const [modalMode, setModalMode] = useState("");
  const [openProductModal, onOpenProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [form] = Form.useForm();
  const productInitialValues: Partial<productBody> = {
    name: "",
    category: "",
    unit: "",
    quantity: "",
    price: "",
    image: "",
    description: "",
  };
  const { data: categories, isFetching: isFetchingCategories } =
    useGetAllCategoriesQuery({});
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { data: products, isFetching } = useGetProductsQuery({
    searchQuery,
    ...pagination,
  });
  const onToggleProductModal = () => {
    if (openProductModal) form.resetFields();
    onOpenProductModal(!openProductModal);
  };
  const onAdd = () => {
    setModalMode("add");
    onToggleProductModal();
  };
  const onUpdate = (record: any) => {
    form.setFieldsValue({ ...record, category: record.category.id });
    setModalMode("update");
    form.setFieldValue("id", record._id);
    onToggleProductModal();
  };

  const onDelete = async (value: any) => {
    try {
      const result = await deleteProduct(value).unwrap();
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
      render: (text) => <a>{text}</a>,
    },
    {
      title: "category",
      dataIndex: "category",
      key: "category",
      render: (text) => <a>{text && text.name}</a>,
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: (text) => <a>{text}</a>,
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

  const validationSchema = {
    name: {
      required: true,
      message: "Name is required",
    },
    category: {
      required: true,
      message: "Category is required",
    },
    price: {
      required: true,
      message: "Price is required",
    },
  };

  const onFinishedProduct = async (values: any) => {
    try {
      if (modalMode !== "add") {
        const result = await updateProduct(values).unwrap();
        form.resetFields();
        const { message } = result;
        ToastRender(message);
      } else {
        const result = await addProduct(values).unwrap();
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
          title="Create a new Product"
          onToggle={onToggleProductModal}
          toggle={openProductModal}
          width={720}
        >
          <Form
            layout="vertical"
            initialValues={productInitialValues}
            autoComplete="off"
            form={form}
            onFinish={onFinishedProduct}
            className="product flex flex-col"
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
                name="name"
                label="Name"
                placeholder="Beverage"
                classes={["basis-6/12"]}
                rules={[validationSchema.name]}
              />
              <FormControl
                element="select"
                name="category"
                label="Category"
                placeholder="Choose Category"
                classes={["basis-6/12"]}
                rules={[validationSchema.category]}
              >
                <>
                  {categories &&
                    categories.data.map(
                      (el: {
                        _id: Key | null | undefined;
                        name:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | ReactFragment
                          | ReactPortal
                          | null
                          | undefined;
                      }) => (
                        <Option key={el._id} value={el._id}>
                          {el.name}
                        </Option>
                      )
                    )}
                </>
              </FormControl>
            </div>

            <div className="flex gap-4">
              <FormControl
                type="text"
                element="input"
                name="price"
                label="Price"
                placeholder="10.00 Rwf"
                classes={["basis-6/12"]}
                rules={[validationSchema.price]}
              />
            </div>
            <div className="flex flex-col">
              <TextArea
                name="description"
                label="Description"
                placeholder="Write something..."
                rows={6}
                classes={[]}
              />
            </div>
            <Space>
              <Button
                type="button"
                onClick={onToggleProductModal}
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
          <Header title="Products" onClick={onAdd} />
          <div className="flex flex-col bg-primary p-4 gap-4 rounded border border-text/10">
            <div className="operation-header">
              <div className="flex justify-between">
                <div className="md:w-5/12 xl:w-4/12 2xl:w-3/12">
                  <Input
                    onChange={onSearchHandler}
                    placeholder="Search credits..."
                    className="w-7/12"
                  />
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              loading={isFetching ? true : false}
              dataSource={products ? products.data.items : undefined}
              pagination={{
                ...pagination,
                total: products ? products.data.total : 0,
              }}
              onChange={handleTable}
            />
          </div>
        </div>
      </>
    </Dashboard>
  );
};

export default Product;
