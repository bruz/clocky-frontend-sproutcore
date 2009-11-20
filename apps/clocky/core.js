// ==========================================================================
// Project:   Clocky
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Clocky = SC.Object.create(
  /** @scope Clocky.prototype */ {

  NAMESPACE: 'Clocky',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  //store: SC.Store.create().from(SC.Record.fixtures)
  //store: SC.Store.create().from('SC.RailsDataSource')
  store: SC.Store.create({ 
    commitRecordsAutomatically: NO
  }).from('Clocky.StockRailsDataSource')
  
  // TODO: Add global constants or singleton objects needed by your app here.

}) ;
