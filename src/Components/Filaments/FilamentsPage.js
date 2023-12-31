// libs
import React from 'react';

// hooks
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import useToken from '../../Hooks/useToken';
import usePermissions from '../../Hooks/usePermissions';

// components
import { FormattedMessage } from 'react-intl';
import TopBar from '../_shared/TopBar';
import FilamentAddBox from './Boxes/FilamentAddBox';
import LogoutUser from '../_shared/LogoutUser';
import FilamentFindBox from './Boxes/FilamentFindBox';

// UI elements
import FiltersBar from './FiltersBar';
import FilamentsWindow from './UI/FilamentsWindow';
import FilamentsList from './FilamentsList';
import StyledLink from '../UI/shared/StyledLink';
import Button from '../UI/shared/buttons/Button';

// scss
import './scss/_filaments_add-btns.scss';

function FilamentsPage(props) {
  const user = useToken();
  const permission = usePermissions(user);
  const intl = useIntl();

  // variabels for filters
  const [filaments, setFilaments] = useState([]);
  const [filteredColor, setFilteredColor] = useState('all');
  const [filteredMaterial, setFilteredMaterial] = useState('all');
  const [filteredBrand, setFilteredBrand] = useState('all');
  const [filteredStock, setFilteredStock] = useState('0');

  // variabels for box showing
  const [filamentAddBox, setFilamentAddBox] = useState(false);
  const [filamentFindBox, setFilamentFindBox] = useState(false);

  // const filamentsRandomAddHandler = async () => {
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${user.token}`,
  //     },
  //   };

  //   try {
  //     const response = await fetch(
  //       `${props.api.ip}${props.api.filamentsRandomAdd_ammount}10/`,
  //       requestOptions
  //     );

  //     if (response.status === 404) {
  //       setFilaments([]);
  //       return;
  //     }

  //     if (response.status === 200) {
  //       window.location.reload();
  //       return;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const filamentSelectionHandler = (filament) => {
    props.onFilamentSelect(filament);
  };

  const filterChangeHandler = (filters) => {
    const { color, material, brand, stock } = filters;
    setFilteredColor(color);
    setFilteredMaterial(material);
    setFilteredBrand(brand);
    setFilteredStock(stock);
  };

  const makeAPICall = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const response = await fetch(
        `${props.api.ip}${props.api.filamentsFiltered}${filteredColor}/${filteredMaterial}/${filteredBrand}/${filteredStock}/`,
        requestOptions
      );

      if (response.status === 404) {
        setFilaments([]);
        return;
      }

      const data = await response.json();
      // console.log(data);

      setFilaments(data);
    } catch (e) {
      console.log('Error in filter fetch');
    }
  };

  useEffect(() => {
    makeAPICall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (permission.logged === 'logout') {
    return <LogoutUser api={props.api} />;
  }

  return (
    <div>
      {/* <header> */}
      <TopBar api={props.api} />
      {/* </ header> */}

      <main className='App-header'>
        <FiltersBar
          api={props.api}
          onFilterChange={filterChangeHandler}
        />

        <FilamentsWindow>
          <FilamentsList
            items={filaments}
            api={props.api}
            onFilamentSelect={filamentSelectionHandler}
          />
        </FilamentsWindow>
      </main>

      <div className='btns-filaments_add'>
        {/* {permission.owner && (
          <Button
            className='filaments_add-btn'
            color='blue'
            onClick={filamentsRandomAddHandler}
          >
            Random 10
          </Button>
        )} */}

        <Button
          className='filaments_add-btn'
          color='blue'
          onClick={() => {
            setFilamentFindBox(true);
          }}
        >
          <FormattedMessage
            id='filaments.findFilament'
            defaultMessage='Find filament'
          />
        </Button>

        {/* everyone except common user */}
        {permission.changer && (
          <Button
            className='filaments_add-btn'
            color='yellow'
            onClick={() => {
              setFilamentAddBox(true);
            }}
          >
            <FormattedMessage
              id='filaments.addFilament'
              defaultMessage='Add filament'
            />
          </Button>
        )}
        <StyledLink
          to={props.api.chartsPage}
          className='filaments_add-btn'
        >
          <Button
            color='green'
            style={{ width: '100%' }}
          >
            <FormattedMessage
              id='charts'
              defaultMessage='Charts'
            />
          </Button>
        </StyledLink>
      </div>

      <StyledLink to={props.api.home}>
        <Button
          className=''
          color='red'
        >
          <FormattedMessage
            id='back'
            defaultMessage='Back'
          />
        </Button>
      </StyledLink>

      {filamentFindBox && (
        <FilamentFindBox
          api={props.api}
          onFilamentFindBox={setFilamentFindBox}
        />
      )}

      {filamentAddBox && (
        <FilamentAddBox
          api={props.api}
          onFilamentAddBox={setFilamentAddBox}
        />
      )}
    </div>
  );
}

export default FilamentsPage;
