'use strict';

angular.module('myApp', [])

    .controller("myCtrl", ['$scope', '$interval', function ($scope, $interval) {

        var zeroDate = createZeroDate();
        $scope.zeroDate = zeroDate;

        var timerArr = [
            {
                name: "mudville",
                tInit: createDefaultDate(),
                t: createDefaultDate(),
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
                t: createDefaultDate(),
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
                if (!hasTimeLeft(timer.t)) {
                    timer.t = new Date(timer.tInit);
                }
            } else {
                timer.t = createDefaultDate();
            }
            timer.going = true;
        }

        $scope.reset = function (timer) {
            if (timer.tInit) {
                timer.t = new Date(timer.tInit);
            } else {
                timer.t = createDefaultDate();
            }
        }

        $scope.addHours = function (t, ms) {
            if (t) {
                var tmp = new Date(t);
                t.setTime(tmp.getTime() + ms);
            }
        }

        var refreshInterval = 77;
        $interval(function () {
            timerArr.forEach(function (timer) {
                var tmp = new Date(timer.t);
                if (timer.t && timer.going) {
                    timer.t.setTime(tmp.getTime() - refreshInterval);
                    if (!hasTimeLeft(timer.t)) {
                        timer.going = false;
                        timer.t = new Date(zeroDate);
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
            var tmp = createZeroDate();
            // tmp.setMinutes(10);
            tmp.setSeconds(1);
            return tmp;
        }

        function hasTimeLeft(t) {
            return t.getTime() > zeroDate.getTime();
        }
    }]);
