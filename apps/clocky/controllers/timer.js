// ==========================================================================
// Project:   Clocky.timerController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Clocky.timerController = SC.Object.create(
/** @scope Clocky.timerController.prototype */ {

  elapsedTime: "00:00:00",

  startTime: null,
  endTime: null,
  timerButtonText: "Start Timer",

  toggleTimer: function() {
    var startTime = this.get('startTime');

    // stop the timer
    if(startTime) {
      // create a new project session
      var project = Clocky.projectController.getPath('content.firstObject');
      var session = Clocky.store.createRecord(Clocky.ProjectSession, {
        "startTime": startTime.toFormattedString('%Y-%m-%dT%H:%M:%S'),
        "endTime": SC.DateTime.create().toFormattedString('%Y-%m-%dT%H:%M:%S'),
        //"project": project
        "projectId": project.get('id')
      });
      // commit records
      Clocky.store.commitRecords();
      //session.set('guid', session.get('id'));
      //session.set('project',project);

      this.set('timerButtonText','Start Timer');
      this.set('startTime', null);
    }
    // start the timer
    else {
      this.set('timerButtonText','Stop Timer');
      this.set( 'startTime', SC.DateTime.create() );
      this.tick();
    }
  },

  // updates now to reflect the clock
  tick: function() {
    var startTime = this.get('startTime');

    // make sure the timer is running, if not stop ticking
    if(startTime) {
      var totalSeconds = parseInt( (SC.DateTime.create()._ms - startTime._ms) / 1000);
      var seconds = totalSeconds % 60;
      var minutes = parseInt(totalSeconds/60) % 60;
      var hours = parseInt(totalSeconds/3600);
      this.set('elapsedTime', hours + ":" + this.pad(minutes,2) + ":" + this.pad(seconds,2));
      this.invokeLater(this.tick, 1000);
    }
  },

  // need to find a better home for this
  pad: function(num, count) {
    var lenDiff = count - String(num).length;
    var padding = "";
    
    if (lenDiff > 0)
      while (lenDiff--)
        padding += "0";
    
    return padding + num;
  }
}) ;
