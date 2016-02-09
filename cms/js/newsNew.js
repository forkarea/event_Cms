app.controller('newsNewCtrl', ['$scope', '$rootScope', '$mdDialog', 'newsService', 'informService', 'Upload', '$timeout',
	function ($scope, $rootScope, $mdDialog, newsService, informService, Upload, $timeout) {
		'use strict';
		$scope.isEdit = false;
		$scope.news = {};
		$scope.myDate = new Date();
		$scope.minDate = new Date(
			$scope.myDate.getFullYear(),
			$scope.myDate.getMonth(),
			$scope.myDate.getDate() - 5);
		$scope.maxDate = new Date(
			$scope.myDate.getFullYear(),
			$scope.myDate.getMonth() + 1,
			$scope.myDate.getDate());

		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			}  else {
				return true;
			}
		};

		$rootScope.$on('news.to.edit', function (event, value) {
			$scope.reset($scope.newNews);
			$scope.news = value;
			$scope.news.date = new Date(value.date);
			$scope.isEdit = true;
		});

		$scope.save = function(form) {
			if (validForm(form)) {
				newsService.addNewNews($scope.event_edition, $scope.news)
				.success(function (data) {
					$scope.news.id = data.news_id;
					informService.showSimpleToast('Nowa wiadomość została dodana');
					if (!angular.isString($scope.news.photo) && angular.isDefined($scope.news.photo) && $scope.news.photo !== null) {
						$scope.uploadPhoto($scope.news.photo, form);
					} else {
						$rootScope.$emit('new.news', '');
					}	
					$scope.close(form);
				})
				.error(function () {
					informService.showAlert('Błąd', 'Nie dodano nowej wiadomości');
				});
			}
		};	

		$scope.saveChanges = function(form) {
			var msg = 'Czy zapisać zmiany dla wiadomości "' + $scope.news.title + '"?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				if (validForm(form)) {
					newsService.changeNews($scope.news)
					.success(function () {
						informService.showSimpleToast('Dane zostały zaktualizowane');
						if (!angular.isString($scope.news.photo) && angular.isDefined($scope.news.photo) && $scope.news.photo !== null) {
							$scope.uploadPhoto($scope.news.photo, form);
						} else {
							$rootScope.$emit('edit.news', '');
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
				$scope.news = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.news', function (event, value) {
			$scope.reset($scope.newNews);
		});

		$scope.close = function(form) {
			$scope.reset(form);
			$scope.closeRight();
		};

		$scope.uploadPhoto = function(file, form) {
			file.upload = Upload.upload({
				url: 'uploadNewsPhoto',
				file: file,
				fields: {
					username: localStorage.getItem('Username'),
					session_id: localStorage.getItem('SessionID'),
					news_id: $scope.news.id,
					edition: $scope.event_edition
				},
			});

			file.upload.then(function (response) {
				$timeout(function () {
					$rootScope.$emit('edit.news', '');
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