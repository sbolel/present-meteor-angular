SlidesCollection = new Mongo.Collection("slides");
VotesCollection = new Mongo.Collection("votes");

var Vote = function(voteKey, voteValue){
  var that = this;
  this.id;
  this.value;
  return initialize(voteKey, voteValue);
  function initialize(voteKey, voteValue){
    console.log("initializing", voteKey, voteValue)
    that.id = voteKey;
    that.value = voteValue;
    return that;
  }
};

Vote.prototype.key = function(){
  return this.id;
};
Vote.prototype.setKey = function(key){
  return this.id = key;
};
Vote.prototype.val = function(){
  return this.value;
};
Vote.prototype.set = function(value){
  return this.value = value;
};

var Slide = function(arguments){
  var that = this;
  this.template;
  this.templateUrl;
  function initialize(arguments){
    for(key in arguments){
      console.log(key);
    }
    return that;
  }
  return initialize(arguments);
};

var VoteChart = function(type){
  var _chart;
  if (type==='pie') {
    _chart = {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
      },
      title: {
          text: "Is everybody understanding this?"
      },
      tooltip: {
          pointFormat: "<b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: {
                  enabled: true,
                  format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || "black"
                  },
                  connectorColor: "silver"
              }
          }
      },
      series: [{
          type: "pie",
          name: "votes",
          data: [
              ["Yes",   positiveVotes()],
              ["Maybe",  neutralVotes()],
              ["No",   negativeVotes()]
          ]
      }]
    };
  } else if (type==='gauge'){
    chart = {

    };
  }
  this.val = function(){
    return _chart;
  }
  return this.val();
};

if (Meteor.isClient){
  var myVote;
  Meteor.startup(function(){
    var initialVoteValue = "0"
    var initialVoteId = VotesCollection.insert({value: initialVoteValue});
    myVote = new Vote(initialVoteId, initialVoteValue);
  });
  Template.body.helpers({
  	getSlides : function(){
  		var s = SlidesCollection.find({});
    	console.log(s.count());
    	return s;
    },
    positiveVotes: function(){
      return positiveVotes();
    },
    negativeVotes: function(){
      return negativeVotes();
    },
    neutralVotes: function(){
      return neutralVotes();
    },
  	votes: function(){
  		return VotesCollection.find({});
  	},
    voteChart: function(){
      return new VoteChart('pie');
    }
  });
  function addSlide(content){

  }
  Template.body.events({
    "submit .new-slide": function (event){
      event.preventDefault();
      SlidesCollection.insert({content: event.target.slide.value});
      event.target.slide.value = "";
    },
    "change #points": function(event){
    	var currentValue = $("#points").val();
      myVote.set(currentValue)
      VotesCollection.update(myVote.key(), {$set: {value: currentValue}});
      console.log("Changed to ",currentValue);
      console.debug(myVote);
    },
    "click button.clear-votes": function(){
    	Meteor.call("removeAllVotes");
    },
    "click button.add-slide": function(){

    }
  });
  Template.slide.events({
  	"click .delete": function(){
  		SlidesCollection.remove(this._id);
  	}
  });
  function positiveVotes() {
    return VotesCollection.find({value:"1"}).count();
  };
  function negativeVotes(){
    return VotesCollection.find({value:"-1"}).count();
  };
  function neutralVotes(){
    return VotesCollection.find({value:"0"}).count();
  };
  function totalVotes(){
    return VotesCollection.find({}).count();
  };
}


if (Meteor.isServer){
  Meteor.startup(function (){
  	return Meteor.methods({
  		removeAllVotes: function(){
  			return VotesCollection.remove({});
  		}
  	});
  });
}


