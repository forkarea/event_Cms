app.controller('usersCtrl', ['$scope', '$rootScope', '$window', '$filter', '$mdDialog', 'usersService', 'informService',
	function ($scope, $rootScope, $window, $filter, $mdDialog, usersService, informService) {
		'use strict';
		$scope.isAdmin = false;
		$scope.userLogged = localStorage.getItem('Username');
		$scope.users = null;
		$scope.showInfo = false;
		$scope.userRole = localStorage.getItem('UserRole');
		var getUsersList = function() {
			usersService.getUsersList()
			.success(function (data) {
				$scope.users = data;
				if ($scope.users.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania danych o użytkownikach');
			});
		};
		
		getUsersList();
		
		$scope.$on('new.user', function() {
			getUsersList();
		});

		$rootScope.$on('edit.user', function () {
			getUsersList();	
		});

		var isAdmin = function() {
			if (angular.isDefined($scope.userRole)) {
				if ($scope.userRole === 'a') {
					$scope.isAdmin = true;
				} else {
					$scope.isAdmin = false;
				}
			} else {
				$scope.isAdmin = false;
			}
		};
		isAdmin();
		
		$scope.removeUser = function(id, username){
			if(username === $scope.userLogged || $scope.userRole !== 'a') {
				informService.showAlert('Błąd', 'Nie można usunąć użytkownika');
			} else {
				var msg = 'Czy usunąć użytkownika ' + username + '?';
				$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(
					function(){
						usersService.removeUser(id, username)
						.success(function () {
							informService.showSimpleToast('Użykownik o nazwie ' + username + ' został usunięty');
							getUsersList();
						})
						.error(function (data, status) {
							if (status === 404) {
								informService.showAlert('Błąd', 'Nie znaleziono użytkownika ' + username);
							} else {
								informService.showAlert('Błąd', 'Usunięcie użytkownika nie powiodło się');
							}
						});
					});
			}
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.user', '');
		};

		$scope.editUser = function(user) {
			$rootScope.$emit('user.to.edit', angular.copy(user));
			$scope.toggleRight();
		};

	}]);