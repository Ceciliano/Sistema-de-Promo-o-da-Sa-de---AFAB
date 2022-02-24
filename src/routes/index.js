import React from 'react';
import { Switch } from 'react-router-dom';
import Dashboard from '~/pages/Dashboard';
import Plan from '~/pages/Plan';
import Results from '~/pages/Results';
import SignIn from '~/pages/SignIn';
import Student from '~/pages/Student';
import StudentShowEdit from '~/pages/Student/ShowEdit';
import StudentResult from '~/pages/Student/ShowEdit/Result';
import Route from './Route';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/login" component={SignIn} />
      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/students" exact component={Student} isPrivate />
      <Route path="/students/show/edit" component={StudentShowEdit} isPrivate />
      <Route path="/students/show/result" component={StudentResult} isPrivate />
      <Route path="/plans" exact component={Plan} isPrivate />
      <Route path="/results" component={Results} isPrivate />
    </Switch>
  );
}
