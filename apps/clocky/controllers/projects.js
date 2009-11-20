// ==========================================================================
// Project:   Clocky.projectsController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

/** @class

  This controller tracks all the projects

  @extends SC.ArrayController
*/
Clocky.projectsController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Clocky.projectsController.prototype */ {

  addProject: function() {           
    var project;

    // create a new task in the store
    project = Clocky.store.createRecord(Clocky.Project, {
      "name": "new project",
      "order":1
    });
    
    // select this new task in the UI
    this.selectObject(project);

    // activate inline editor once UI can repaint
    this.invokeLater(function() {
      var contentIndex = this.indexOf(project);
      var list = Clocky.mainPage.getPath('mainPane.containerView.projectSummaryView.projectListView.contentView');
      var listItem = list.itemViewForContentIndex(contentIndex);
      listItem.beginEditing();
    });

    return YES;
  },

  deleteProject: function() {           
    var list = Clocky.mainPage.getPath('mainPane.containerView.projectSummaryView.projectListView.contentView');
    list.deleteSelection();

    return YES;
  },

  collectionViewDeleteContent: function(view, content, indexes) {

    // destroy the records
    var records = indexes.map(function(idx) {
      return this.objectAt(idx);
    }, this);
    records.invoke('destroy');

    var selIndex = indexes.get('min')-1;
    if (selIndex<0) selIndex = 0;
    this.selectObject(this.objectAt(selIndex));
  }

});
