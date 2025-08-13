import React from "react";
import { Button, Form, Input } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ListAdd = ({ boardId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (newListData) => {
      const res = await axios.post(
        "http://localhost:3000/api/lists",
        newListData
      );
      return res.data.list;
    },
    onSuccess: (newList) => {
      // Cache ichida listlarni boshiga qo‘shamiz
      queryClient.setQueryData(["lists", boardId], (oldLists = []) => [
        newList,
        ...oldLists,
      ]);
      form.resetFields();
    },
  });

  const onFinish = (values) => {
    mutate({ name: values.name, boardId });
  };

  return (
    <Form
      form={form}
      style={{
        width: 333,
        marginTop: "22px",
        padding: "20px 20px 0 20px",
        textAlign: "end",
        backgroundColor: "#001529",
        borderRadius: "6px",
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: "List nomini kiriting!" }]}
      >
        <Input placeholder="List nomi kiriting!" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Qo‘shish
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ListAdd;

// import React, { use } from "react";
// import { Button, Checkbox, Form, Input } from "antd";
// import { useMutation } from "@tanstack/react-query";

// const ListAdd = ({ boardId }) => {
//   console.log("Board ID:", boardId);

//   const { mutate } = useMutation({
//     mutationFn: async (newListData) => {
//       const res = await axios.post(
//         "http://localhost:3000/api/lists",
//         newListData
//       );
//       return res.data.list;
//     },
//   });

//   const onFinish = (values) => {
//     console.log("Success:", values);
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };

//   return (
//     <>
//       <Form
//         name="basic"
//         style={{
//           width: 333,
//           marginTop: "22px",
//           padding: "20px 20px 0 20px",
//           textAlign: "end",
//           backgroundColor: "#001529",
//           borderRadius: "6px",
//         }}
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         <Form.Item
//           name="username"
//           rules={[{ required: true, message: "List nomini kiriting!" }]}
//         >
//           <Input placeholder="List nomi kiriting!" />
//         </Form.Item>

//         <Form.Item label={null}>
//           <Button type="primary" htmlType="submit">
//             Qo'shish
//           </Button>
//         </Form.Item>
//       </Form>
//     </>
//   );
// };
// export default ListAdd;
