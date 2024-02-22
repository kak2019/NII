import React, { useState, useEffect } from "react";
import { Modal, Spin, Alert } from "antd";
import styles from "../PackageList.module.scss";

interface LoadingModalProps {
  isShow: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isShow }) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    let intervalId: number;

    if (isShow) {
      intervalId = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length < 3) {
            return prevDots + ".";
          } else {
            return ".";
          }
        });
      }, 500); // Change the dots every second
    }

    // Clean up the interval on unmount or when isShow becomes false
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isShow]);

  return (
    <Modal
      open={isShow}
      closable={false}
      footer={null}
      width={500}
      style={{ borderRadius: "6px", overflow: "hidden", paddingBottom: 0 }}
    >
      <Spin
        tip={`Download in progress, please wait for a few seconds${dots}`}
        className={styles.iconwrapper}
      >
        <Alert
          className={styles.alertStyle}
          message=""
          description=""
          type="info"
        />
      </Spin>
    </Modal>
  );
};

export default LoadingModal;
