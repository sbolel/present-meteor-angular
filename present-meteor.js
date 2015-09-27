SlidesCollection = new Mongo.Collection("slides");
VotesCollection = new Mongo.Collection("votes");

function Queue() {
  "use strict";
  var _queue = [];
  this.val = function(){
    return _queue;
  };
  this.length = function(){
    return _queue.length;
  };
  this.first = function(){
    return _queue[0];
  };
  this.last = function(){
    return _queue[_queue.length];
  };
}
Queue.prototype = {
  constructor: Queue
};
Queue.prototype.get = function(){
  "use strict";
  return this.val();
};
Queue.prototype.push = function(object){
  "use strict";
  return this.val().push(object);
};
Queue.prototype.pop = function(){
  "use strict";
  return this.val().shift();
};
var Vote = function(voteKey, voteValue){
  var that = this;
  this.id;
  this.value;
  return initialize(voteKey, voteValue);
  function initialize(voteKey, voteValue){
    console.log("initializing", voteKey, voteValue);
    that.id = voteKey;
    that.value = voteValue;
    return that;
  }
};
Vote.prototype.key = function(){
  return this.id;
};
Vote.prototype.setKey = function(key){
  this.id = key;
  return this.id;
};
Vote.prototype.val = function(){
  return this.value;
};
Vote.prototype.set = function(value){
  this.value = value;
  return this.value;
};
var Slide = function(argv){
  var that = this;
  this.template = "";
  this.templateUrl = "";
  function initialize(argv){
    for(var key in arguments){
      console.log(key);
    }
    return that;
  }
  return initialize(arguments);
};
/**
 * 
 */
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
  };
  return this.val();
};


var slidesQueue = new Queue();


if (Meteor.isClient){
  var myVote;

  Meteor.startup(function(){
    var initialVoteValue = "0";
    var initialVoteId = VotesCollection.insert({value: initialVoteValue});
    myVote = new Vote(initialVoteId, initialVoteValue);
    slidesArray = SlidesCollection.find().fetch();
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

  Template.body.events({
    "submit .new-slide": function (event){
      event.preventDefault();
      // get the id of the last
      var slidesArray = SlidesCollection.find().fetch();
      var last;
      if(slidesArray.length>0){
        last = slidesArray[slidesArray.length-1];
      } else {
        last = {_id: null};
      }
      var newId = SlidesCollection.insert({previous: last._id, content: event.target.slide.value});
      SlidesCollection.update(last._id, {$set: {next: newId}});
      event.target.slide.value = "";
    },
    "change #points": function(event){
    	var currentValue = $("#points").val();
      myVote.set(currentValue);
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
      SlidesCollection.update(this.previous, {$set: {next: this.next}});
      SlidesCollection.update(this.next, {$set: {previous: this.previous}});
      SlidesCollection.remove(this._id);
      var slidesArray = SlidesCollection.find().fetch();
      console.debug("REMOVE", slidesArray);
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


