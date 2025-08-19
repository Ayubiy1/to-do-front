import { Form, Input, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function AddListForm({ boardId }) {
  const [form] = Form.useForm(); // ✅ Form instance olish
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (newListData) => {
      console.log(newListData);

      const res = await axios.post(
        "https://to-do-backend-5w4r.onrender.com/api/lists",
        newListData
      );
      console.log(res);

      return res.data.list;
    },
    onSuccess: (newList) => {
      // ✅ Formni reset qilish
      form.resetFields();

      // Cache ichida listlarni boshiga qo‘shamiz
      queryClient.setQueryData(["lists", boardId], (oldLists = []) => [
        newList,
        ...oldLists,
      ]);
    },
  });

  const onFinish = (values) => {
    // console.log({ ...values, boardId });

    mutate({ ...values, boardId });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      // layout="inline"
      style={{
        width: 333,
        marginTop: "22px",
        padding: "20px 20px 0 20px",
        textAlign: "end",
        backgroundColor: "#001529",
        borderRadius: "6px",
      }}
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: "List nomini kiriting!" }]}
      >
        <Input placeholder="List nomi" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Qo‘shish
        </Button>
      </Form.Item>
    </Form>
  );
}

// import React from "react";
// import { Button, Form, Input } from "antd";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

// const ListAdd = ({ boardId }) => {
//   const queryClient = useQueryClient();
//   const [form] = Form.useForm();

//   const { mutate } = useMutation({
//     mutationFn: async (newListData) => {
//       const res = await axios.post(
//         "https://to-do-backend-5w4r.onrender.com/api/lists",
//         newListData
//       );
//       return res.data.list;
//     },
//     onSuccess: (newList) => {
//       form.resetFields();

//       // Cache ichida listlarni boshiga qo‘shamiz
//       queryClient.setQueryData(["lists", boardId], (oldLists = []) => [
//         newList,
//         ...oldLists,
//       ]);
//     },
//   });

//   const onFinish = (values) => {
//     mutate({ name: values.name, boardId });
//   };

//   return (
//     <Form
//       form={form}
//       style={{
//         width: 333,
//         marginTop: "22px",
//         padding: "20px 20px 0 20px",
//         textAlign: "end",
//         backgroundColor: "#001529",
//         borderRadius: "6px",
//       }}
//       onFinish={onFinish}
//     >
//       <Form.Item
//         name="name"
//         rules={[{ required: true, message: "List nomini kiriting!" }]}
//       >
//         <Input placeholder="List nomi kiriting!" />
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Qo‘shish
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default ListAdd;

// // import React, { use } from "react";
// // import { Button, Checkbox, Form, Input } from "antd";
// // import { useMutation } from "@tanstack/react-query";

// // const ListAdd = ({ boardId }) => {
// //   console.log("Board ID:", boardId);

// //   const { mutate } = useMutation({
// //     mutationFn: async (newListData) => {
// //       const res = await axios.post(
// //         "https://to-do-backend-5w4r.onrender.com/api/lists",
// //         newListData
// //       );
// //       return res.data.list;
// //     },
// //   });

// //   const onFinish = (values) => {
// //     console.log("Success:", values);
// //   };

// //   const onFinishFailed = (errorInfo) => {
// //     console.log("Failed:", errorInfo);
// //   };

// //   return (
// //     <>
// //       <Form
// //         name="basic"
// //         style={{
// //           width: 333,
// //           marginTop: "22px",
// //           padding: "20px 20px 0 20px",
// //           textAlign: "end",
// //           backgroundColor: "#001529",
// //           borderRadius: "6px",
// //         }}
// //         onFinish={onFinish}
// //         onFinishFailed={onFinishFailed}
// //       >
// //         <Form.Item
// //           name="username"
// //           rules={[{ required: true, message: "List nomini kiriting!" }]}
// //         >
// //           <Input placeholder="List nomi kiriting!" />
// //         </Form.Item>

// //         <Form.Item label={null}>
// //           <Button type="primary" htmlType="submit">
// //             Qo'shish
// //           </Button>
// //         </Form.Item>
// //       </Form>
// //     </>
// //   );
// // };
// // export default ListAdd;
