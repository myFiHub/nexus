import { DatePicker } from "rsuite";

export const DateAndTimePicker = () => {
  const handleChange = (date: Date | null) => {
    console.log(date);
  };
  return <DatePicker format="MM/dd/yyyy HH:mm" onChange={handleChange} />;
};
