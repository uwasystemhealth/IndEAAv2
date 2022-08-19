import * as React from 'react';
import { useState, useEffect } from 'react';

function getCourseEvaluations() {
  return [
    {
      id: 'f93046e0-bb2e-4043-b188-169aa78c7da9',
      unit_code: 'geng1234',
      description: 'a unit about important engineering stuff',
      eoc_set: 'IAP Mechanical',
    },
  ];
}

const OngoingReviewsList = (): JSX.Element => {
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const loadedReviews = getCourseEvaluations();

    setReviews(loadedReviews);
  }, []);

  return <div>{JSON.stringify(reviews)}</div>;
};

export default OngoingReviewsList;
