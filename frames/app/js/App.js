'use strict';

import React              from 'react/addons';
import Reflux from 'reflux';
import ReportStore from './stores/ReportStore';
import ReportActions from './actions/ReportActions';

import {ListenerMixin}    from 'reflux';
import {RouteHandler}     from 'react-router';

import CurrentUserActions from './actions/CurrentUserActions';
import CurrentUserStore   from './stores/CurrentUserStore';
import HomePage           from './pages/HomePage';

var App = React.createClass({

  mixins: [Reflux.connect(ReportStore)],

  componentWillMount() {
    console.log('About to mount App');    
  },

  render() {
    return (
      <div>
        <HomePage />
      </div>
    );
  }

});

export default App;