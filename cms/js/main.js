var app=angular.module('main', ['ui.router', 'ngMaterial', 'main.directives', 
	'main.trainersFactory', 'login.loginFactory', 'main.userFactory', 'main.inform',
	'main.agendaFactory', 'main.editionFactory', 'main.partnerFactory', 'main.newsFactory',
	'main.settingsFactory', 'main.reportFactory', 'main.organizersFactory', 'main.descriptionFactory',
	'ngFileUpload', 'textAngular']);

app.controller('navigationCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$location', '$mdSidenav', 
	'$log', '$window', 'loginService', 'editionService', 'informService', 
	function ($scope, $rootScope, $http, $timeout, $location, $mdSidenav, $log, $window, loginService, editionService, informService) {
		'use strict';
		$scope.userInfo = '';
		$scope.event_edition = null;
		$scope.event_edition_start_date = null;
		$scope.event_edition_stop_date = null;
		$scope.editions;

		var clearLocStorageGoLogin = function() {
			localStorage.removeItem('Username');
			localStorage.removeItem('TimeStamp');
			localStorage.removeItem('SessionID');
			$window.location.href = 'login.html';
		};

		$scope.logout = function() {
			loginService.logout()
			.success(function () {
				clearLocStorageGoLogin();
			})
			.error(function () {
				clearLocStorageGoLogin();
			});
		};

		$scope.$on('change.edition', function (event, value) {
			$scope.event_edition = value.id;
			$scope.event_edition_start_date = value.start_date;
			$scope.event_edition_stop_date = value.stop_date;
			$window.location.href = '#/dashboard';
		});

		var getEditions = function() {
			editionService.getEditions()
			.success(function (data) {
				$scope.editions = data;
				if ($scope.editions.length === 0) {
					informService.showAlert('Wskazówka', 'Aby rozpocząć tworzenie strony wydarzenia przejdź do zakładki Edycje i dodaj nową edycję.');
				} else {
					$scope.event_edition = data[0].id;
					$scope.event_edition_start_date = data[0].start_date;
					$scope.event_edition_stop_date = data[0].stop_date;
				}
			})
			.error(function () {
				informService.showAlert('Błąd', 'Nie pobrano informacji o edycjach wydarzenia');
			});
		}

		$rootScope.$on('new.edition', function () {
			getEditions();	
		});
		
		var init = function() {
			loginService.isUserLogged()
			.success(function (data) {
				if(data.isLoggedIn) {
					$scope.userInfo = data.first_name + ' ' + data.last_name;
					getEditions();
				}
				else {
					clearLocStorageGoLogin();
				}
			})
			.error(function () {
				clearLocStorageGoLogin();
			});
		};

		init();

		$rootScope.$on('edit.profile', function (event, value) {
			$scope.userInfo = value;
		});

		$scope.closeLeft = function () {
			$mdSidenav('left').close()
			.then(function () {
			});
		};

		$scope.closeRight = function () {
			$mdSidenav('right').close()
			.then(function () {
			});
		};

		$scope.toggleLeft = buildDelayedToggler('left');
		$scope.toggleRight = buildToggler('right');

		$scope.isOpenRight = function(){
			return $mdSidenav('right').isOpen();
		};

		$scope.isActive = function (path) {
			if ($location.path().substr(0, path.length) === path) {
				return true;
			} else {
				return false;
			}
		}

		function debounce(func, wait) {
			var timer;
			return function debounced() {
				var context = $scope,
				args = Array.prototype.slice.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}

		function buildDelayedToggler(navID) {
			return debounce(function() {
				$mdSidenav(navID)
				.toggle()
				.then(function () {

				});
			}, 200);
		}

		function buildToggler(navID) {
			return function() {
				$mdSidenav(navID)
				.toggle()
				.then(function () {

				});
			}
		};

	}]);

app.config(function($stateProvider, $urlRouterProvider) {
	'use strict';
	$urlRouterProvider.otherwise('/dashboard');
	$stateProvider
	.state('index', {
		url: '/dashboard',
		views: {
			'contentView': { templateUrl: 'include/dashboard.html' },
			'rightView': { templateUrl: 'include/empty.html' }
		}
	})
	.state('news', {
		url: '/news',
		views: {
			'contentView': { templateUrl: 'include/news.html' },
			'rightView': { templateUrl: 'include/newsNew.html' }
		}
	})
	.state('description', {
		url: '/description',
		views: {
			'contentView': { templateUrl: 'include/description.html' },
			'rightView': { templateUrl: 'include/descriptionNew.html' }
		}
	})
	.state('trainers', {
		url: '/trainers',
		views: {
			'contentView': { templateUrl: 'include/trainers.html' },
			'rightView': { templateUrl: 'include/trainerNew.html' }
		}
	})
	.state('agenda', {
		url: '/agenda',
		views: {
			'contentView': { templateUrl: 'include/agenda.html' },
			'rightView': { templateUrl: 'include/agendaNew.html' }
		}
	})
	.state('organizers', {
		url: '/organizers',
		views: {
			'contentView': { templateUrl: 'include/organizers.html' },
			'rightView': { templateUrl: 'include/organizersNew.html' }
		}
	})
	.state('partners', {
		url: '/partners',
		views: {
			'contentView': { templateUrl: 'include/partners.html' },
			'rightView': { templateUrl: 'include/partnerNew.html' }
		}
	})
	.state('mediaPartners', {
		url: '/mediaPartners',
		views: {
			'contentView': { templateUrl: 'include/mediaPartners.html' },
			'rightView': { templateUrl: 'include/mediaPartnerNew.html' }
		}
	})
	.state('report', {
		url: '/report',
		views: {
			'contentView': { templateUrl: 'include/report.html' },
			'rightView': { templateUrl: 'include/reportNew.html' }
		}
	})
	.state('dictionaries', {
		url: '/dictionaries',
		views: {
			'contentView': { templateUrl: 'include/dictionaries.html' },
			'rightView': { templateUrl: 'include/empty.html' }
		}
	})
	.state('settings', {
		url: '/settings',
		views: {
			'contentView': { templateUrl: 'include/settings.html' },
			'rightView': { templateUrl: 'include/empty.html' }
		}
	})
	.state('users', {
		url: '/users',
		views: {
			'contentView': { templateUrl: 'include/users.html' },
			'rightView': { templateUrl: 'include/userNew.html' }
		}
	})
	.state('editions', {
		url: '/editions',
		views: {
			'contentView': { templateUrl: 'include/editions.html' },
			'rightView': { templateUrl: 'include/editionNew.html' }
		}
	})
	.state('profile', {
		url: '/profile',
		views: {
			'contentView': { templateUrl: 'include/profile.html' },
			'rightView': { templateUrl: 'include/empty.html' }
		}
	})
	.state('changePassword', {
		url: '/changePassword',
		views: {
			'contentView': { templateUrl: 'include/changePassword.html' },
			'rightView': { templateUrl: 'include/empty.html' }
		}
	})
	.state('editionNew', {
		url: '/editionNew',
		views: {
			'contentView': { templateUrl: 'include/editionNew.html' },
			'rightView': { templateUrl: 'include/empty.html' }
		}
	});
});

app.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień',
	'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik',
	'Listopad', 'Grudzień'];
	$mdDateLocaleProvider.shortMonths = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień',
	'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik',
	'Listopad', 'Grudzień'];
  	$mdDateLocaleProvider.days = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 
  	'czwartek', 'piątek', 'sobota'];
  	$mdDateLocaleProvider.shortDays = ['niedz', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'];
  	$mdDateLocaleProvider.firstDayOfWeek = 1;
  	$mdDateLocaleProvider.msgCalendar = 'Kalendarz';
  	$mdDateLocaleProvider.msgOpenCalendar = 'Otwórz kalendarz';
});