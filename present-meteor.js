Slides = new Mongo.Collection("slides");
Votes = new Mongo.Collection("votes");
  	
if (Meteor.isClient) {

  var myVote = {value:0, id:''};
  Meteor.startup(function(){
	   myVote.id = Votes.insert({value:"0"});
  });

  function positiveVotes() {
    return Votes.find({value:"1"}).count();
  };

  function negativeVotes(){
    return Votes.find({value:"-1"}).count();
  };

  function neutralVotes(){
    return Votes.find({value:"0"}).count();
  };

  function totalVotes(){
    return Votes.find({}).count();
  };

  Template.body.helpers({
  	getSlides : function(){
  		var s = Slides.find({});
    	console.log(s.count());
    	return s;
    },
    
    positiveVotes: function() {
      return positiveVotes();
    },
    negativeVotes: function() {
      return negativeVotes();
    },
    neutralVotes: function() {
      return neutralVotes();
    },
  		
  	votes: function(){
  		return Votes.find({});
  	},

    voteChart: function() {
      return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: "Is everybody understanding this?"
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'votes',
            data: [
                ['Yes',   positiveVotes()],
                ['Maybe',  neutralVotes()],
                ['No',   negativeVotes()]
            ]
        }]
      };
    }
  });
  
  Template.body.events({
    "submit .new-title": function (event) {
    
      // Prevent default browser form submit
      event.preventDefault();
      // Get value from form element
      var text = event.target.title.value;
      // Insert a task into the collection
      Slides.insert({content: text, number : Slides.find().count()+1});
      // Clear form
      event.target.title.value = "";
    },
    
    "change #points": function(event){
    	var currentValue = $("#points").val();
    	Votes.update(myVote.id,{$set: {value: currentValue}});
    	
    },
    
    "click .clear": function(){
    	Meteor.call('removeAllVotes');
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
  	return Meteor.methods({
  		removeAllVotes: function(){
  			return Votes.remove({});
  			
  		}
  	});
    // code to run on server at startup
  });
}


