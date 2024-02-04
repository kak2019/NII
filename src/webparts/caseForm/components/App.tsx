import { ArrowLeftOutlined } from "@ant-design/icons";
import { memo, useEffect } from "react";
import { useCases } from "../../../common/hooks/useCases";
import { CaseStatus } from "../../../common/features/cases/casesSlice";
import { Alert, Col, Divider, Row, Spin } from "antd";
import * as React from "react";
import CaseFormView from "./caseformview/index";
import styles from "./CaseForm.module.scss";
import "./App.css";
import AppContext from "../../../common/AppContext";
export default memo(function App() {
  const [
    isFetching,
    errorMessage,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    initialCaseForm,
    changeCaseId,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
  ] = useCases();
  const [initial, setInitial] = React.useState(false);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const params = new URLSearchParams(window.location.search);
    const id = params.get("caseid");
    console.log(id);
    changeCaseId(id);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function waitForData() {
      setInitial(true);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        initialCaseForm(Number(id));
        await delay(1000);
        break;
      }
      setInitial(false);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    waitForData().catch(console.error);
  }, []);
  const appContext = React.useContext(AppContext);
  const isLoadingCase = isFetching === CaseStatus.Loading;
  return (
    <div className={styles.listWrapper}>
      <Row align="middle">
        <Col offset={2}>
          <a
            href={`${appContext.context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`}
          >
            <ArrowLeftOutlined rev={undefined} />
            <span>Return to home</span>
          </a>
        </Col>
      </Row>
      <Row>
        <Col offset={2} span={20}>
          {(isLoadingCase || initial) && (
            <Spin tip="Loading...">
              <Alert
                className={styles.alertStyle}
                message=""
                description=""
                type="info"
              />
            </Spin>
          )}
          {errorMessage?.length !== 0 && !initial && (
            <Alert
              message="Error"
              description={errorMessage}
              type="error"
              showIcon
            />
          )}
          {errorMessage?.length === 0 && !isLoadingCase && !initial && (
            <CaseFormView />
          )}
        </Col>
      </Row>
      <Divider />
    </div>
  );
});
