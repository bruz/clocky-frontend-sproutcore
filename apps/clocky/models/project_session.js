// ==========================================================================
// Project:   Clocky.ProjectSession
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Clocky.ProjectSession = SC.Record.extend(
/** @scope Clocky.ProjectSession.prototype */ {

  project: SC.Record.toOne(
    "Clocky.Project",
    {inverse: "projectSessions", isMaster: NO}
  ),

  description: SC.Record.attr(String),
  startTime: SC.Record.attr(SC.DateTime, {format: '%Y-%m-%dT%H:%M:%S'}),
  endTime: SC.Record.attr(SC.DateTime, {format: '%Y-%m-%dT%H:%M:%S'}),

  timeRange: function() {
    var startTime = this.get('startTime');
    var endTime = this.get('endTime');

    var range;
    if(startTime) {
      if(endTime) {
        range = startTime.toFormattedString('%m/%d/%Y %H:%M') + " to " + endTime.toFormattedString('%m/%d/%Y %H:%M');
      }
      else {
        range = startTime.toFormattedString('%m/%d/%Y %H:%M');
      }
      return range;
    }
    else {
      return "";
    }
  }.property('startTime').cacheable(),

  // only set the project property once this session has an id
  _idDidChange: function() {
    if( this.get('id') ) {
      var project = Clocky.store.find(Clocky.Project, this.get('projectId'));
      this.set('project', project);
    }
  }.observes('id')
}) ;

Clocky.ProjectSession.mixin({
  resourceName: 'project_session',
});
