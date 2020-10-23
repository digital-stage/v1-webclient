import React, { useState } from "react";
import {
  Container,
  makeStyles,
} from "@material-ui/core";

import validator from 'validator';
import Input from "../base/Input";
import Button from "../base/Button";
import { useAuth } from "../../lib/digitalstage/useAuth";
import Alert from "../base/Alert";
import ResetLinkModal from "./ResetLinkModal";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  back: {
    padding: theme.spacing(0),
    marginTop: theme.spacing(0),
  },
  form: {
    width: "70%"
  },
  marginTopBottom: {
    margin: theme.spacing(2, 0),
  }
}));

export interface IError {
  email?: string;
  username?: string;
  password?: string;
  repeatPassword?: string;
  response?: string;
}

export default function SignUpForm(props: {
  onCompleted?: () => void
}) {
  const { createUserWithEmailAndPassword } = useAuth();

  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState<IError>({});
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  const validate = () => {
    const errorsList: IError = {}
    if (validator.isEmpty(email)) {
      errorsList.email = "Email is required"
    }
    else if (!validator.isEmail(email)) {
      errorsList.email = "Enter a valid email"
    }
    if (validator.isEmpty(password)) {
      errorsList.password = "Password is required"
    }
    else if (!validator.matches(password, '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$')) {
      errorsList.password = "Password must contain: at least one number, one uppercase and one lowercase letters and at least 8 chars"
    }
    if (validator.isEmpty(repeatPassword)) {
      errorsList.repeatPassword = "Repeat password"
    }
    if (validator.isEmpty(username)) {
      errorsList.username = "Username is required"
    }
    if (!validator.equals(password, repeatPassword)) {
      errorsList.repeatPassword = "Passwords must be equal"
      errorsList.password = "Passwords must be equal"
    }
    setErrors(errorsList)
    return errorsList
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const handleReapeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      return createUserWithEmailAndPassword(email, password, {
        name: username
      })
        .then(() => {
          if (props.onCompleted)
            props.onCompleted();
            handleClickOpen();
        })
        .catch(err => setErrors({
          response: err.message
        }));
    }
  };

  return (
    <Container maxWidth="sm" className={classes.back}>
      <ResetLinkModal open={open} handleClose={handleClose} />
      <div className={classes.paper}>
        {errors && errors.response && <Alert text={errors.response} severity="error" />}
        <form className={classes.form} noValidate={true} onSubmit={handleSubmit}>
          <Input
            required={true}
            id="email"
            type="text"
            placeholder="Email"
            name="email"
            error={errors && errors.email}
            onChange={handleEmailChange}
          />
          <Input
            required={true}
            id="Username"
            placeholder="Username"
            name="Username"
            type="text"
            error={errors && errors.username}
            onChange={handleUsernameChange}
          />
          <Input
            required={true}
            id="passwrod"
            placeholder="Password"
            name="password"
            type="password"
            error={errors && errors.password}
            onChange={handlePasswordChange}
          />
          <Input
            required={true}
            id="Repeat password"
            placeholder="Repeat password"
            type="password"
            name="password"
            error={errors && errors.repeatPassword}
            onChange={handleReapeatPasswordChange}
          />
          <div className={classes.marginTopBottom}>
            <Button
              color="primary"
              text="Sign up"
              type="submit"
            />
          </div>
        </form>
      </div>
    </Container>
  );
}
