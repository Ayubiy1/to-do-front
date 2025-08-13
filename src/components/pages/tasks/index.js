import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Tasks = ({ listId }) => {
  const { data, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", listId],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/tasks");

      return res.data.filter((task) => task.listId === listId);
    },
    onSuccess: (data) => {},
  });

 
  return (
    <>
      {data?.map((task, index) => {
        return (
          <div key={index}>
            <h4>{task.name}</h4>
          </div>
        );
      })}
    </>
  );
};

export default Tasks;
