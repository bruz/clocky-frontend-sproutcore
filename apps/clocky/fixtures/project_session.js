// ==========================================================================
// Project:   Clocky.ProjectSession Fixtures
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

sc_require('models/project_session');

Clocky.ProjectSession.FIXTURES = [

  { guid: "projectSession-1",
    description: "Write some models and fixtures",
    startTime: "2009-09-11T17:30:00",
    endTime: "2009-09-11T19:00:00",
    project: "project-3"},

  { guid: "projectSession-2",
    description: "Finish this masterful app",
    startTime: "2009-09-14T06:30:00",
    endTime: "2009-09-14T07:30:00",
    project: "project-3"}

];
