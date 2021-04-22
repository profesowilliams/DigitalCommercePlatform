import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorageUser } from '../../../../store/action/authAction';

const DashboardSubheader = ({ componentProp }) => {
  const { accountnumberLabel = 'Account Number' } = JSON.parse(componentProp);
  const dispatch = useDispatch();
  const { userData, showError } = useSelector(state => ({userData: state.auth.userData, showError: state.auth.showError}))

  useEffect(() => {
    dispatch(getLocalStorageUser())
  },[])

  if( showError )
    return <p>You should be logged to see this feat</p>

  const getAccountNumber = () => {
    let accountNumber = '';
    if( userData.customersV2 && userData.customersV2[0] ){
      accountNumber = userData.customersV2[0].number;
    }else if( userData.customers && userData.customers[0] ){
      const item = userData.customers[0];
      accountNumber = typeof item === 'string' ? item : item.number;
    }
    return accountNumber;
  }

  return(
    <ul>
      { userData.companyName && <li><a href="#">{userData.companyName}</a></li> }
      <li><a href="#">{accountnumberLabel}: {getAccountNumber()}</a></li>
      <li><a href="#"><i className="fas fa-link"></i></a></li>
    </ul>
  )
}

export default DashboardSubheader;