import React, { useState } from "react";
import { Button, Checkbox, Drawer, Dropdown, Form, Input, Space } from "antd";
import { CiMenuKebab } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

const TaskEdit = ({ taskId, listId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { data, isLoading: listLoading } = useQuery({
    queryKey: ["task-edit-query", listId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/api/tasks/${taskId}`);

      // const list = res.data.find((b) => b._id == listId);

      return res; // faqat _id qaytadi
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (upadtedData) => {
      const res = await axios.put(
        `http://localhost:3000/api/tasks/${taskId}`,
        upadtedData
      );
      return res.data;
    },
    onSuccess: (upadtedBoard) => {
      queryClient.invalidateQueries("tasks");
      setOpen(false);
      // Cache ichida listlarni boshiga qo‘shamiz
      queryClient.setQueryData(["tasks", taskId], (oldTasks = []) => [
        upadtedBoard,
        ...oldTasks,
      ]);
    },
  });

  const onFinish = (values) => {
    mutate({ ...values, listId });
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <Button onClick={showDrawer} style={{ width: "100%" }}>
          Edit
        </Button>
      ),
    },
    {
      key: "2",
      label: <Button>Delate</Button>,
      disabled: true,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button onClick={(e) => e.preventDefault()}>
          <Space>
            <CiMenuKebab />
          </Space>
        </Button>
      </Dropdown>
      {/* <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "transparent",
          padding: "0",
        }}
        onClick={showDrawer}
      >
        <CiMenuKebab />
      </Button> */}
      <Drawer
        title="Edit Task"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
          initialValues={{ name: data?.data?.name }}
        >
          <Form.Item
            label="Task Name"
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
export default TaskEdit;
