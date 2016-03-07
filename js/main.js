var app=angular.module('main', ['ngMaterial', 'main.services', 
	'main.inform', 'ngFileUpload', 'daypilot']);


app.controller('mainCtrl', ['$scope', '$rootScope', '$http', '$location', '$timeout', '$mdSidenav', '$window', 'services', 'informService', '$mdMedia', '$mdDialog', 
	function ($scope, $rootScope, $http, $location, $timeout, $mdSidenav, $window, services, informService, $mdMedia, $mdDialog) {
		'use strict';
		$scope.event_edition = null;
		$scope.editions;
		$scope.edition = null;
		$scope.menu = null;
		$scope.news = null;
		$scope.description = null;
		$scope.trainers = null;
		$scope.agenda = null;
		$scope.agendaElement = null;
		$scope.organizers = null;
		$scope.partners = null;
		$scope.mediaPartners = null;
		$scope.report = null;
		$scope.showNewsInfo = false;
		$scope.weekConfig = {
			viewType: "day",
			locale: 'pl-pl',
			days: 3,
			durationBarVisible: true,
			businessBeginsHour: 8,
			businessEndsHour: 17,
			timeFormat: 24,
			initScrollPos: 7,
			dragDrop: false,

			onEventClick: function(args) {
				showAgendaElement(args.e.id());
			}
		};
		

		$scope.$on('change.edition', function (event, value) {
			$scope.event_edition = value;
		});

		var showAgendaElement = function(id) {
			services.getAgendaElement($scope.event_edition, id)
			.success(function (data) {
				$scope.agendaElement = data;
				$scope.showAdvanced();
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania informacji o warsztacie');
			});
		}

		$scope.showAdvanced = function(ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'include/agendaElementDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: useFullScreen,
				locals: {
					agendaElement: $scope.agendaElement
				}
			});
			$scope.$watch(function() {
				return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
				$scope.customFullscreen = (wantsFullScreen === true);
			});
		};

		var getEditions = function() {
			services.getEditions()
			.success(function (data) {
				$scope.editions = data;
				$scope.event_edition = data[0].id;
				$scope.edition = data[0];
				$scope.edition.difDate = ($scope.edition.start_date !== $scope.edition.stop_date) ? true : false;
				$scope.edition.start_date = new Date(data[0].start_date);
				$scope.edition.stop_date = new Date(data[0].stop_date);
				$scope.weekConfig.startDate = $scope.edition.start_date;
				$scope.weekConfig.stopDate = $scope.edition.stop_date;
				$scope.weekConfig.stopDate = $scope.edition.stop_date - $scope.edition.start_date;
				getMenu();
			})
			.error(function () {
				informService.showAlert('Błąd', 'Nie pobrano informacji o edycjach wydarzenia');
			});
		};

		var getMenu = function() {
			services.getMenu($scope.event_edition)
			.success(function (data) {
				$scope.menu = data;
			})
			.error(function () {
				informService.showSimpleToast('Nie pobrano menu');
			});
		};

		var init = function() {
			getEditions();

		};

		init();

		$scope.getNewsList = function() {
			services.getNewsList($scope.event_edition)
			.success(function (data) {
				$scope.news = data;
				if ($scope.news.length === 0) {
					$scope.showNewsInfo = true;
				} else {
					$scope.showNewsInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania aktualności');
			});
		};

		$scope.getDescription = function() {
			services.getDescription($scope.event_edition)
			.success(function (data) {
				$scope.description = data.content;
				if ($scope.description === null) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
					document.getElementById('descriptionContainer').innerHTML = $scope.description;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania opisu wydarzenia');
			});
		};

		$scope.getTrainersList = function() {
			services.getTrainersList($scope.event_edition)
			.success(function (data) {
				$scope.trainers = data;
				if ($scope.trainers.length === 0) {
					$scope.showTrainersInfo = true;
				} else {
					$scope.showTrainersInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania informacji o trenerach');
			});
		};

		$scope.getAgendaList = function() {
			services.getAgendaList($scope.event_edition)
			.success(function (data) {
				$scope.agenda = data;
				if ($scope.agenda.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania programu wydarzenia');
			});
		};

		$scope.getOrganizers = function() {
			services.getOrganizers($scope.event_edition)
			.success(function (data) {
				$scope.organizers = data.content;
				if ($scope.organizers === null) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
					document.getElementById('organizersContainer').innerHTML = $scope.organizers;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania informacji o organizatorze');
			});
		};

		$scope.getPartners = function() {
			services.getPartnersList($scope.event_edition)
			.success(function (data) {
				$scope.partners = data;
				if ($scope.partners.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania informacji o partnerach wydarzenia');
			});
		};

		$scope.getMediaPartners = function() {
			services.getMediaPartnersList($scope.event_edition)
			.success(function (data) {
				$scope.mediaPartners = data;
				if ($scope.mediaPartners.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania informacji o patronach medialnych wydarzenia');
			});
		};
		
		$scope.getReport = function() {
			services.getReport($scope.event_edition)
			.success(function (data) {
				$scope.report = data.content;
				if ($scope.report === null) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
					document.getElementById('reportContainer').innerHTML = $scope.report;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania relacji z wydarzenia');
			});
		};

		var addUrl = function(text) {
			var urlRegex = /(uploads?\/[^\s]+)/g;
			return text.replace(urlRegex, function(url) {
				return 'cms/' + url;
			})

		};

	}]);

function DialogController($scope, $mdDialog, agendaElement) {
	$scope.agendaElement = agendaElement;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
}