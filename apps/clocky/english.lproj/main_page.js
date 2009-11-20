// ==========================================================================
// Project:   Clocky - mainPage
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Clocky */

// This page describes the main user interface for your application.  
Clocky.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'containerView'.w(),
    
    containerView: SC.View.design(SC.Border, {
      classNames: 'main-container'.w(),

      borderStyle: SC.BORDER_GRAY,
      backgroundColor: "#dedede",
      layout: { top: 20, left: 20, right: 20, bottom: 20 },

      childViews: 'projectSummaryView projectDetailView projectSessionsView'.w(),

      projectSummaryView: SC.View.design({
        layout: { top: 0, left: 0, bottom: 0, width: 300 },

        childViews: 'projectLabelView projectListView projectAddButton projectDeleteButton'.w(),
        
        projectLabelView: SC.LabelView.design({
          layout: { top: 8, height: 24, left: 16, width: 141 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          value:   'Projects'
        }),
        
        projectListView: SC.ScrollView.design({
          layout: { top: 41, bottom: 41, left: 16, width: 250 },
          hasHorizontalScroller: NO,
          backgroundColor: 'white',

          contentView: SC.ListView.design({
            contentBinding: 'Clocky.projectsController.arrangedObjects',
            selectionBinding: 'Clocky.projectsController.selection',
            contentValueKey: "name",
            canReorderContent: YES,
            rowHeight: 21,
            canEditContent: YES,
            canReorderContent: YES,
            canDeleteContent: YES,
            destroyOnRemoval: YES
          })
        }),

        projectAddButton: SC.ButtonView.design({
          layout: { bottom: 8, height: 24, left: 16, width: 100 },
          title:  "Add Project",
          target: "Clocky.projectsController",
          action: "addProject"
        }),

        projectDeleteButton: SC.ButtonView.design({
          layout: { bottom: 8, height: 24, left: 140, width: 120 },
          title:  "Delete Project",
          target: "Clocky.projectsController",
          action: "deleteProject"
        })
      }), // end projectSummaryView

      projectDetailView: SC.View.design({
        layout: { top: 0, right: 0, height: 110, left: 290 },

        childViews: 'projectNameLabel projectStatusLabel projectStatusField projectDateLabel projectDateField timerButton timerClock'.w(),

        projectNameLabel: SC.LabelView.design({
          layout: { top: 8, height: 24, left: 16, width: 141 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          value: 'Project Details'
        }),
        
        projectStatusLabel: SC.LabelView.design({
          layout: { top: 41, height: 22, left: 16, width: 90 },
          textAlign: SC.ALIGN_RIGHT,
          value: "Project Status"
        }),

        projectStatusField: SC.TextFieldView.design({
          layout: { top: 41, height: 22, left: 110, width: 200 },

          valueBinding: SC.binding('Clocky.projectController.projectStatus', this)
        }),

        projectDateLabel: SC.LabelView.design({
          layout: { top: 65, height: 22, left: 16, width: 90 },
          textAlign: SC.ALIGN_RIGHT,
          value: "Date Started"
        }),

        projectDateField: SC.TextFieldView.design({
          layout: { top: 65, height: 22, left: 110, width: 200 },

          valueBinding: "Clocky.projectController.startDate"
        }),

        timerButton: SC.ButtonView.design({
          layout: { top: 50, height: 24, left: 350, width: 100 },
          titleBinding: SC.binding("Clocky.timerController.timerButtonText", this),
          target: "Clocky.timerController",
          action: "toggleTimer"
        }),

        timerClock: SC.LabelView.design({
          layout: { top: 53, height: 22, left: 410, width: 100 },
          textAlign: SC.ALIGN_RIGHT,
          valueBinding: SC.binding('Clocky.timerController.elapsedTime', this),
          tagName: "h2"
        }),
      }), // end projectDetailView

      projectSessionsView: SC.View.design({
        layout: { top: 90, right: 0, bottom: 0, left: 290 },

        childViews: 'projectSessionsLabel projectSessionsList'.w(),

        projectSessionsLabel: SC.LabelView.design({
          layout: { top: 8, height: 24, left: 16, width: 170 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          value: 'Project Sessions'
        }),

        projectSessionsList: SC.ScrollView.design({
          layout: { top: 41, bottom: 16, left: 16, right: 16 },
          hasHorizontalScroller: NO,
          backgroundColor: 'white',

          contentView: SC.ListView.design({
            contentBinding: 'Clocky.projectSessionsController.arrangedObjects',
            selectionBinding: 'Clocky.projectSessionssController.selection',
            contentValueKey: "timeRange",
            rowHeight: 21,
            canEditContent: NO,
            canReorderContent: NO,
            canDeleteContent: YES,
            destroyOnRemoval: YES
          })
        })
      }) // end projectSessionView    
    }) // end containerView
  })

});
