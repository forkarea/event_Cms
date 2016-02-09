app.controller('descriptionCtrl', ['$scope', '$rootScope', '$window', 'descriptionService', 'informService', '$mdDialog',
	function ($scope, $rootScope, $window, descriptionService, informService, $mdDialog) {
		'use strict';
		$scope.htmlDescription = null;
		$scope.htmlDescriptionOrginal = null;
		$scope.photoList = null;
		$scope.id = null;

		var getDescription = function() {
			descriptionService.getDescription($scope.event_edition)
			.success(function (data) {
				$scope.htmlDescription = data.content;
				$scope.htmlDescriptionOrginal = data.content;
				$scope.id = data.id;
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych');
			});
		};

		var getDescriptionPhotoList = function() {
			descriptionService.getDescriptionPhotoList($scope.event_edition)
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

		getDescription();
		getDescriptionPhotoList();

		$scope.save = function() {
			var msg = 'Czy zapisać zmiany w opisie?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				descriptionService.updateDescription($scope.htmlDescription, $scope.id, $scope.event_edition)
				.success(function () {
					informService.showSimpleToast('Dane zostały zaktualizowane');
					getDescription();
				})
				.error(function () {
					informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
				});
			}, function() {
			});
		};

		$scope.$on("$locationChangeStart", function(event, next, current) {
			var currentArray = current.split("/");
			if (currentArray[currentArray.length - 1] === 'report' && $scope.htmlDescription !== $scope.htmlDescriptionOrginal) {
				$scope.save();
			}
        });

        $rootScope.$on('new.description.photo', function () {
			getReportPhotoList();	
		});

		$scope.removeDescriptionPhoto = function(photo) {
			var msg = 'Czy usunąć zdjęcie "' + photo.url + '"?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				descriptionService.removeDescriptionPhoto(photo.id, $scope.event_edition)
				.success(function (data) {
					informService.showSimpleToast('Usunięto zdjęcie "' + photo.url + '"');
					getDescriptionPhotoList();
				}
				).error(function (data) {
					informService.showAlert('Błąd', data.message);
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.description', '');
		};

	}]);