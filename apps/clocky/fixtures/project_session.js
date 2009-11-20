// ==========================================================================
// Project:   Clocky.ProjectSession Fixtures
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

sc_require('models/project_session');

Clocky.ProjectSession.FIXTURES = [

  { guid: "projectSession-1",
    description: "Write some models and fixtures",
    startTime: "2009-09-11 17:30", //  2009-09-11T17:19:49-07:00",
    endTime: "2009-09-11 19:00",
    project: "project-3"},

  { guid: "projectSession-2",
    description: "Finish this masterful app",
    startTime: "2009-09-14 06:30",
    endTime: "2009-09-14 07:30",
    project: "project-3"}

  // { guid: 1,
  //   firstName: "Michael",
  //   lastName: "Scott" },
  //
  // { guid: 2,
  //   firstName: "Dwight",
  //   lastName: "Schrute" },
  //
  // { guid: 3,
  //   firstName: "Jim",
  //   lastName: "Halpert" },
  //
  // { guid: 4,
  //   firstName: "Pam",
  //   lastName: "Beesly" },
  //
  // { guid: 5,
  //   firstName: "Ryan",
  //   lastName: "Howard" }

];
