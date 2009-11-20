// ==========================================================================
// Project:   Clocky.StockRailsDataSource
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

/** @class

  A data source that interacts with a stock Ruby on Rails backend server 
  that provides JSON responses. Version 2.3.x of Rails is known to work. 

  This approach requires SproutCore to take on the burden of converting Rails 
  JSON to a format that makes sense to SproutCore, and would likely not be 
  an advisable approach for a production application, where it may make more 
  sense to simply modify the Rails application to produce the output that 
  SproutCore wants.

  In order to work, you'll need to define resourceName in a mixin for each of 
  your models,  which will be used to generate the resource paths for your 
  Rails back end. For instance, if your model is FoodEntry then your 
  resourceName is likely 'food_entry' if you're following Rails conventions. 
  See the example below.

  One to many associations are supported, assuming the JSON response includes 
  associated records for models with a to many association. Here is an 
  example:

  # Rails code

  # app/models/project.rb
  class Project < ActiveRecord::Base
    has_many :tasks
  end

  # app/models/task.rb
  class Task < ActiveRecord::Base
    belongs_to :project
  end

  # app/controllers/projects_controller.rb
  class ProjectsController < ApplicationController
    def index
      @projects = Project.all(:include => :tasks)

      respond_to do |format|
        format.html # index.html.erb
        format.json  { render :json => @projects.to_json(:include => :tasks) }
      end
    end
    # more controller methods

  // SproutCore code
  
  // apps/myapp/models/project.js 
  MyApp.Project = SC.Record.extend({
    tasks: SC.Record.toMany(
      "MyApp.Task",
      {inverse: "project", isMaster: YES}
    ),
    // more model attributes
  });
  MyApp.Task.mixin({
    resourceName: 'task'
  });

  // apps/myapp/models/task.js 
  MyApp.Project = SC.Record.extend({
    project: SC.Record.toOne(
      "MyApp.Project",
      {inverse: "tasks", isMaster: NO}
    ),
    // more model attributes
  });
  MyApp.Project.mixin({
    resourceName: 'project'
  });

  @extends SC.DataSource
*/
Clocky.StockRailsDataSource = SC.DataSource.extend(
/** @scope Clocky.StockRailsDataSource.prototype */ {

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
   
    var recordType = query.get('recordType');
    if(recordType && recordType.resourceName) {
      //var url = '/' + recordType.resourceName + 's.json';
      var url = this._urlFor(recordType.resourceName);
      SC.Request.getUrl(url).json()
        .notify(this, 'didFetchRecords', store, query)
        .send();
      return YES;
    } else return NO; // models need a resourceName
  },

  didFetchRecords: function(response, store, query) {
    if (SC.ok(response)) {
      var railsJSON = response.get('body');
      var scJSON = this._railsJSONToSCJSON(railsJSON);
      store.loadRecords(query.recordType, scJSON);
   
    } else store.dataSourceDidErrorQuery(query, response);
  },

  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
    var id = store.idFor(storeKey);
    var resourceName = store.recordTypeFor(storeKey).resourceName;
    //var url = '/' + resourceName + 's/' + id + '.json';
    var url = this._urlFor(resourceName, id);
    SC.Request.getUrl(url).json()
      .notify(this, 'didRetrieveRecord', store, storeKey)
      .send();
    return YES;
  },
   
  didRetrieveRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var railsJSON = response.get('body');
      var scJSON = this._railsJSONToSCJSON(railsJSON);
      store.dataSourceDidComplete(storeKey, scJSON);
   
    } else store.dataSourceDidError(storeKey, response);
  }, 

  // ..........................................................
  // CREATE RECORDS
  // 

  createRecord: function(store, storeKey) {
    var resourceName = store.recordTypeFor(storeKey).resourceName;
    var url = this._urlFor(resourceName);
    //var url = '/' + store.recordTypeFor(storeKey).resourceName + 's.json';
    var railsJSON = this._railsJSONFor(store, storeKey);
    SC.Request.postUrl(url).json()
      .notify(this, this.didCreateRecord, store, storeKey)
      .send(railsJSON);
    return YES;
  },
   
  didCreateRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var resourceName = store.recordTypeFor(storeKey).resourceName;
      var id = response.get('body')[resourceName].id
      store.dataSourceDidComplete(storeKey, null, id); // update url
   
    } else store.dataSourceDidError(storeKey, response);
  },

  // ..........................................................
  // UPDATE RECORDS
  // 
   
  updateRecord: function(store, storeKey) {
    var id = store.idFor(storeKey);
    //var url = '/' + store.recordTypeFor(storeKey).resourceName + 's/' + id + '.json';
    var resourceName = store.recordTypeFor(storeKey).resourceName;
    var url = this._urlFor(resourceName, id);
    var railsJSON = this._railsJSONFor(store, storeKey);
    SC.Request.putUrl(url).json()
      .notify(this, this.didUpdateRecord, store, storeKey)
      .send(railsJSON);
    return YES;
  },

  didUpdateRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var data = response.get('body');
      if (data) data = data.content; // if hash is returned; use it.
      store.dataSourceDidComplete(storeKey, data) ;
        
    } else store.dataSourceDidError(storeKey); 
  },  

  // ..........................................................
  // DESTROY RECORDS
  // 
  
  destroyRecord: function(store, storeKey) {
    var id = store.idFor(storeKey);
    //var url = '/' + store.recordTypeFor(storeKey).resourceName + 's/' + id + '.json';
    var resourceName = store.recordTypeFor(storeKey).resourceName;
    var url = this._urlFor(resourceName, id);
    SC.Request.deleteUrl(url).json()
      .notify(this, this.didDestroyRecord, store, storeKey)
      .send();
    return YES;
  },

  didDestroyRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      store.dataSourceDidDestroy(storeKey);
    } else store.dataSourceDidError(response);
  },
  
  // ..........................................................
  // CONVERT BETWEEN SC JSON AND RAILS JSON
  // 

  /** @private
    Convert Rails-style JSON to the JSON format that SC expects, handling 
    either single objects or arrays
  */
  _railsJSONToSCJSON: function(railsJSON) {
    var len = railsJSON.length,
        ret = {};
    
    if(len > 0) {
      ret = new Array(len);
      
      for(var idx=0;idx<len;idx++) {
        key = SC.keys(railsJSON[idx])[0];
        ret[idx] = this._railsObjectJSONToSCJSON(railsJSON[idx][key]);
      }

      return ret;
    }
    else {
        key = SC.keys(railsJSON)[0];
        ret = this._railsObjectJSONToSCJSON(railsJSON[key]);
    }
  },

  /** @private
    Convert Rails-style JSON for a single object to the JSON format that SC 
    expects
  */
  _railsObjectJSONToSCJSON: function(railsObjectJSON) {
    var ret = {};
    SC.keys(railsObjectJSON).forEach( function(key) {
      camelizedKey = key.camelize();

      ret[camelizedKey] = railsObjectJSON[key];

      // handle toMany relationships
      if(railsObjectJSON[key] && railsObjectJSON[key].isSCArray) {
        //console.log("key is SCArray: " + key);
        len = railsObjectJSON[key].get('length');
        var ids = [];

        for(var idx=0;idx<len;idx++) {
          ids[idx] = railsObjectJSON[key][idx]["id"];  
        }

        ret[camelizedKey] = ids;
      } else {
        //console.log("key is not SCArray: " + key);
      }
    });
    ret["guid"] = ret["id"];

    return ret;
  },

  /** @private
    Convert SC-style JSON to the JSON format that Rails expects
  */
  _railsJSONFor: function(store, storeKey) {
    var ret = {};
    var scJSON = store.readDataHash(storeKey);
    var resourceName = store.recordTypeFor(storeKey).resourceName;

    ret[resourceName] = {};
    SC.keys(scJSON).forEach( function(key) {
      decamelizedKey = key.decamelize();

      // don't load nested models
      if(scJSON[key] && !scJSON[key].isSCArray) {
        ret[resourceName][decamelizedKey] = scJSON[key];
      }
    });

    // Rails will complain about all of these
    delete ret[resourceName]["guid"];
    delete ret[resourceName]["id"];
    delete ret[resourceName]["order"];

    return ret;
  },

  /** @private
    Produce URLs for Rails resources
  */
  _urlFor: function(resourceName, id) {
    if(id) {
      return '/' + resourceName + 's/' + id + '.json';
    } else {
      return '/' + resourceName + 's.json';
    }
  }
}) ;
