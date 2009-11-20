# ===========================================================================
# Project:   Clocky
# Copyright: ©2009 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore

# Rails back end
proxy '/projects', :to => 'localhost:3000', :protocol => 'http'
proxy '/project_sessions', :to => 'localhost:3000', :protocol => 'http'
