import { ReduxProvider } from "app/store/Provider";

const Content = () => {
  return <div>AddNewAccount</div>;
};

export const AddNewAccount = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
