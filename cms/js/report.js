app.controller('reportCtrl', ['$scope', '$rootScope', '$window', 'informService', 'reportService', '$mdDialog',
	function ($scope, $rootScope, $window, informService, reportService, $mdDialog) {
		'use strict';
		$scope.htmlReport = null;
		$scope.htmlReportOrginal = null;
		$scope.photoList = null;
		$scope.id = null;

		var getReport = function() {
			reportService.getReport($scope.event_edition)
			.success(function (data) {
				$scope.htmlReport = data.content;
				$scope.htmlReportOrginal = data.content;
				$scope.id = data.id;
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych');
			});
		};

		var getReportPhotoList = function() {
			reportService.getReportPhotoList($scope.event_edition)
			.success(function (data) {
				$scope.photoList = data;
				if ($scope.photoList.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych o zdjęciach');
			});
		}

		getReport();
		getReportPhotoList();

		$scope.save = function() {
			var msg = 'Czy zapisać zmiany w relacji z wydarzenia?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				reportService.updateReport($scope.htmlReport, $scope.id, $scope.event_edition)
				.success(function () {
					informService.showSimpleToast('Dane zostały zaktualizowane');
					getReport();
				})
				.error(function () {
					informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
				});
			}, function() {
			});
		};

		$scope.$on("$locationChangeStart", function(event, next, current) {
			var currentArray = current.split("/");
			if (currentArray[currentArray.length - 1] === 'report' && $scope.htmlReport !== $scope.htmlReportOrginal) {
				$scope.save();
			}
        });

        $rootScope.$on('new.report.photo', function () {
			getReportPhotoList();	
		});

		$scope.removeReportPhoto = function(photo) {
			var msg = 'Czy usunąć zdjęcie "' + photo.url + '"?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				reportService.removeReportPhoto(photo.id, $scope.event_edition)
				.success(function (data) {
					informService.showSimpleToast('Usunięto zdjęcie "' + photo.url + '"');
					getReportPhotoList();
				}
				).error(function (data) {
					informService.showAlert('Błąd', data.message);
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.report', '');
		};
	}]);