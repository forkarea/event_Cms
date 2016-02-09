app.controller('dashboardCtrl', ['$scope', '$window', '$location', 'informService', 'settingsServices',
	function ($scope, $window, $location, informService, settingsServices) {
		'use strict';
		$scope.data = null;
		
		var getData = function() {
			settingsServices.getDataForDashboard($scope.event_edition)
			.success(function (data) {
				$scope.data = data;
			})
			.	error(function () {
				informService.showSimpleToast('Błąd pobrania danych');
			});
		};

		getData();

		$scope.openPage = function(url) {
			location.href = url;
		};

	}]);