import * as React from "react";
import { memo ,useContext} from "react";
// import { Button } from 'antd';
import AppContext from "../../../common/AppContext";
import 'antd/dist/antd.css';
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackStyles } from "@fluentui/react/lib/Stack";
// import { DefaultPalette } from "@fluentui/react/lib/Styling";
import styles from "./HomePage.module.scss";
import Receive from "../assets/receive";
import CaseList from '../assets/caseList';
import PackagedList from '../assets/packagedList';
import "./App.css";
// import background from "../assets/Background.png"
export default memo(function App() {
  const ctx = useContext(AppContext);
  const webURL = ctx.context?._pageContext?._web?.absoluteUrl;
  const stackStyles: IStackStyles = {
    root: {
      marginBottom: 0,
      width: "370px",
    },
  };

  const btnMainTitle: React.CSSProperties = {
    lineHeight: 1,
    display: 'block',
    fontWeight: 600,
    color: "#4D4E53",
    fontSize: "18px",
    textAlign: 'left',
    flexGrow: 1,
    marginLeft: '10px'
  }

  const btnSubTitle: React.CSSProperties = {
    marginTop: '3px',
    fontSize: '12px',
    fontWeight: 'normal'
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.header}/>
      <div className={styles.main}>
        <div className={styles.firstMask}/>
        <div className={styles.secondMask}/>

        <div className={styles.content}>
          <div className={styles.title}>Applying logistics procedure</div>
            <Stack enableScopedSelectors styles={stackStyles}>
              <div className={styles.section}>
                <Stack enableScopedSelectors horizontal horizontalAlign="start">

                  <DefaultButton
                    // style={{display:"none"}}
                    className={styles.homePageButton}
                    onRenderIcon={() => {
                      return <Receive />
                    }}
                    onRenderText={
                      () => <div style={btnMainTitle}>
                        <div>Create Case</div>
                        <div style={btnSubTitle}>Create a new case application</div>
                      </div>
                    }
                    href={`${webURL ? webURL + "/" : ""}sitepages/Upload.aspx`}
                  />

                </Stack>
              </div>
            </Stack>

            <Stack enableScopedSelectors styles={stackStyles}>
              <div className={styles.section}>
                <Stack enableScopedSelectors horizontal horizontalAlign="start">

                  <DefaultButton
                    // style={{display:"none"}}
                    className={styles.homePageButton}
                    onRenderIcon={() => {
                      return <CaseList />
                    }}
                    onRenderText={
                      () => <div style={btnMainTitle}>
                        <div>Case List</div>
                        <div style={btnSubTitle}>view all case history</div>
                      </div>
                    }
                    href={`${webURL ? webURL + "/" : ""}sitepages/CaseList.aspx`}
                  />

                </Stack>
              </div>
            </Stack>

            <Stack enableScopedSelectors styles={stackStyles}>
              <div className={styles.section}>
                <Stack enableScopedSelectors horizontal horizontalAlign="start">

                <DefaultButton
                    // style={{display:"none"}}
                    className={styles.homePageButton}
                    onRenderIcon={() => {
                      return <PackagedList />
                    }}
                    onRenderText={
                      () => <div style={btnMainTitle}>
                        <div>Package List</div>
                        <div style={btnSubTitle}>view all package history</div>
                      </div>
                    }
                    href={`${webURL ? webURL + "/" : ""}sitepages/PackageList.aspx`}
                  />

                </Stack>
              </div>
            </Stack>

            <div style={{
              height: '100%',
              marginTop: '242px',
              color: "white",
              fontSize: '65px',
              position: 'absolute',
              top: 0,
              textAlign: 'right',
              right: '43px'
            }}>Smart and Modern </div>
             <div style={{
              height: '100%',
              marginTop: '302px',
              color: "white",
              fontSize: '65px',
              position: 'absolute',
              top: 0,
              textAlign: 'right',
              right: '215px'
            }}>Our Logistics </div>
        </div>
      </div>
    </div>
  )


})
