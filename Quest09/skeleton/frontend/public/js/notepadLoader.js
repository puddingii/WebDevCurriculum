import { MyWindow }  from "./classes/myWindow.js";

(async() =>{
    const currentUserId = document.getElementById("currentUserId").innerText;
    const testWindow = new MyWindow(currentUserId);
    await testWindow.initMyWindow();
})();
$( function() {
    $(".sortable").sortable({
        items: "li.notetab"
    });
});