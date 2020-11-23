'use strict';

// eslint-disable-next-line no-undef
angular.module('myApp', [])

    .controller("myCtrl", ['$scope', '$interval', function ($scope, $interval) {

        const zeroDate = createZeroDate();
        $scope.zeroDate = zeroDate;

        const timerArr = [
            {
                name: "mudville",
                tInit: createDefaultDate(),
                tDisplay: createDefaultDate(),
                going: true,
            },
            {
                name: "the main road",
                tInit: createDefaultDate(),
                tDisplay: createDefaultDate(),
            },
        ];
        $scope.timerArr = timerArr;

        $scope.createTimer = function () {
            timerArr.push({
                name: "",
                tInit: createDefaultDate(),
                tDisplay: createDefaultDate(),
                going: false,
            });
        }

        $scope.remove = function (index) {
            if (confirm("Confirm:\n    remove timer \""
                + timerArr[index].name
                + "\"\n        ?")
            ) {
                timerArr.splice(index, 1);
            }
        }

        $scope.stop = function (timer) {
            timer.going = false;
        }

        $scope.start = function (timer) {
            if (timer.going === true) {
                return;
            }

            if ("tInit" in timer) {
                timer.tDisplay = Object.assign({}, timer.tInit);
            } else {
                timer.tDisplay = createDefaultDate();
            }

            const dateToBump = new Date();
            dateToBump.setHours(dateToBump.getHours() + timer.tDisplay.hours);
            dateToBump.setMinutes(dateToBump.getMinutes() + timer.tDisplay.minutes);
            dateToBump.setSeconds(dateToBump.getSeconds() + timer.tDisplay.seconds);
            timer.tFinal = dateToBump.getTime();

            timer.going = true;

            console.log("start", timer);
        }

        $scope.reset = function (timer) {
            if ("tInit" in timer) {
                timer.tDisplay = Object.assign({}, timer.tInit);
            } else {
                timer.tDisplay = createDefaultDate();
            }

            if (timer.going) {
                const dateToBump = new Date();
                dateToBump.setHours(dateToBump.getHours() + timer.tDisplay.hours);
                dateToBump.setMinutes(dateToBump.getMinutes() + timer.tDisplay.minutes);
                dateToBump.setSeconds(dateToBump.getSeconds() + timer.tDisplay.seconds);
                timer.tFinal = dateToBump.getTime();
            }

            console.log("reset", timer);
        }

        function msToTimerObj(ms) {
            var hours = Math.floor(ms / 1000 / 60 / 60);
            ms -= hours * 1000 * 60 * 60;

            var minutes = Math.floor(ms / 1000 / 60);
            ms -= minutes * 1000 * 60;

            var seconds = Math.floor(ms / 1000);
            ms -= seconds * 1000;

            return {
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                ms: ms,
            }
        }

        $scope.addMs = function (timer, ms) {
            const tmp = msToTimerObj(ms);
            timer.hours += tmp.hours;
            timer.minutes += tmp.minutes;
            timer.seconds += tmp.seconds;
            timer.ms += tmp.ms;
        }

        const refreshInterval = 77;
        $interval(function () {
            timerArr.forEach(function (timer) {
                if (timer.going) {
                    const nowDate = new Date();
                    const nowMs = nowDate.getTime();
                    const timeRemaining = timer.tFinal - nowMs;
                    if (timeRemaining > 0) {
                        const tmp = msToTimerObj(timeRemaining);
                        timer.tDisplay.hours = tmp.hours;
                        timer.tDisplay.minutes = tmp.minutes;
                        timer.tDisplay.seconds = tmp.seconds;
                        timer.tDisplay.ms = tmp.ms;
                    } else {
                        timer.going = false;
                        timer.tDisplay = zeroDate;
                        console.log("done", timer);
                    }
                }
            });
        }, refreshInterval);

        function createZeroDate() {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0,
                ms: 0,
            };
        }

        function createDefaultDate() {
            var defaultDate = createZeroDate();
            defaultDate.seconds = 1;
            return defaultDate;
        }
    }]);
