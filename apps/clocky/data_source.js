/** @class
 
    TODO: Describe Class      
 
  @extends SC.DataSource   
  @since SproutCore 1.0 
*/  
 
SC.RailsDataSource = SC.DataSource.extend( {    
 
  // ..........................................................
  // FETCHING
  // 
  
  /** @private */
  fetch: function(store, query) {
    
    console.log('in fetch');
    // can only handle local queries out of the box
    if (query.get('location') !== SC.Query.LOCAL) {
      throw SC.$error('Clocky.DataSource data source can only fetch local queries');
    }

    if (!query.get('recordType') && !query.get('recordTypes')) {
      throw SC.$error('Clocky.DataSource data source can only fetch queries with one or more record types');
    }
    
    this._fetch(store, query);
  },
  
  /** @private
    Actually performs the fetch.  
  */
  _fetch: function(store, query) {
    
    console.log('in _fetch');
    // NOTE: Assumes recordType or recordTypes is defined.  checked in fetch()
    var recordType = query.get('recordType'),
        recordTypes = query.get('recordTypes') || [recordType];
        
    // load fixtures for each recordType
    recordTypes.forEach(function(recordType) {
      if (SC.typeOf(recordType) === SC.T_CLASS) {
        recordType = String(Clocky.ProjectSession);
      }
      
      if (recordType) {
        //this.loadFixturesFor(store, recordType);
        var decamelizedPath = recordType.decamelize().split(".")[1]
        var ret = [], url;
        var action = {};
        var r = SC.Request.getUrl(decamelizedPath).set('isJSON', YES);
        r.notify(this, this.fetchDidComplete,
          { 
            store: store, 
            fetchKey: fetchKey, 
            storeKeyArray: ret
          }
        ).send();

        return ret;   
        
      }
    }, this);
    
    // notify that query has now loaded - puts it into a READY state
    //store.dataSourceDidFetchQuery(query);
  },

  /**
    Once the fetch request comming from store.findAll()
    is completed it handles the response and updates the store
    
    @param {SC.Request} fetch request
    @param {Object} hash with parameters {params.store}
    @returns {Boolean} YES 
  */
  fetchDidComplete: function(r,params) {
    console.log('in fetchDidComplete');
    var hashes= [], storeKeys= [], store, fetchKey, ret, primaryKey,
    response, results, lenresults, idx, total;
    response = r.response();
    if(response.kindOf ? response.kindOf(SC.Error) : false){
     this.requestDidError(r);
    }else{
      fetchKey = params.fetchKey;
      //results = response.content; 
      //total = response.total;
      //start =params.start;
      //length = params.length;
      //storeKeys = params.store.loadRecords(fetchKey, results);
      storeKeys = params.store.loadRecords(fetchKey.get('recordType'), response.content);
      //params.storeKeyArray.provideLength(total);
      //params.storeKeyArray.replace(start,response.content.length,storeKeys);
      //params.storeKeyArray.rangeRequestCompleted(start);
      params.storeKeyArray.replace(0,0,storeKeys);
    }
    return YES;
  },
 
  // ..........................................................
  // RETRIEVING
  // 
  
  /** @private */
  retrieveRecord: function(store, storeKey) {
    console.log('in retrieveRecord');
    var ret        = [], 
        recordType = SC.Store.recordTypeFor(storeKey),
        id         = store.idFor(storeKey);

    var decamelizedPath = recordType.decamelize().split(".")[1]
    url=decamelizedPath+'/'+id;
    var r = SC.Request.getUrl(url).set('isJSON', YES);

    r.notify(this, this.retrieveRecordDidComplete, 
        { store: store, storeKey: storeKey,id:id }
    ).send();

    this.cancelStoreKeys[storeKey]=[].push(r);
    return ret
  },

  retrieveRecordDidComplete: function(r,params) {
    console.log('in retrieveRecordDidComplete');
    var response, results, storeKeys = [], hashes = [];
    response = r.response();
    if(response.kindOf ? response.kindOf(SC.Error) : false){
     this.requestDidError(r);
    }else{
      results = response.content;
      storeKeys.push(params.storeKey);
      params.store.dataSourceDidComplete(params.storeKey, results, params.id);
      this.cancelStoreKeys[params.storeKey]=null;    
      params.storeKeyArray.replace(0,0,storeKeys);
    }  
    return YES;
  },

  createRecord: function(store, storeKey, params) {     
    return NO;   
  },    

  updateRecord: function(store, storeKey, params) {     
    return NO;   
  },    

  destroyRecord: function(store, storeKey, params) {     
    return NO;   
  },      

  cancel: function(store, storeKeys) {     
    return NO;   
  }    

});
