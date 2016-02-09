app.controller('trainerNewCtrl', ['$scope', '$rootScope', 'trainersService', '$mdDialog', 'informService', 'Upload', '$timeout', 
	function ($scope, $rootScope, trainersService, $mdDialog, informService, Upload, $timeout) {
		'use strict';
		$scope.trainer = {};
		$scope.isEdit = false;
		$scope.progress = 0;

		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			}  else {
				return true;
			}
		};	

		$rootScope.$on('trainer.to.edit', function (event, value) {
			$scope.reset($scope.newTrainer);
			$scope.trainer = value;
			$scope.isEdit = true;
		});

		$scope.save = function(form) {
			if (validForm(form)) {
				trainersService.addNewTrainer($scope.event_edition, $scope.trainer)
				.success(function (data) {
					$scope.trainer.id = data.trainer_id;
					informService.showSimpleToast('Nowy trener został dodany');
					if (!angular.isString($scope.trainer.photo) && angular.isDefined($scope.trainer.photo) && $scope.trainer.photo !== null) {
						$scope.uploadPhoto($scope.trainer.photo, form);
					} else {
						$rootScope.$emit('new.trainer', '');
					}	
					$scope.close(form);
				})
				.error(function () {
					informService.showAlert('Błąd', 'Nie dodano nowego trenera');
				});
			}
		};

		$scope.saveChanges = function(form) {
			var msg = 'Czy zapisać zmiany dla trenera ' + $scope.trainer.first_name + ' ' + $scope.trainer.last_name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				if (validForm(form)) {
					trainersService.changeTrainer($scope.trainer)
					.success(function () {
						informService.showSimpleToast('Dane zostały zaktualizowane');
						if (!angular.isString($scope.trainer.photo) && angular.isDefined($scope.trainer.photo) && $scope.trainer.photo !== null) {
							$scope.uploadPhoto($scope.trainer.photo, form);
						} else {
							$rootScope.$emit('edit.trainer', '');
						}						
						$scope.close(form);
					})
					.error(function () {
						informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
					});
				}
			}, function() {
			});
		};
		
		$scope.reset = function(form) {
			if (form) {
				$scope.isEdit = false;
				$scope.progress = 0;
				$scope.trainer = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.trainer', function (event, value) {
			$scope.reset($scope.newtrainer);
		});

		$scope.close = function(form) {	
			$scope.reset(form);
			$scope.closeRight();
		};

		$scope.uploadPhoto = function(file, form) {
			file.upload = Upload.upload({
				url: 'uploadTrainerPhoto',
				file: file,
				fields: {
					username: localStorage.getItem('Username'),
					session_id: localStorage.getItem('SessionID'),
					trainer_id: $scope.trainer.id,
					edition: $scope.event_edition
				},
			});

			file.upload.then(function (response) {
				$timeout(function () {
					$rootScope.$emit('edit.trainer', '');
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