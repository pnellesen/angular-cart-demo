
describe('Home Controller Test Suite', function() {

	beforeEach(function(){
	    module('ngRoute');
	    module('ui.bootstrap');
	    module('ngResource');
	    module('ngAnimate');
	    module('mobileWebApp');
	});  
	
	var HomeController, scope;
	
	beforeEach(inject(function ($controller, $rootScope, $compile, $location,$httpBackend) {
		homeScope = $rootScope.$new();
		ele = angular.element('<div id="navbar" class="collapse navbar-collapse">' +
		          '<ul class="nav navbar-nav">' +
		            '<li ><a href="#!" active-link data-toggle="collapse" data-target=".navbar-collapse.in">Home</a></li>' +
		            '<li><a href="#!phones" active-link data-toggle="collapse" data-target=".navbar-collapse.in">Phones</a></li>' +
		            '<li><a href="#!plans" active-link data-toggle="collapse" data-target=".navbar-collapse.in">Plans</a></li>' +
		            '<li ><a href="#!cart" active-link data-toggle="collapse" data-target=".navbar-collapse.in">Cart</a></li>' +
		          '</ul>' +
		        '</div>');
		$compile(ele)(homeScope);
		homeScope.$digest();
		
		HomeController = $controller('HomeCtrl', {$scope: homeScope});
	}));
	

	
	it ('Expects slide interval to be 5000ms', function() {
		expect(homeScope.interval).toBe(5000);
	});
	it ('Expects slide array to be defined', function() {
		expect(homeScope.slides).toBeDefined();
	});
	it ('Expects slide array to initially have 0 elements', function() {
		expect(homeScope.slides.length).toBe(0);// We populate this from our phone factory, which will have a delay while it pulls from the server.
	});
	it('Phones Navbar <li> active class should be set when route = "/plans"', inject(function($location,$httpBackend) {
		$httpBackend.when('GET','').respond([]);//This fixes weird bug when we set the $location.path() because we've already done a GET in a previous test. 
		$location.path('/plans');
		homeScope.$digest();
		var targetEl = angular.element(ele.find('li')[2]);//This is our "plans" <li>
		expect(ele.find('li').children('a')[2].getAttribute('href')).toEqual('#!plans');
		expect(targetEl.hasClass('active-item')).toBe(true);
		
	}));	

});
