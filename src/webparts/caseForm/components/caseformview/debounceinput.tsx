/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { Input } from "antd";

interface DebouncedInputProps {
  value: string;
  onBlur: (value: string) => void;
  readOnly: boolean;
  bordered: boolean;
}

// Your debounce function here
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timerId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onBlur,
  readOnly,
  bordered,
}) => {
  const [localValue, setLocalValue] = React.useState(value);

  // Create a debounced version of onBlur
  const debouncedOnBlur = React.useCallback(
    debounce((value: string) => {
      onBlur(value);
    }, 500),
    [onBlur]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    debouncedOnBlur(e.target.value);
  };

  return (
    <Input
      defaultValue={value}
      onChange={handleChange}
      readOnly={readOnly}
      bordered={bordered}
    />
  );
};

export default DebouncedInput;
