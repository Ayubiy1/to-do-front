import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TaskEdit from "./edit-task";

const Tasks = ({ listId }) => {
  const { data, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", listId],
    queryFn: async () => {
      const res = await axios.get(
        "https://to-do-backend-5w4r.onrender.com/api/tasks"
      );

      return res.data.filter((task) => task.listId === listId);
    },
    onSuccess: (data) => {},
  });

  return (
    <>
      {data?.map((task, index) => {
        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              // background: "rgb(0, 21, 41)",
              // color: "white",
              margin: "4px 0",
              height: "50px",
              borderRadius: "6px",
            }}
          >
            <h4>{task.name}</h4>

            <TaskEdit taskId={task?._id} listId={listId} />
          </div>
        );
      })}
    </>
  );
};

export default Tasks;
