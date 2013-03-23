// A JavaScript background task runs a specified JavaScript file.
// Update the tile at fixed interval 
(function () {
    "use strict";
    importScripts("amlich-hnd.js");

    // This function performs the background task activity.
    function doWork() {

        // The background task instance's activation parameters are available 
        // via Windows.UI.WebUI.WebUIBackgroundTaskInstance.current
        var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
        var notifications = Windows.UI.Notifications;
        var date = new Date();

        //Begin task
        displayTileNotification(date);
        backgroundTaskInstance.succeeded = true;

        // A JavaScript background task must call close when it is done.
        close();

        function displayTileNotification(date) {
            var currentSolarDay = date.getDate();
            var currentSolarMonth = date.getMonth() + 1;
            var currentSolarYear = date.getFullYear();
            //to lunar
            var lunarDate = getLunarDate(currentSolarDay, currentSolarMonth, currentSolarYear);
            var dayInfo = getDayInfoCompact(lunarDate.day, lunarDate.month, lunarDate.year, lunarDate.leap, lunarDate.jd, currentSolarDay, currentSolarMonth, currentSolarYear);

            // get a filled in version of the template by using getTemplateContent
            var tileXml = notifications.TileUpdateManager.getTemplateContent(notifications.TileTemplateType.tileWideText04);

            // get the text attributes for this template and fill them in
            var tileAttributes = tileXml.getElementsByTagName("text");

            tileAttributes[0].appendChild(tileXml.createTextNode(dayInfo));

            // create the notification from the XML
            var tileNotification = new notifications.TileNotification(tileXml);

            // send the notification to the app's default tile
            notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
        }
    }

    // Start the doWork() function to do background task work.
    doWork();
})();
