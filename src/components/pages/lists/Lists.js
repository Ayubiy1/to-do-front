import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Card, Col, Input, Form, Row, message } from "antd";

import "./lists.css";
import ListAdd from "./list-add";
import Tasks from "../tasks";
import { useState } from "react";

const ListPage = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { name } = useParams();
  const [taskName, setTaskName] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "List add successfully",
    });
  };

  // 1. Boardni name orqali topib, faqat _id ni qaytarish
  const { data: boardId, isLoading: boardLoading } = useQuery({
    queryKey: ["boardId", name],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/api/boards`);
      const board = res.data.find((b) => b.name === name);
      if (!board) throw new Error("Board topilmadi");
      return board._id; // faqat _id qaytadi
    },
    enabled: !!name,
  });
  // 2. Board ID bo‘yicha listlarni olish
  const { data: lists, isLoading: listsLoading } = useQuery({
    queryKey: ["lists", boardId],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/lists");

      // Agar backend array qaytarsa
      const filtered = res.data.filter((list) => list.boardId === boardId);
      return filtered;
    },
    enabled: !!boardId, // boardId bo‘lmasa query ishlamaydi
  });
  // Add task
  const { mutate, isLoading: addTaskLoading } = useMutation({
    mutationFn: async (newTask) => {
      console.log("Yuborilayotgan ma'lumot:", newTask);
      const res = await axios.post("http://localhost:3000/api/tasks", newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
      success();
    },
  });

  const onFinish = (values) => {
    console.log("Formdan kelgan:", values);
    mutate(values);
    // form.resetFields(); // Agar submitdan keyin tozalash kerak bo‘lsa
  };

  if (boardLoading || listsLoading) return <p>Loading...</p>;

  return (
    <>
      {contextHolder}

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <ListAdd boardId={boardId} />
      </div>

      <Row gutter={[16, 16]} style={{ padding: "20px", width: "100%" }}>
        {lists?.map((list, index) => {
          return (
            <Col key={index} xs={24} sm={12} lg={8} xl={6}>
              <Card className="card">
                <h3>{list.name}</h3>
                <Form
                  className="add-task"
                  form={form}
                  onFinish={() => {
                    onFinish({
                      name: taskName,
                      listId: list?._id,
                      completed: false,
                    });
                  }}
                >
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Task nomini kiriting!" },
                    ]}
                  >
                    <Input
                      placeholder="edit Task name"
                      value={taskName}
                      onChange={(e) => {
                        setTaskName(e.target.value);
                      }}
                      onFocus={() => {
                        // Faqat birinchi marta fokus bo‘lganda tozalash
                        if (taskName) {
                          setTaskName("");
                          form.setFieldsValue({ taskName: "" });
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        onFinish({
                          name: taskName,
                          listId: list?._id,
                          completed: false,
                        });
                      }}
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Form>

                {/* <Form className="add-task" form={form} onFinish={onFinish}>
                  <Form.Item
                    name="taskName"
                    rules={[
                      { required: true, message: "Task nomini kiriting!" },
                    ]}
                  >
                    <Input
                      placeholder="edit Task name"
                      onChange={(e) => setTaskName(e.target.value)}
                      onClick={() => {
                        form.resetFields();
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={() => {
                      }}
                      type="primary"
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Form> */}

                <Tasks listId={list?._id} />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default ListPage;
