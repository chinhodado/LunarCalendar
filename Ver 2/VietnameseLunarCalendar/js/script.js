function liveTile(cal) {
    var Notifications = Windows.UI.Notifications;

    // Get an XML DOM version of a specific template by using getTemplateContent.
    var tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquareText01);

    // You will need to look at the template documentation to know how many text fields a particular template has.
    // Get the text attribute for this template and fill it in.
    var tileAttributes = tileXml.getElementsByTagName("text");

    //the solar stuffs
    var currentSolarDay = cal.today.getDate();
    var currentSolarMonth = cal.getMonth();
    var currentSolarYear = cal.getYear();
    //to lunar
    var lunarDate = getLunarDate(currentSolarDay, currentSolarMonth, currentSolarYear);

    tileAttributes[0].innerText = lunarDate.day + "/" + lunarDate.month;
    tileAttributes[1].innerText = "hello world!";

    // Create the notification from the XML.
    var tileNotification = new Notifications.TileNotification(tileXml);

    // Send the notification to the calling app's tile.
    Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
}

function displayLunar(cal) {
    var currentYear = cal.getYear();
    var currentMonth = zeroFill(cal.getMonth(), 2);//string with leading zeros
    var timeZone = 7;//GMT +7: Hanoi
    var dayArray = new Array(32);//solar array
    var lunarArray = new Array(32);
    var obj = {};
    var numday = 28;
    if (currentYear % 4 != 0 && currentMonth == '02') numday = 28;
    else if (currentYear % 4 == 0 && currentMonth == '02') numday = 29;
    else if (currentMonth == '01' || currentMonth == '03' || currentMonth == '05' || currentMonth == '07' || currentMonth == '08' || currentMonth == '10' || currentMonth == '12') numday = 31;
    else numday = 30;
    for (var i = 1; i <= numday; i++) {
        var j = zeroFill(i, 2);
        dayArray[i] = currentMonth + '-' + j + '-' + currentYear;
        lunarArray[i] = getLunarDate(i, cal.getMonth(), currentYear);
        obj[dayArray[i]] = lunarArray[i].day + '/' + lunarArray[i].month;
        cal.setData(obj);
    }
}

function setLunarInfo(cal) {
    var currentYear = cal.getYear();
    var currentMonth = zeroFill(cal.getMonth(), 2);//string with leading zeros
    var timeZone = 7;//GMT +7: Hanoi
    var dayArray = new Array(32);//solar array
    var lunarArray = new Array(32);
    var obj = {};
    var numday = 28;
    if (currentYear % 4 != 0 && currentMonth == '02') numday = 28;
    else if (currentYear % 4 == 0 && currentMonth == '02') numday = 29;
    else if (currentMonth == '01' || currentMonth == '03' || currentMonth == '05' || currentMonth == '07' || currentMonth == '08' || currentMonth == '10' || currentMonth == '12') numday = 31;
    else numday = 30;
    for (var i = 1; i <= numday; i++) {
        var j = zeroFill(i, 2);
        dayArray[i] = currentMonth + '-' + j + '-' + currentYear;
        lunarArray[i] = getLunarDate(i, cal.getMonth(), currentYear);
        obj[dayArray[i]] = getDayInfo(lunarArray[i].day, lunarArray[i].month, lunarArray[i].year, lunarArray[i].leap, lunarArray[i].jd, i, currentMonth, currentYear);
        cal.setData(obj);
    }
}

//add zeros to beginning of number
function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

//register a background task
function registerBackgroundTask(taskEntryPoint, taskName, trigger, condition) {

    // Check for existing registrations of this background task.
    var taskRegistered = false;
    var background = Windows.ApplicationModel.Background;
    var iter = background.BackgroundTaskRegistration.allTasks.first();
    var hascur = iter.hasCurrent;

    while (hascur) {
        var cur = iter.current.value;
        if (cur.name === taskName) {
            taskRegistered = true;
            break;
        }
        hascur = iter.moveNext();
    }

    // If the task is already registered, return the registration object.
    if (taskRegistered == true) {
        return iter.current;
    }

    // Register the background task.
    var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();
    builder.name = taskName;
    builder.taskEntryPoint = taskEntryPoint;
    builder.setTrigger(trigger);

    if (condition !== null) {
        builder.addCondition(condition);
    }

    var task = builder.register();
    return task;
}

function convertMonthToWord(number){
    if (number == 1) return "January"
    else if (number == 2) return "February"
    else if (number == 3) return "March"
    else if (number == 4) return "April"
    else if (number == 5) return "May"
    else if (number == 6) return "June"
    else if (number == 7) return "July"
    else if (number == 8) return "August"
    else if (number == 9) return "September"
    else if (number == 10) return "October"
    else if (number == 11) return "November"
    else if (number == 12) return "December"
}