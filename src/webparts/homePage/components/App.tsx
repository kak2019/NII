import * as React from "react";
import { memo } from "react";
// import { Button } from 'antd';
// import AppContext from "../../../common/AppContext";
import 'antd/dist/antd.css';
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackStyles } from "@fluentui/react/lib/Stack";
import { DefaultPalette } from "@fluentui/react/lib/Styling";
import styles from "./HomePage.module.scss";
import Receive from "../assets/receive";
export default memo(function App() {
  // const test_click = (): void => {
  //     alert("111")
  // }
  const stackStyles: IStackStyles = {
    root: {
      background: DefaultPalette.white,
      margin: 0,
    },
  };
  return (
    <>
      {/* 看到就是成功
        <Button type="primary" onClick={test_click}>Primary Button</Button>
        <Button type="dashed">Default Button</Button> */}

      <Stack enableScopedSelectors styles={stackStyles}>
        <div className={styles.section}>
          <div className={styles.parttitle}>Create New Case</div>
          <Stack enableScopedSelectors horizontal horizontalAlign="start">

            <DefaultButton
              text="Create Case"
              // style={{display:"none"}}
              className={styles.homePageButton}
              onRenderIcon={() => {
                return <Receive />
              }}
            />

          </Stack>
        </div>
      </Stack>

      <Stack enableScopedSelectors styles={stackStyles}>
        <div className={styles.section}>
          <div className={styles.parttitle}>Cases List</div>
          <Stack enableScopedSelectors horizontal horizontalAlign="start">

            <DefaultButton
              text="View All Case"
              // style={{display:"none"}}
              className={styles.homePageButton}
              onRenderIcon={() => {
                return <Receive />
              }}
            />

          </Stack>
        </div>
      </Stack>

      <Stack enableScopedSelectors styles={stackStyles}>
        <div className={styles.section}>
          <div className={styles.parttitle}>Packaging List</div>
          <Stack enableScopedSelectors horizontal horizontalAlign="start">

            <DefaultButton
              text="View All Packaging"
              // style={{display:"none"}}
              className={styles.homePageButton}
              onRenderIcon={() => {
                return <Receive />
              }}
            />

          </Stack>
        </div>
      </Stack>
    </>
  )


})
