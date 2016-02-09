app.controller('newsCtrl', ['$scope', '$rootScope', '$mdDialog', 'newsService', 'informService',
	function ($scope, $rootScope, $mdDialog, newsService, informService) {
		'use strict';
		$scope.newsList = null;

		$scope.showInfo = false;
		var getNewsList = function() {
			newsService.getNewsList($scope.event_edition)
			.success(function (data) {
				$scope.newsList = data;
				if ($scope.newsList.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania danych o wiadomościach');
			});
		};

		getNewsList();

		$rootScope.$on('new.news', function () {
			getNewsList();	
		});

		$rootScope.$on('edit.news', function () {
			getNewsList();	
		});
		
		$scope.removeNews = function(news) {
			var msg = 'Czy usunąć wiadomość "' + news.title + '"?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				newsService.removeNews(news.id)
				.success(function (data) {
					informService.showSimpleToast('Usunięto wiadomość "' + news.title + '"');
					getNewsList();
				}
				).error(function (data) {
					informService.showAlert('Błąd', data.message);
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.news', '');
		};

		$scope.editNews = function(news) {
			$rootScope.$emit('news.to.edit', angular.copy(news));
			$scope.toggleRight();
		};

	}]);