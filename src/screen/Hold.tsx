import { useState } from "react";
import Dashboard from "../Layout/Dashboard";
import { Navbar } from "../Layout/Navbar/Navbar";
// import jwt from "jsonwebtoken";
import QueryString from "qs";

import type { ColumnsType } from "antd/es/table";
import {
  Table,
  Space,
  Form,
  Select,
  Input,
  DatePicker,
  DatePickerProps,
} from "antd";
import { Button } from "../components/Button/Button";
import { Header } from "../components/Header/Header";
import { Modal } from "../components/Modal/Modal";
import { FormControl } from "../components/Form/FormControl";
import { ToastRender } from "../utils/toast";
import { useLazyGetAllProductsQuery } from "../utils/apis/product";
import {
  useAddHoldMutation,
  useDeleteHoldMutation,
  useGetHoldsQuery,
  useTotalHoldQuery,
  useUpdateHoldMutation,
} from "../utils/apis/holds";
import { disabledDate } from "../utils/date";
import dayjs from "dayjs";
import { Edit } from "../components/Svg/Edit";
import { Trash } from "../components/Svg/Trash";
import { TextArea } from "../components/Form/types/TextArea";
import axios from "axios";
import fileDownload from "js-file-download";
import { Excel } from "../components/Svg/Excel";

const { Option } = Select;
interface DataType {
  _id: number;
  name: string;
}

interface formValues {
  customerName: string;
  products: [];
  amount: string;
  date: any;
  description: string;
}
const Hold = () => {
  const [modalMode, setModalMode] = useState("");
  const [openModal, onOpenModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productsAmount, setproductsAmount] = useState<number>(0);
  const [currDate, setCurrDate] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [form] = Form.useForm();
  const initialValues: formValues = {
    customerName: "",
    products: [],
    amount: "",
    date: "",
    description: "",
  };
  const [hold, { data: loginResponse, error: loginError }] =
    useAddHoldMutation();
  const [holdUpdate] = useUpdateHoldMutation();
  const [holdDelete] = useDeleteHoldMutation();
  const { data: holds, isFetching } = useGetHoldsQuery({
    date: currDate,
    searchQuery,
    ...pagination,
  });
  const { data: totalCredits } = useTotalHoldQuery({
    date: currDate,
  });

  const [productsTrigger, { data: products }] = useLazyGetAllProductsQuery();
  const onToggleModal = () => {
    if (openModal) {
      form.resetFields();
      setproductsAmount(0);
      setSelectedProducts([]);
    }
    if (!products) {
      productsTrigger({});
    }
    onOpenModal(!openModal);
  };
  const onAdd = () => {
    setModalMode("add");
    onToggleModal();
  };
  const onUpdate = (record: any) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
      products: record.products.map((p: { id: number; name: string }) => p.id),
    });
    setproductsAmount(record.amount);
    setSelectedProducts([
      ...selectedProducts,
      ...record.products.map((p: { id: number; name: string }) => p.name),
    ]);
    setModalMode("update");
    form.setFieldValue("id", record._id);
    onToggleModal();
  };

  const onDelete = async (value: any) => {
    try {
      const result = await holdDelete(value).unwrap();
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
      title: "customer name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <a className="capitalize">{text}</a>,
    },
    {
      title: "products",
      dataIndex: "products",
      key: "products",
      render: (products: any) => (
        <>
          <div>
            {products &&
              products.map((el: any, index: number) => (
                <a key={el.id}>
                  {el.name}
                  {index !== products.length - 1 && ", "}
                </a>
              ))}
          </div>
        </>
      ),
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
    products: {
      required: true,
    },
    date: {
      required: true,
    },
  };

  const onSelectProduct = (value: any, product: any) => {
    form.setFieldValue("amount", productsAmount + +product.data.price);
    setproductsAmount(productsAmount + +product.data.price);
    setSelectedProducts([...selectedProducts, product.data.name]);
  };

  const onDeselectProduct = (value: any, product: any) => {
    form.setFieldValue("amount", productsAmount - +product.data.price);
    setproductsAmount(productsAmount - +product.data.price);
    const remainProducts = selectedProducts.filter(
      (el) => el !== product.data.name.toLowerCase()
    );
    setSelectedProducts(remainProducts);
  };

  const handleTable = (paginate: any) => {
    const page = {
      ...pagination,
      current: paginate.current,
      pageSize: paginate.pageSize,
    };
    setPagination(page);
  };

  const onFinishedHold = async (values: any) => {
    try {
      if (modalMode !== "add") {
        const result = await holdUpdate({
          ...values,
          date: values.date.format("YYYY-MM-DD"),
        }).unwrap();
        setSelectedProducts([]);
        setproductsAmount(0);
        form.resetFields();
        const { message } = result;
        ToastRender(message);
      } else {
        const result = await hold({
          ...values,
          date: values.date.format("YYYY-MM-DD"),
        }).unwrap();
        setSelectedProducts([]);
        setproductsAmount(0);
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
  const onSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    setSearchQuery(inputValue);
  };
  const onExportCsV = () => {
    const queries = QueryString.stringify(
      { date: currDate },
      {
        encodeValuesOnly: true,
      }
    );
    axios
      .get(`http://localhost:8001/api/hold/hold/export?${queries}`, {
        responseType: "arraybuffer",
      })
      .then((e) => {
        fileDownload(
          e.data,
          `credits-report${currDate ? `-${currDate}` : "-all"}.xlsx`
        );
      })
      .catch((err) => {
        ToastRender(err);
      });
  };
  return (
    <Dashboard title="analytics">
      <>
        <Modal
          title="Create a new Credit"
          onToggle={onToggleModal}
          toggle={openModal}
          width={720}
        >
          <Form
            layout="vertical"
            initialValues={initialValues}
            autoComplete="off"
            form={form}
            onFinish={onFinishedHold}
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
                name="customerName"
                label="Customer Name"
                placeholder="Mark joker"
                classes={["basis-6/12"]}
                rules={[validationSchema.name]}
              />
              <FormControl
                type="text"
                element="select"
                name="products"
                label="Products"
                mode="multiple"
                placeholder="Choose Products"
                classes={["basis-6/12"]}
                onSelect={(key: any, value: any) => onSelectProduct(key, value)}
                onDeselect={(key: any, value: any) =>
                  onDeselectProduct(key, value)
                }
                rules={[validationSchema.products]}
              >
                <>
                  {products &&
                    products.data.map((el: any) => (
                      <Option key={el._id} value={el._id} data={el}>
                        {el.name}
                      </Option>
                    ))}
                </>
              </FormControl>
            </div>
            <div className="flex gap-4">
              <FormControl
                type="text"
                element="input"
                name="amount"
                label="Amount"
                defaultValue={0}
                placeholder="1000"
                classes={["basis-6/12"]}
                rules={[validationSchema.amount]}
                suffix={<p>RWF</p>}
              />
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
          <Header title="Credit" total={totalCredits} onClick={onAdd} />
          <div className="flex flex-col bg-primary p-4 gap-4 rounded border border-text/10">
            <div className="operation-header">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 md:w-5/12 xl:w-4/12 2xl:w-3/12">
                  <Input
                    onChange={onSearchHandler}
                    placeholder="Search credits..."
                    className="w-7/12"
                  />
                  <DatePicker
                    name="currDate"
                    // placeholder="2022-01-01"
                    className="w-5/12"
                    value={currDate ? dayjs(currDate) : undefined}
                    onChange={currDateHandler}
                    disabledDate={disabledDate}
                  />
                </div>

                <div>
                  <p className="cursor-pointer" onClick={onExportCsV}>
                    <Excel />
                  </p>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              loading={isFetching ? true : false}
              // locale={
              //   isFetching ? { emptyText: <Skeleton active /> } : categories
              // }
              dataSource={holds ? holds.data.items : undefined}
              rowKey="_id"
              pagination={{
                ...pagination,
                total: holds ? holds.data.total : 0,
              }}
              onChange={handleTable}
            />
          </div>
        </div>
      </>
    </Dashboard>
  );
};

export default Hold;
