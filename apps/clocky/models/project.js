// ==========================================================================
// Project:   Clocky.Project
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Clocky.Project = SC.Record.extend(
/** @scope Clocky.Project.prototype */ {

  projectSessions: SC.Record.toMany(
    "Clocky.ProjectSession",
    {inverse: "project", isMaster: YES}
  ),

  name: SC.Record.attr(String),
  projectStatus: SC.Record.attr(String),
  startDate: SC.Record.attr(String)

}) ;

Clocky.Project.mixin({
  resourceName: 'project'
});

