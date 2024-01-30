/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useEffect } from "react";
import { useCases } from "../../../common/hooks/useCases";
import { CaseStatus } from "../../../common/features/cases/casesSlice";
import { Alert, Spin } from "antd";
import * as React from "react";
import CaseFormView from "./caseformview/index";
import styles from "./CaseForm.module.scss";
export default memo(function App() {
  const [
    isFetching,
    errorMessage,
    currentCase,
    currentCaseId,
    packagingNeeds,
    receivingPlant,
    consequenses,
    packagingData,
    contractFiles,
    originalFiles,
    changeCaseId,
    fetchCaseById,
    editCase,
    fetchConsequensesByCase,
    fetchPackagingNeedsByCase,
    editPackagingNeed,
    addPackagingNeed,
    removePackagingNeedsById,
    fetchReceivingPlantByCase,
    fetchPackagingData,
    fetchContractFileById,
    fetchOriginalFileById,
    uploadFile,
  ] = useCases();
  const [initial, setInitial] = React.useState(false);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function waitForData() {
      setInitial(true);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        fetchCaseById(Number(currentCaseId));
        await delay(1000);
        fetchConsequensesByCase(Number(currentCaseId));
        await delay(1000);
        fetchPackagingNeedsByCase(Number(currentCaseId));
        await delay(1000);
        fetchReceivingPlantByCase(Number(currentCaseId));
        await delay(1000);
        fetchPackagingData();
        await delay(1000);
        fetchContractFileById(Number(currentCaseId));
        await delay(1000);
        fetchOriginalFileById(Number(currentCaseId));
        break;
      }
      setInitial(false);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    waitForData().catch(console.error);
  }, [currentCaseId]);
  const isLoadingCase = isFetching === CaseStatus.Loading;
  const onClickButton = async (): Promise<void> => {
    changeCaseId("1");
  };
  return (
    <>
      <button onClick={onClickButton}>Test</button>
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
      {errorMessage?.length !== 0 && (
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
    </>
  );
});
