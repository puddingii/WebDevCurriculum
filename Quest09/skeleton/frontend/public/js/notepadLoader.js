import { MyWindow }  from "./classes/myWindow.js";

(async() =>{
    const testWindow = new MyWindow();
    await testWindow.initMyWindow();
})();