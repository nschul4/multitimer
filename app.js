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
                t: createDefaultDate(),
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
            if (timer.tInit) {
                if (!hasTimeLeft(timer.tDisplay)) {
                    timer.tDisplay = new Date(timer.tInit);
                }
            } else {
                timer.tDisplay = createDefaultDate();
            }
            timer.going = true;
        }

        $scope.reset = function (timer) {
            if (timer.tInit) {
                timer.tDisplay = new Date(timer.tInit);
            } else {
                timer.tDisplay = createDefaultDate();
            }
        }

        $scope.addHours = function (tDisplay, ms) {
            if (tDisplay) {
                var tmp = new Date(tDisplay);
                tDisplay.setTime(tmp.getTime() + ms);
            }
        }

        const refreshInterval = 77;
        $interval(function () {
            timerArr.forEach(function (timer) {
                var tmp = new Date(timer.tDisplay);
                if (timer.tDisplay && timer.going) {
                    timer.tDisplay.setTime(tmp.getTime() - refreshInterval);
                    if (!hasTimeLeft(timer.tDisplay)) {
                        timer.going = false;
                        timer.tDisplay = new Date(zeroDate);
                    }
                }
            });
        }, refreshInterval);

        function createZeroDate() {
            var tmp = new Date(0);
            tmp.setHours(-24);
            return tmp;

        }

        function createDefaultDate() {
            var defaultDate = createZeroDate();
            defaultDate.seconds = 1;
            return defaultDate;
        }

        function hasTimeLeft(t) {
            return t.getTime() > zeroDate.getTime();
        }
    }]);
