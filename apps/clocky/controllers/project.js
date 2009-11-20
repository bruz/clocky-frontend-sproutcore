// ==========================================================================
// Project:   Clocky.projectController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

/** @class

  This controller tracks the selected project

  @extends SC.Object
*/
Clocky.projectController = SC.ObjectController.create(
/** @scope Clocky.projectController.prototype */ {

  contentBinding: 'Clocky.projectsController.selection',

  projectSessions: null,

  _contentDidChange: function() {
    var project = this.getPath('content.firstObject');
    //console.log("Selected project " + project);

    if(project) {
      var sessions = project.get('projectSessions');
      //console.log("First session: " + sessions.firstObject().get('startTime'));
      this.set( 'projectSessions', sessions );
    } 

    // commit any record changes upon switching projects
    Clocky.store.commitRecords();
  }.observes('content')

}) ;
