import React, { useState } from "react";
import { Button, Checkbox, Drawer, Form, Input } from "antd";
import { CiMenuKebab } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BoardEdit = ({ boardId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { data, isLoading: boardLoading } = useQuery({
    queryKey: ["boardId11", boardId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:https://to-do-backend-5w4r.onrender.com//api/boards`);

      const board = res.data.find((b) => b._id == boardId);

      return board; // faqat _id qaytadi
    },
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: async (upadtedData) => {
      const res = await axios.put(
        `http://localhost:https://to-do-backend-5w4r.onrender.com//api/boards/${boardId}`,
        upadtedData
      );
      return res.data;
    },
    onSuccess: (upadtedBoard) => {
      queryClient.invalidateQueries("boards");
      setOpen(false);
      // Cache ichida listlarni boshiga qo‘shamiz
      queryClient.setQueryData(["boards", boardId], (oldboards = []) => [
        upadtedBoard,
        ...oldboards,
      ]);
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };
  const onFinishFailed = (errorInfo) => {};

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
          background: "transparent",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "transparent",
          padding: "0",
        }}
        onClick={showDrawer}
      >
        <CiMenuKebab />
      </Button>
      <Drawer
        title="Basic Drawer"
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
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          initialValues={{ name: data?.name }}
        >
          <Form.Item
            label="Board Name"
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
export default BoardEdit;
