Slides = new Mongo.Collection("slides");
Negatives = new Mongo.Collection("negatives");
Neutrals = new Mongo.Collection("neutrals");
Positives = new Mongo.Collection("positives"); 
  	
if (Meteor.isClient) {
  // counter starts at 0
  Template.body.helpers({
	getSlides : function(){
		var s = Slides.find({});
  		console.log(s.count());
  		return s;}
  });
  
  Template.body.events({
    "submit .new-title": function (event) {
    
      // Prevent default browser form submit
      event.preventDefault();
      // Get value from form element
      console.log(event.target.title.value);
      var text = event.target.title.value;
      // Insert a task into the collection
      Slides.insert({content: text, number : Slides.find().count()+1});
      // Clear form
      event.target.title.value = "";
    },
    
    "change #points": function(event){
    	console.log(event.currentTarget);
    }

  });
  
  Template.slide.events({
  	"click .delete": function(){
  		Slides.remove(this._id);
  	}
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
