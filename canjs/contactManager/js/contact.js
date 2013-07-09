(function(){

	var CONTACTS = [
		{
			id: 1,
			name: 'Prakash',
			email: 'prakash@selvam.com',
			phone: '0123456789',
			address: '220, S.R Sandalayan',
			
		},
		
	];
	
	can.fixture('GET /contacts', function(){
		return [CONTACTS];
	});

	can.fixture('GET /contacts/{id}', function(request){
		return CONTACTS[(+request.data.id)-1];
	});

	can.fixture("POST /contacts", function( request, response) {
		var id = CONTACTS.length+1;
		CONTACTS.push($.extend({id:id},request.data));
		return {id:id};
	});

	can.fixture("PUT /contacts/{id}", function(request){
		$.extend(CONTACTS[(+request.data.id)-1],request.data);
		return {};
	});

	can.fixture("DELETE /contacts/{id}", function(request){
		CONTACTS = $.grep(CONTACTS, function(val) { 
			if (val.id != request.data.id) {
				return val;
			}
		});
		return {};
	});
 })();

Contact = can.Model({
	findAll: 'GET /contacts',
	findOne: "GET /contacts/{id}",
	create  : "POST /contacts",
	update  : "PUT /contacts/{id}",
	destroy : "DELETE /contacts/{id}"
},{});


Create = can.Control({
		show: function(){
			$('#contactList').hide();
			$('#createForm').show();
			this.contact = new Contact();
			this.element.html(can.view('views/contactForm.ejs', {
				contact: this.contact,
			}));
		},
		hide: function(){
			$('#createForm').hide();
			var contactControl = new Contacts('#contactList');
			$('#contactList').show();
		},
		'{document} .add click': function(){
			this.show();
		},
		createContact: function() {
			var form = this.element.find('form');
				values = can.deparam(form.serialize());
			if(values.name !== "") {
				this.contact.attr(values).save();
				this.hide();
			}
		},
		'.save click' : function(el){
			this.createContact(el);
			
		},
		'.cancel click' : function(){
			this.hide();
		},
		'.delete click' : function(el){
			this.deleteContact(el);
			
		},
		deleteContact:function(){
		var form = this.element.find('form');
				values = can.deparam(form.serialize());
			if(values.name !== "") {
				console.log(values);
				this.contact.attr(values).destroy();
				this.hide();
			}
		},
		'{document} .edit click' : function(el){
			Contact.findOne({id: el.val()}, function( contact){
				$('#createForm').html(can.view('views/contactForm.ejs', {
					contact: contact,
				}));
			});
			this.show();
		}
});

var Contacts = can.Control({
	init:function(element,options){
		var el = this.element;
		 Contact.findAll({},function(contacts){
			el.html(can.view('views/contactList.ejs',{
				contacts: contacts,
			}));
		});
	}
});

$(document).ready(function(){
	var contactControl = new Contacts('#contactList');
	var formControl = new Create('#createForm');
});