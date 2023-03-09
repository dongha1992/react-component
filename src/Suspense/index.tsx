import { Suspense } from "react";
import { useQuery } from "react-query";
import { getProductsApi } from "../api/apiClient";

function useUser() {
  return useQuery(
    `getUser`,
    () => {
      return getProductsApi();
    },
    { suspense: true }
  );
}

const UserDropDown = () => {
  const { data } = useUser();

  return (
    <div>
      {data?.map((a) => (
        <div>{a?.title}</div>
      ))}
    </div>
  );
};

function SuspenseTest() {
  return (
    <div>
      <Suspense fallback={<h1>Loading profile...</h1>}>
        SuspenseTest
        <UserDropDown />
      </Suspense>
    </div>
  );
}

export default SuspenseTest;
