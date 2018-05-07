describe('Phone Controller Test Suite', function() {

	beforeEach(function(){
	    module('ngRoute');
	    module('ui.bootstrap');
	    module('ngResource');
	    module('ngAnimate');
	    module('mobileWebApp');
	});  
	
	var PhoneController, scope;
	
	beforeEach(inject(function ($controller, $rootScope, $compile, $location, $httpBackend) {
		$globalHttpBackend = $httpBackend;
		$globalHttpBackend.when('GET','/data/phones.json').respond([
			 {
	 	"img": "images/phone.png",
	 	"url": "#!phones",
	 	"text": "Phone #1",
	 	"title": "Fancy Phone",
	 	"price":100.00,
	 	"id": "phone1"
	 },
	  {
	 	"img": "images/phone.png",
	 	"url": "#!phones",
	 	"text": "Phone #2",
	 	"title": "Super Fancy Phone",
	 	"price":200.00,
	 	"id": "phone2"
	
	 },
	  {
	 	"img": "images/phone.png",
	 	"url": "#!phones",
	 	"text": "Phone #3",
	 	"title": "Super Deluxe Fancy Phone",
	 	"price":300.00,
	 	"id": "phone3"
	 },
	  {
	 	"img": "images/phone.png",
	 	"url": "#!phones",
	 	"text": "Phone #4",
	 	"title": "Super Duper Deluxe Fancy Phone",
	 	"price":400.00,
	 	"id": "phone4"
	 }
		
		]);
		
		scope = $rootScope.$new();
		scope.$digest();
		PhoneController = $controller('PhoneCtrl', {$scope: scope});
	}));
	it('should be 4 phones',function() {
		$globalHttpBackend.flush();
		expect(scope.phones.length).toBe(4);
	})
	it('should test each phone', function() {
		$globalHttpBackend.flush();
		for(i=0;i<scope.phones.length;i++) {
			var thisPhone = scope.phones[i];
			
			//Price tests
			expect(thisPhone.price).toBeDefined();
			expect(thisPhone.price).toBeGreaterThan(0);
			
			//Image tests
			expect(thisPhone.img).toBeDefined();
			expect(thisPhone.img.length).toBeGreaterThan(0);
			var img_array = thisPhone.img.split(".");
			var image_ext = img_array[img_array.length - 1];
			expect(image_ext).toBe('png');
			
			//Title tests
			expect(thisPhone.title).toBeDefined();
			expect(thisPhone.title.length).toBeGreaterThan(0);
		}
	});

});