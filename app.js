'use strict';

angular.module('myApp', [])

    .controller("myCtrl", ['$scope', '$interval', function ($scope, $interval) {

        var timerArr = [
            {
                name: "mudville",
                t: new Date(0),
                going: true,
            },
            {
                name: "the main road",
                t: new Date(0),
            },
            {
                name: "shamus",
            },
        ];
        $scope.timerArr = timerArr;

        $scope.createTimer = function () {
            timerArr.push({});
        }

        $scope.remove = function (index) {
            console.log(index);
            if (confirm("TODO: present confirmation dialog")) {
                timerArr.splice(index, 1);
            }
        }

        $scope.stop = function (timer) {
            timer.going = false;
        }
        $scope.start = function (timer) {
            timer.going = true;
        }

        $scope.addHours = function (timer, ms) {
            if (timer.t) {
                var tmp = new Date(timer.t);
                timer.t.setTime(tmp.getTime() + ms);
            }
        }

        var refreshInterval = 77;
        $interval(function () {
            timerArr.forEach(function (timer) {
                var tmp = new Date(timer.t);
                if (timer.t && timer.going) {
                    timer.t.setTime(tmp.getTime() - refreshInterval);
                    tmp.getMilliseconds();
                    tmp.getSeconds();
                }
            });
        }, refreshInterval);
    }]);
