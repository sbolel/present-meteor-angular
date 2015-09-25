Slides = new Mongo.Collection("slides");

if (Meteor.isClient) {
  // counter starts at 0
  var helpers = Template.presentation.helpers({
  	slides: function(){
  		return Slides.find({});
  	},
  	title: helpers.slides()[0].title,
  	items: []
  });
  
  Template.body.events({
    "submit .new-title": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
      // Get value from form element
      var text = event.target.text.value;
      // Insert a task into the collection
      Slides.insert({
        title: text,
        items: [] // current time
      });
      // Clear form
    }

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
