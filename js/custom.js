$(document).ready(function () {

    // Make Date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    var today = dd+'/'+mm+'/'+yyyy;
    $('#date').val(today);

    // Init Material Design
    $.material.init();

    // Adding dropdown script to select tags
    $("#tasks").dropdown({"optionClass": "biplane_options"});
    $("#projects").dropdown({"optionClass": "biplane_options"});

    // Adding Date Picker
    $('#date').bootstrapMaterialDatePicker(
        {
            weekStart : 0,
            nowButton: true,
            format: 'DD/MM/YYYY',
            lang : 'ru',
            time: false,
            switchOnClick: true
        }
    );

    // Adding Date Picker
    $('#timeTo').bootstrapMaterialDatePicker(
        {
            weekStart : 0,
            nowButton: false,
            format : 'HH:mm',
            lang : 'ru',
            date: false,
            shortTime: true,
            switchOnClick: true
        }
    ).on('change', function() {
        var hoursTo = parseInt( $('#timeTo').val().substr(0,2) );
        var minutesTo = parseInt( $('#timeTo').val().substr(3,4) );

        $('#info').html("<i class='material-icons'>access_time</i>" + hoursTo + " h and " + minutesTo + " min.");
    });

    // Adding Date Picker
    $('#timeFrom').bootstrapMaterialDatePicker(
        {
            weekStart : 0,
            format : 'HH:mm',
            lang : 'ru',
            date: false
        }).on('change', function(e, date) {
        $('#timeTo').bootstrapMaterialDatePicker('setMinDate', date);
    });

    // Making Object holder
    var dataContainer = {
        projectName: "1",
        taskName: "2",
        dateFrom: "3",
        dateTo: "4",
        description: "5"
    };

    // Changing data inside 'dataContainer' object
    function addToDataObject(dataContainer) {
        var project = $("#projects option:selected").text();
        var task = $("#tasks option:selected").text();
        var timeTo = $("#timeTo").val();
        var description = $("#description").val();

        var dateYear = $("#date").val().substr(6,10);
        var dateMonth = $("#date").val().substr(3,2);
        var dateDay = $("#date").val().substr(0,2);

        var date = dateYear + "-" + dateMonth + "-" + dateDay;

        dataContainer.projectName = project;
        dataContainer.taskName = task;
        dataContainer.dateFrom = date + " 00:00";
        dataContainer.dateTo = date + " " + timeTo;
        dataContainer.description = description;
        console.log(dataContainer);
    }

    $('textarea, input, select').on('change', function(){
        addToDataObject(dataContainer);
    });

    $('#submitCalendar').click(function(){
        $('#successbox').fadeIn('slow').delay('3000').fadeOut('slow');
    });

    // Bitrix API
    BX24.init(function(){

        app.displayCurrentUser('#user-name');
        app.showProjects('#projects');
        app.sendToCalendar('#submitCalendar', dataContainer);

    });



});