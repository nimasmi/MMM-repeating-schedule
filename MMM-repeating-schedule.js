Module.register("MMM-weekly-schedule",{

    defaults: {
        headerText: "",
        displaySymbol: true,
        defaultSymbol: "cutlery", // Fontawesome Symbol see http://fontawesome.io/cheatsheet/
        startDay: 0, // today
        maxResultLength: 2,
        maxDaysAhead: 2,
        maxWidth: null,
        showBlankDays: false,
        blankDayText: "",
        updateInterval: 1 * 60 * 60 * 1000, // 1 hour
    },

    start: function() {
        var self = this;
        self.buildDates();
        setInterval(function() {
            self.updateDom();
        }, self.config.updateInterval);
    },

    buildDates: function() {
        var self = this;
        self.eventDict = {};
        for (var key in self.config.dates) {
            if (self.config.dates.hasOwnProperty(key)) {
                var eventArray = self.config.dates[key];
                for (var i = 0; i < eventArray.length; i++) {
                    var eventDate = new Date(key);
                    eventDate.setDate(eventDate.getDate() + i);
                    self.eventDict[moment(eventDate).format('YYYYMMDD')] = eventArray[i];
                }
            }
        }
    },

    getDom: function() {
        var self = this;
        var wrapper = document.createElement("div");
        var todayKey = moment().format('YYYYMMDD');
        if (self.config.headerText) {
            var header = document.createElement("header");
            header.innerHTML = self.config.headerText;
            wrapper.appendChild(header);
        }

        var eventTable = document.createElement("table");
        eventTable.className = "small";

        for (
                var resultLength = 0, daysAhead = 0;
                resultLength < self.config.maxResultLength && self.config.startDay + daysAhead <= self.config.maxDaysAhead;
                daysAhead++
            ) {
            
            var targetDate = moment(todayKey).add(self.config.startDay + daysAhead, 'days');
            var targetDateKey = targetDate.format('YYYYMMDD');
            var eventText = self.eventDict[targetDateKey];

            if (eventText || self.config.showBlankDays === true) {
                var eventRow = document.createElement("tr");
                eventRow.className = "normal";

                if (this.config.displaySymbol) {
                    var symbolWrapper =  document.createElement("td");
                    symbolWrapper.className = "symbol";
                    var symbol =  document.createElement("span");
                    symbol.className = "fa fa-" + this.config.defaultSymbol;
                    symbolWrapper.appendChild(symbol);
                    eventRow.appendChild(symbolWrapper);
                }

                var timeWrapper =  document.createElement("td");
                if (self.config.startDay + daysAhead === 0) {
                    timeWrapper.innerHTML = this.translate("TODAY");
                } else if (self.config.startDay + daysAhead == 1) {
                    timeWrapper.innerHTML = this.translate("TOMORROW");
                } else {
                    timeWrapper.innerHTML = targetDate.format('dddd D MMM');
                }

                var titleWrapper = document.createElement("td");
                titleWrapper.innerHTML = eventText;
                if (resultLength === 0) {
                    timeWrapper.className = "time bright";
                    titleWrapper.className = "bright";
                } else {
                    timeWrapper.className = "time";
                }

                eventRow.appendChild(timeWrapper);
                eventRow.appendChild(titleWrapper);

                eventTable.appendChild(eventRow);
                resultLength++;
            }
        }
        wrapper.appendChild(eventTable);
        return wrapper;
    },

    getStyles: function() {
        return [
            'MMM-weekly-schedule.css',
        ];
    }
});
