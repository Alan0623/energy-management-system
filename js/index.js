/*///////////////////////////////////////////////////////////
日期
///////////////////////////////////////////////////////////*/
$(function(){
    var Today=new Date();
    $( ".date" ).html("" + (Today.getFullYear()-1911)+ "/" + (Today.getMonth()+1) + "/" + Today.getDate() + " ");
});
/*///////////////////////////////////////////////////////////
時間
///////////////////////////////////////////////////////////*/
$(function () {
    var datetime = null,
        date = null;

    var update = function () {
        date = moment(new Date())
        //datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
        datetime.html(date.format('a h:mm'));
    };

    $(document).ready(function () {
        datetime = $(".time")
        update();
        setInterval(update, 1000);
    });
});