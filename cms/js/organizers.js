app.controller('organizersCtrl', ['$scope', '$rootScope', '$window', 'informService', 'organizersService', '$mdDialog',
	function ($scope, $rootScope, $window, informService, organizersService, $mdDialog) {
		'use strict';
		$scope.htmlOrganizers = null;
		$scope.htmlOrganizersOrginal = null;
		$scope.photoList = null;
		$scope.id = null;
		
		var getOrganizers = function() {
			organizersService.getOrganizers($scope.event_edition)
			.success(function (data) {
				$scope.htmlOrganizers = data.content;
				$scope.htmlOrganizersOrginal = data.content;
				$scope.id = data.id;
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych');
			});
		};
		var getOrganizersPhotoList = function() {
			organizersService.getOrganizersPhotoList($scope.event_edition)
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

		getOrganizers();
		getOrganizersPhotoList();

		$scope.save = function() {
			var msg = 'Czy zapisać zmiany w opisie organizatorów?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				organizersService.updateOrganizers($scope.htmlOrganizers, $scope.id, $scope.event_edition)
				.success(function () {
					informService.showSimpleToast('Dane zostały zaktualizowane');
					getOrganizers();
				})
				.error(function () {
					informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
				});
			}, function() {
			});
		};
		
		$scope.$on("$locationChangeStart", function(event, next, current) {
			var currentArray = current.split("/");
			if (currentArray[currentArray.length - 1] === 'organizers' && $scope.htmlOrganizers !== $scope.htmlOrganizersOrginal) {
				$scope.save();
			}
        });
		
		$rootScope.$on('new.organizers.photo', function () {
			getOrganizersPhotoList();	
		});

		$scope.removeOrganizersPhoto = function(photo) {
			var msg = 'Czy usunąć zdjęcie "' + photo.url + '"?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				organizersService.removeOrganizersPhoto(photo.id, $scope.event_edition)
				.success(function (data) {
					informService.showSimpleToast('Usunięto zdjęcie "' + photo.url + '"');
					getOrganizersPhotoList();
				}
				).error(function (data) {
					informService.showAlert('Błąd', data.message);
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.organizers', '');
		};
	}]);