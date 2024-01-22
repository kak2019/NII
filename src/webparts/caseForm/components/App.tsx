/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useEffect } from "react";
import { useCases } from "../../../common/hooks/useCases";
import { CaseStatus } from "../../../common/features/cases/casesSlice";
import { Alert, Spin } from "antd";
import * as React from "react";
import CaseFormView from "./caseformview/index";
import styles from "./CaseForm.module.scss";
import { usePackagings } from "../../../common/hooks/usePackagings";

export default memo(function App() {
  const [
    isFetching,
    errorMessage,
    ,
    currentCaseId,
    ,
    ,
    ,
    changeCaseId,
    fetchCaseById,
    ,
    fetchConsequensesByCase,
  ] = useCases();
  const [, , , , , removePackagingById] = usePackagings();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function waitForData() {
      // eslint-disable-next-line no-constant-condition
      fetchCaseById(Number(currentCaseId));
      await delay(1000);
      fetchConsequensesByCase(Number(currentCaseId));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    waitForData().catch(console.error);
  }, [currentCaseId]);
  const isLoading = isFetching === CaseStatus.Loading;
  const onClickButton = async (): Promise<void> => {
    changeCaseId("1");
    console.log(currentCaseId);
    await removePackagingById({ Id: 5 });
  };
  return (
    <>
      <button onClick={onClickButton}>Test</button>
      {isLoading && (
        <Spin tip="Loading...">
          <Alert
            className={styles.alertStyle}
            message=""
            description=""
            type="info"
          />
        </Spin>
      )}
      {errorMessage?.length !== 0 && (
        <Alert
          message="Error"
          description={errorMessage}
          type="error"
          showIcon
        />
      )}
      {!(errorMessage?.length !== 0) && !isLoading && <CaseFormView />}
    </>
  );
});
