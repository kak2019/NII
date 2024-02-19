import React, { useState, useEffect, memo } from "react";
import { debounce } from "lodash";
import { Input } from "antd";
import styles from "../PackageList.module.scss";

interface Props {
  onValueChange: (value: string) => void;
  defaultValue: string;
  resetKey: string;
}

const DebouncedInputParma: React.FC<Props> = memo(
  ({ onValueChange, defaultValue, resetKey }) => {
    const [inputValue, setInputValue] = useState(defaultValue);

    const debouncedSave = debounce((nextValue) => {
      onValueChange(nextValue);
    }, 1000);

    useEffect(() => {
      debouncedSave(inputValue);
      return debouncedSave.cancel;
    }, [inputValue]);

    useEffect(() => {
      setInputValue("");
      debouncedSave(inputValue);
      return debouncedSave.cancel;
    }, [resetKey]);

    return (
      <div>
        <Input
          style={{
            borderRadius: "6px",
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.fullLength}
        />
      </div>
    );
  }
);

export default DebouncedInputParma;
