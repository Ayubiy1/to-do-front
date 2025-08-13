import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Card, Col, Input, Form, Row } from "antd";

import "./lists.css";
import ListAdd from "./list-add";
import Tasks from "../tasks";
import { useState } from "react";

const ListPage = () => {
  const { name } = useParams();
  const [taskName, setTaskName] = useState(null);

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
  const { mutate: addTask, isLoading: addTaskLoading } = useQuery({
    queryKey: ["addTask"],
    queryFn: async (newTask) => {
      const res = await axios.post("http://localhost:3000/api/tasks", newTask);
      return res.data;
    },
  });

  if (boardLoading || listsLoading) return <p>Loading...</p>;

  return (
    <>
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
                <Form className="add-task">
                  <Form.Item>
                    <Input
                      placeholder="edit Task name"
                      rules={[
                        { required: true, message: "Task nomini kiriting!" },
                      ]}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        console.log(list?._id);
                        console.log(taskName);
                      }}
                      type="primary"
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Form>

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

