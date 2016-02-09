app.controller('descriptionNewCtrl', ['$scope', '$rootScope', 'informService', 'Upload', '$timeout',
	function ($scope, $rootScope, informService, Upload, $timeout) {
		'use strict';
		$scope.photo = null;
		$scope.myDate = new Date();

	
		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wybierz zdjęcie');
				return false;
			}  else {
				return true;
			}
		};

		$scope.save = function(form) {
			if (validForm(form)) {
				if (!angular.isString($scope.photo) && angular.isDefined($scope.photo) && $scope.photo !== null) {
					$scope.uploadPhoto($scope.photo, form);
				}	
			}
		};	
			
		$scope.reset = function(form) {
			if (form) {
				$scope.progress = 0;
				$scope.photo = null;
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.description', function (event, value) {
			$scope.reset($scope.newPhoto);
		});

		$scope.close = function(form) {
			$scope.reset(form);
			$scope.closeRight();
		};

		$scope.uploadPhoto = function(file, form) {
			var domain = window.location.href.indexOf('index.html');
			domain = window.location.href.slice(0, domain);
			file.upload = Upload.upload({
				url: 'uploadDescriptionPhoto',
				file: file,
				fields: {
					username: localStorage.getItem('Username'),
					session_id: localStorage.getItem('SessionID'),
					domain: domain,
					edition: $scope.event_edition
				},
			});

			file.upload.then(function (response) {
				$timeout(function () {
					$rootScope.$emit('new.description.photo', '');
					informService.showSimpleToast('Zdjęcie zostało zapisane.');
					$scope.close($scope.newPhoto);
				});
			}, function (response) {
				if (response.status === 306) {
					informService.showSimpleToast('Zdjęcie nie zostało zapisane. ' +
						response.data.error);
				} else {
					informService.showSimpleToast('Zdjęcie nie zostało zapisane.');
				}
			}, function (evt) {
				$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		};

	}]);