// libs
import React from 'react';

// hooks
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWindowSize from '../../../Hooks/useWindowSize';
import { useIntl } from 'react-intl';

// components
import { FormattedMessage } from 'react-intl';
import Pin from '../../_shared/Pin';

// downloaded components
import InfiniteScroll from 'react-infinite-scroll-component'; // v6.1.0

// UI elements
import logo from '../../../Images/logo-black.png';
import Button from '../../UI/shared/buttons/Button';
import InfoType from './UI/InfoType';
import StyledLink from '../../UI/shared/StyledLink';
import StyledLabel from '../../UI/authorization/StyledLabel';
import StyledInput from '../../UI/authorization/StyledInput';

// scss
import '../scss/_signin-page.scss';
import '../../UI/shared/_media-queries.scss';
import '../scss/_signin-media-queries.scss';

function SigninPage(props) {
  const intl = useIntl();

  const [firstNameEntered, setFirstNameEntered] = useState('');
  const [lastNameEntered, setLastNameEntered] = useState('');
  const [emailEntered, setEmailEntered] = useState('');
  const [pinEntered, setPinEntered] = useState('');
  const [passwordEntered, setPasswordEntered] = useState('');
  const [passwordConfirmEntered, setPasswordConfirmEntered] = useState('');
  const [productInformationEntered, setProductInformationEntered] =
    useState('');

  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const makeAPIPost = async () => {
    const registerData = {
      email: emailEntered,
      firstName: firstNameEntered,
      lastName: lastNameEntered,
      password: passwordEntered,
      password2: passwordConfirmEntered,
      pin: pinEntered,
      token: productInformationEntered,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    };

    try {
      const response = await fetch(
        `${props.api.ip}${props.api.registration}`,
        requestOptions
      );

      if (response.status === 201) {
        return true;
      }

      if (response.status === 400) {
        const res400 = await response.json();
        console.log(res400);

        // get elements value from json server response
        let errorMessage =
          'Unable to register.\nPlease check your input data and try again.\n\n';
        for (const key in res400) {
          errorMessage += `${res400[key]}\n`;
        }

        alert(`${errorMessage}`); // in this line must add some UI info about failure
        return false;
      }

      if (response.status === 404) {
        console.log(`error ${response.status} fetch POST SigninPage.js`);
        return false;
      }
    } catch (error) {
      alert('Post error! Failed attempt to register. Try again.');
    }
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    const successful = await makeAPIPost();

    if (successful) {
      alert('Succesfull registered.');
      navigate(props.api.loginPage);
    }
  };

  return (
    <div className='media-background'>
      <div className='App'>
        <header className='header_logo'>
          <h1 className='logo_txt'>
            3D printing assistant
            <br />
            Project by:
            <br />
            Piotr Goraj & Dawid Franczak
            <br />
          </h1>
          <div className='logo_img'>
            <a href='https://github.com/ScienceWebProjects/filament-measurement'>
              <img
                src={logo}
                alt='Logo'
              />
            </a>
          </div>
        </header>

        <main
          className='App-header'
          style={{ minHeight: '77vh' }}
        >
          <form
            onSubmit={submitFormHandler}
            style={{ width: '100%' }}
          >
            <InfiniteScroll
              dataLength={''}
              hasMore={false}
              height={windowSize * 0.5}
              className='infinite-scroll'
            >
              <InfoType
                text={intl.formatMessage({
                  id: 'signin.personalInfo',
                  defaultMessage: 'Personal information',
                })}
              />

              <StyledLabel htmlFor='first-name'>
                <FormattedMessage
                  id='signin.firstName'
                  defaultMessage='First Name'
                />
              </StyledLabel>
              <StyledInput
                name='first-name'
                id='first-name'
                type='text'
                value={firstNameEntered}
                onChange={(event) => {
                  setFirstNameEntered(event.target.value);
                }}
                isRequired={true}
              ></StyledInput>

              <StyledLabel htmlFor='last-name'>
                <FormattedMessage
                  id='signin.lastName'
                  defaultMessage='Last Name'
                />
              </StyledLabel>
              <StyledInput
                name='last-name'
                id='last-name'
                type='text'
                value={lastNameEntered}
                onChange={(event) => {
                  setLastNameEntered(event.target.value);
                }}
                isRequired={true}
              ></StyledInput>

              <InfoType
                text={intl.formatMessage({
                  id: 'signin.accountInfo',
                  defaultMessage: 'Account information',
                })}
              />

              <StyledLabel htmlFor='user-email'>
                <FormattedMessage
                  id='email'
                  defaultMessage='E-mail'
                />
              </StyledLabel>
              <StyledInput
                name='user-email'
                id='user-email'
                type='email'
                value={emailEntered}
                onChange={(event) => {
                  setEmailEntered(event.target.value);
                }}
                isRequired={true}
              ></StyledInput>

              <Pin
                text={'PIN'}
                length={4}
                style={{ width: '100%', margin: '0 auto' }}
                onPinEntered={(pin) => {
                  setPinEntered(pin);
                }}
              />

              <StyledLabel htmlFor='user-password'>
                <FormattedMessage
                  id='signin.password'
                  defaultMessage='Password'
                />
              </StyledLabel>
              <StyledInput
                name='user-password'
                id='user-password'
                type='password'
                value={passwordEntered}
                onChange={(event) => {
                  setPasswordEntered(event.target.value);
                }}
                isRequired={true}
              ></StyledInput>

              <StyledLabel htmlFor='user-confirm-password'>
                <FormattedMessage
                  id='signin.passwordConfirm'
                  defaultMessage='Confirm password'
                />
              </StyledLabel>
              <StyledInput
                name='user-confirm-password'
                id='user-confirm-password'
                type='password'
                value={passwordConfirmEntered}
                onChange={(event) => {
                  setPasswordConfirmEntered(event.target.value);
                }}
                isRequired={true}
              ></StyledInput>

              <InfoType
                text={intl.formatMessage({
                  id: 'signin.productInfo',
                  defaultMessage: 'Product information',
                })}
              />

              <StyledLabel htmlFor='product-key'>
                <FormattedMessage
                  id='signin.productKey'
                  defaultMessage='Product key'
                />
              </StyledLabel>
              <StyledInput
                name='product-key'
                id='product-key'
                type='text'
                value={productInformationEntered}
                onChange={(event) => {
                  setProductInformationEntered(event.target.value);
                }}
                isRequired={true}
              ></StyledInput>
            </InfiniteScroll>
            <Button
              className='sign-btn'
              color='yellow'
              type='submit'
            >
              <FormattedMessage
                id='login.signinBtn'
                defaultMessage='Sign in'
              />
            </Button>
          </form>
          <StyledLink to={props.api.loginPage}>
            <Button
              className='sign-btn'
              color='red'
            >
              <FormattedMessage
                id='back'
                defaultMessage='Back'
              />
            </Button>
          </StyledLink>
        </main>
      </div>
    </div>
  );
}

export default SigninPage;
