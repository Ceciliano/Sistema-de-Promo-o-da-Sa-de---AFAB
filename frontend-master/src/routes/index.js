import React from 'react';
import { Switch } from 'react-router-dom';
import Dashboard from '~/pages/Dashboard';
import Plan from '~/pages/Plan';
import Registration from '~/pages/Registration';
import SignIn from '~/pages/SignIn';
import Student from '~/pages/Student';
import StudentShowEdit from '~/pages/Student/ShowEdit';
import Route from './Route';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/login" component={SignIn} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/students" exact component={Student} isPrivate />
      <Route path="/students/show/edit" component={StudentShowEdit} isPrivate />
      <Route path="/plans" exact component={Plan} isPrivate />
      <Route path="/registrations" component={Registration} isPrivate />
    </Switch>
  );
}
