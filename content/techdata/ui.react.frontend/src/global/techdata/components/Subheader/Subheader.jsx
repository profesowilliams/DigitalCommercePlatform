import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorageUser } from '../../../../store/action/authAction';

const DashboardSubheader = () => {
  const dispatch = useDispatch();
  const { userData, showError } = useSelector(state => ({userData: state.auth.userData, showError: state.auth.showError}))

  useEffect(() => {
    dispatch(getLocalStorageUser())
  },[])

  if( showError )
    return <p>You should be logged to see this feat</p>

  return(
    <ul>
      { userData.companyName && <li><a href="#">{userData.companyName}</a></li> }
      { userData.accountNumber && <li><a href="#">Account Number: {userData.accountNumber}</a></li> }
      <li><a href="#"><i className="fas fa-link"></i></a></li>
    </ul>
  )
}

export default DashboardSubheader;