import React from "react";

function TodoList() {
  return (
    <div className="rounded-md bg-blue-600">
      <table className="w-full">
        <thead className=" text-white text-sm rounded-lg">
          <tr className="flex justify-between items-center px-6 py-4">
            <th>Todo</th>
            <th>Description</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody className="bg-blue-50">
          <tr className="flex justify-between items-center px-6 py-3">
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TodoList;
