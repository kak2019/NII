import * as React from "react";
import {  memo } from "react";
import { Button } from 'antd';
// import AppContext from "../../../common/AppContext";


export default memo(function App() {
const test_click=():void=>{
    alert("111")
}
return (<>看到就是成功
<Button type="primary" onClick={test_click}>Primary Button</Button>
    <Button>Default Button</Button></>)


})
