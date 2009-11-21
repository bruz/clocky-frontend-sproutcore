// ==========================================================================
// Project:   Clocky.Project Fixtures
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

sc_require('models/project');

Clocky.Project.FIXTURES = [

  { guid: "project-1",
    name: "Trivial Timer with RestfulX",
    projectStatus: "mostly done",
    startDate: "2009-09-01",
    projectSessions: []},

  { guid: "project-2",
    name: "Trivial Timer with Rails",
    projectStatus: "done",
    startDate: "2009-08-25",
    projectSessions: []},

  { guid: "project-3",
    name: "Trivial Timer with SproutCore",
    projectStatus: "started",
    startDate: "2009-09-11",
    projectSessions: ["projectSession-1","projectSession-2"]}

];
