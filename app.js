'use strict';

// eslint-disable-next-line no-undef
angular.module('myApp', ['LocalStorageModule'])

    .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('multitimer');
    }])

    .controller("myCtrl", ['$scope', '$interval', 'localStorageService', function ($scope, $interval, localStorageService) {

        var defaultTimerArr = [
            {
                name: "foo",
                durationInit: createDurationDefault(),
                going: true,
            },
            {
                name: "3 minutes",
                durationInit: createDurationMinutes(3)
            },
        ];

        const LOCAL_STORAGE_KEY = "multitimer";

        function getTimerArr() {
            var timerArr = $scope.timerArr;
            if (timerArr == null) {
                var storedTimerArr;
                storedTimerArr = localStorageService.get(LOCAL_STORAGE_KEY);
                if (storedTimerArr == null) {
                    localStorageService.set(LOCAL_STORAGE_KEY, defaultTimerArr);
                    timerArr = defaultTimerArr;
                } else {
                    timerArr = storedTimerArr;
                }
            }
            return timerArr;
        }

        const zeroDate = createDurationZero();
        $scope.zeroDate = zeroDate;

        $scope.timerArr = getTimerArr();

        $scope.createTimer = function () {
            const timerArr = getTimerArr();
            timerArr.push({
                name: "",
                durationInit: createDurationDefault(),
                durationDisplay: createDurationDefault(),
                going: false,
            });
            localStorageService.set(LOCAL_STORAGE_KEY, timerArr);
        }

        $scope.remove = function (index) {
            if (confirm("Confirm:\n    remove timer \""
                + getTimerArr()[index].name
                + "\"\n        ?")
            ) {
                const timerArr = getTimerArr();
                timerArr.splice(index, 1);
                localStorageService.set(LOCAL_STORAGE_KEY, timerArr);
            }
        }

        $scope.stop = function (timer) {
            timer.going = false;
        }

        $scope.start = function (timer) {
            if (timer.going === true) {
                return;
            }

            if ("durationInit" in timer) {
                timer.durationDisplay = Object.assign({}, timer.durationInit);
            } else {
                timer.durationDisplay = createDurationDefault();
            }

            const bumpedDate = createBumpedDate(timer.durationDisplay);
            timer.tFinal = bumpedDate.getTime();

            timer.going = true;

            const timerArr = getTimerArr();
            localStorageService.set(LOCAL_STORAGE_KEY, timerArr);

            console.log("start", timer);
        }

        $scope.reset = function (timer) {
            if ("durationInit" in timer) {
                timer.durationDisplay = Object.assign({}, timer.durationInit);
            } else {
                timer.durationDisplay = createDurationDefault();
            }

            if (timer.going) {
                const bumpedDate = createBumpedDate(timer.durationDisplay);
                timer.tFinal = bumpedDate.getTime();
            }

            const timerArr = getTimerArr();
            localStorageService.set(LOCAL_STORAGE_KEY, timerArr);

            console.log("reset", timer);
        }

        function createBumpedDate(timer) {
            const newDate = new Date();
            newDate.setHours(newDate.getHours() + timer.hours);
            newDate.setMinutes(newDate.getMinutes() + timer.minutes);
            newDate.setSeconds(newDate.getSeconds() + timer.seconds);
            return newDate;
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

        $scope.addMsToTimer = function (timer, ms) {
            timer.tFinal += ms;
        }

        $scope.addMsToDuration = function (duration, ms) {
            const tmp = msToTimerObj(ms);
            duration.hours += tmp.hours;
            duration.minutes += tmp.minutes;
            duration.seconds += tmp.seconds;
            duration.ms += tmp.ms;
        }

        const refreshInterval = 103;
        $interval(function () {
            getTimerArr().forEach(function (timer) {
                if (timer.going) {
                    const nowDate = new Date();
                    const nowMs = nowDate.getTime();
                    const timeRemaining = timer.tFinal - nowMs;
                    if (timeRemaining > 0) {
                        const tmp = msToTimerObj(timeRemaining);
                        timer.durationDisplay.hours = tmp.hours;
                        timer.durationDisplay.minutes = tmp.minutes;
                        timer.durationDisplay.seconds = tmp.seconds;
                        timer.durationDisplay.ms = tmp.ms;
                    } else {
                        timer.going = false;
                        timer.durationDisplay = zeroDate;
                        const timerArr = getTimerArr();
                        localStorageService.set(LOCAL_STORAGE_KEY, timerArr);
                        console.log("done", timer);
                    }
                }
            });
        }, refreshInterval);

        function createDurationZero() {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0,
                ms: 0,
            };
        }

        function createDurationDefault() {
            var defaultDate = createDurationZero();
            defaultDate.seconds = 5;
            return defaultDate;
        }

        function createDurationMinutes(minutes) {
            var defaultDate = createDurationZero();
            defaultDate.minutes = minutes;
            return defaultDate;
        }
    }]);
