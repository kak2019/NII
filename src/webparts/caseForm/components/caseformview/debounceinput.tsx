import React, { useState, useEffect, memo } from "react";
import { debounce } from "lodash";
import { Input } from "antd";
import styles from "../CaseForm.module.scss";

interface Props {
  onPackagingChange: (
    e: number | string,
    inputKey: React.Key,
    field: string
  ) => void;
  defaultValue: string;
  inputKey: React.Key;
  field: string;
  readonly: boolean;
}

const DebouncedInputCommon: React.FC<Props> = memo(
  ({ onPackagingChange, defaultValue, inputKey, field, readonly }) => {
    const [inputValue, setInputValue] = useState(defaultValue);

    const debouncedSave = debounce((nextValue) => {
      onPackagingChange(nextValue, inputKey, field);
    }, 1000);

    useEffect(() => {
      debouncedSave(inputValue);
      return debouncedSave.cancel;
    }, [inputValue]);

    return (
      <div>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.halfLength}
          readOnly={readonly}
          bordered={!readonly}
        />
      </div>
    );
  }
);

export default DebouncedInputCommon;
