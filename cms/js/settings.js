app.controller('settingsCtrl', ['$scope', '$window', 'informService', 'settingsServices',
	function ($scope, $window, informService, settingsServices) {
		'use strict';
		$scope.listMenu = null;
		$scope.menuPositions = [1,2,3,4,5,6,7,8,9,10];

		var getMenuList = function() {
			settingsServices.getMenuList($scope.event_edition)
			.success(function (data) {
				$scope.listMenu = data;
			})
			.	error(function () {
				informService.showSimpleToast('Błąd pobrania danych o menu');
			});
		};

		getMenuList();
		
		$scope.saveChenges = function() {
			var len = $scope.listMenu.length;
            for (var i=0;i<len;i++) {
				for (var j=0;j<len;j++) {
					if ($scope.listMenu[i].public_name === $scope.listMenu[j].public_name
					&& $scope.listMenu[i].position === $scope.listMenu[j].position
					&& j !== i)
					{
						informService.showSimpleToast('Błędne dane');
						return;
					}
				}
			}
			var data = [];
			for (var i=0;i<len;i++) {
				var elem = new Array($scope.listMenu[i].name, $scope.listMenu[i].public_name,$scope.listMenu[i].position,$scope.listMenu[i].visibility, $scope.listMenu[i].title, $scope.listMenu[i].id);
				data.push(elem);
			}
			settingsServices.saveMenuList(data, $scope.event_edition)
			.success(function (data) {
				getMenuList();
				informService.showSimpleToast('Zapisano zmiany');
			})
			.	error(function () {
				informService.showSimpleToast('Błąd zapisu danych o menu');
			});
		}

	}]);