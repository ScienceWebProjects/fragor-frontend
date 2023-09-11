// libs

// hooks
import { useState, useEffect } from 'react';
import useToken from '../../Hooks/useToken';
import usePermissions from '../../Hooks/usePermissions';

// components
import TopBar from '../_shared/TopBar';
import LogoutUser from '../_shared/LogoutUser';
import DeleteBox from '../_shared/DeleteBox';

// UI elements
import InfoType from '../Authorization/Signin/UI/InfoType';
import StyledLabel from '../UI/authorization/StyledLabel';
import StyledInput from '../UI/authorization/StyledInput';
import StyledLink from '../UI/shared/StyledLink';
import Button from '../UI/shared/buttons/Button';

// scss
import './scss/_add-printer.scss';

function AddPrinter(props) {
  const user = useToken();
  const permission = usePermissions(user);

  // variables for model
  const [modelEntered, setModelEntered] = useState('');
  const [modelAdd, setModelAdd] = useState('');
  const [modelDelete, setModelDelete] = useState('');
  const [deleteBox, setDeleteBox] = useState(false);

  // variables for printer
  const [printerNameEntered, setprinterNameEntered] = useState('');
  const [printersModels, setPrintersModels] = useState([]);

  const getAddedPrinter = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const response = await fetch(`${props.api.ip}${props.api.printersModelsGet}`, requestOptions);

      const data = await response.json();
      setPrintersModels(data);
      setModelAdd(data[0].model);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAddedPrinter();
  }, []);

  const printerModelAddHandler = async () => {
    if (modelEntered === '') {
      return alert('You cannot add empty model name!');
    }

    const modelData = {
      model: modelEntered,
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(modelData),
    };

    try {
      const response = await fetch(`${props.api.ip}${props.api.printerModelAdd}`, requestOptions);

      if (response.status === 201) {
        alert('Succesfully added printer model');
        window.location.reload();
      }

      if (response.status === 400) {
        const res400 = await response.json();
        alert(res400.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const printerAdd = async () => {
    if (printerNameEntered === '' || modelAdd === '') {
      return alert('Name or model cannot be empty!');
    }

    const printerData = {
      name: printerNameEntered,
      model: modelAdd,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(printerData),
    };

    try {
      const response = await fetch(`${props.api.ip}${props.api.printerAdd}`, requestOptions);

      if (response.status === 201) {
        return alert('Succesfully printer added.');
      }

      if (response.status === 400) {
        const res400 = await response.json();
        alert(res400.message);
      }
    } catch (error) {
      console.log(error);
      alert('Post error! Failed attempt to add printer. Refresh page and try again.');
    }
  };

  if (permission.logged === 'logout') {
    return <LogoutUser />;
  }

  return (
    <div>
      {/* <header> */}
      <TopBar />
      {/* </ header> */}

      <main className='App-header add-printer'>
        {(permission.owner || permission.master) && (
          <div>
            <InfoType text={'Model'} />
            <StyledLabel htmlFor='printer-model-add'>Add printer model name</StyledLabel>
            <StyledInput
              name='printer-model-add'
              id='printer-model-add'
              type='text'
              value={modelEntered}
              onChange={(event) => {
                setModelEntered(event.target.value);
              }}
            />
            <Button
              className='add-btn'
              color='yellow'
              onClick={printerModelAddHandler}
            >
              Add model
            </Button>

            <div className='delete_model-select'>
              <select
                className='select-dropdown'
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  const [id, model] = selectedValue.split(',');
                  setModelDelete({ id: id, model: model });
                }}
              >
                <option
                  value={''}
                  select='true'
                  hidden
                >
                  Model...
                </option>
                {printersModels.map((model) => (
                  <option
                    key={model.id}
                    value={`${model.id},${model.model}`}
                  >
                    {model.model}
                  </option>
                ))}
              </select>

              <Button
                className={`select-btn ${modelDelete.model ? '' : 'delete-inactive'}`}
                color='red'
                onClick={() => {
                  setDeleteBox(true);
                }}
              >
                Delete model
              </Button>
            </div>
          </div>
        )}
        <InfoType text={'Printer'} />
        <div className='printer-add-input'>
          <div className='add-input'>
            <StyledInput
              name='printer-add'
              id='printer-add'
              type='text'
              value={printerNameEntered}
              placeholder='Printer name'
              onChange={(event) => {
                setprinterNameEntered(event.target.value);
              }}
            />
          </div>
          <select
            className='add-select'
            onChange={(event) => {
              console.log(modelAdd);
              setModelAdd(event.target.value);
            }}
          >
            {printersModels.map((model) => (
              <option
                key={model.id}
                value={model.model}
              >
                {model.model}
              </option>
            ))}
          </select>
        </div>

        <Button
          className='add-btn'
          color='yellow'
          onClick={printerAdd}
        >
          Add printer
        </Button>
      </main>

      <StyledLink to={props.api.printersPage}>
        <Button
          className=''
          color='red'
        >
          Back
        </Button>
      </StyledLink>

      {deleteBox && (
        <DeleteBox
          api={props.api}
          ID={modelDelete.id}
          endpoint={props.api.printerModelDelete_id}
          deleteOption={`model ${modelDelete.model}`}
          onDeleteBox={setDeleteBox}
        />
      )}
    </div>
  );
}

export default AddPrinter;
