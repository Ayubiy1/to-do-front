import React, { useState } from "react";
import { Button, Checkbox, Drawer, Form, Input } from "antd";
import { CiMenuKebab } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ListEdit = ({ listId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { data, isLoading: listLoading } = useQuery({
    queryKey: ["list-edit-query", listId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/api/lists/${listId}`);

      // const list = res.data.find((b) => b._id == listId);

      return res; // faqat _id qaytadi
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (upadtedData) => {
      const res = await axios.put(
        `http://localhost:3000/api/lists/${listId}`,
        upadtedData
      );
      return res.data;
    },
    onSuccess: (upadtedBoard) => {
      queryClient.invalidateQueries("lists");
      setOpen(false);
      // Cache ichida listlarni boshiga qo‘shamiz
      queryClient.setQueryData(["lists", listId], (oldLists = []) => [
        upadtedBoard,
        ...oldLists,
      ]);
    },
  });

  const onFinish = (values) => {
    mutate({ ...values, boardId: location.pathname.slice(1) });
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "transparent",
          padding: "0",
        }}
        type="primary"
        onClick={showDrawer}
      >
        <CiMenuKebab />
      </Button>
      <Drawer
        title="Edit List"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          initialValues={{ name: data?.data?.name }}
        >
          <Form.Item
            label="List Name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Change
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default ListEdit;
