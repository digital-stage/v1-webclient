import React, { useState, useEffect } from "react";
import {
  Link,
  Grid,
  Container,
  IconButton,
  Icon,
  makeStyles,
  Typography
} from "@material-ui/core";
// @ts-ignore
import { loadCSS } from "fg-loadcss";

import validator from 'validator';
import Input from "../base/Input";
import Button from "../base/Button";
import {useAuth} from "../../lib/digitalstage/useAuth";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  back: {
    color: "white",
    padding: theme.spacing(0),
    marginTop: theme.spacing(0),
  },
  form: {
    width: "70%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  input1: {
    background: "white",
    borderRadius: "25px",
    color: "white",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: "25px",
  },
  buttonGroup: {
    borderRadius: "50px",
    margin: theme.spacing(2, 0, 2, 0),
  },
  iconButton: {
    backgroundColor: "#897FE4",
    width: "36px",
    height: "36px",
    borderRadius: "20px",
  },
  icon: {
    color: "#fff",
    fontSize: "20px",
    marginTop: "8px"
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
  const {createUserWithEmailAndPassword} = useAuth();

  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState<IError>({});
  const [showAlert, setShowAlert] = useState(false);

  /*
  React.useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);*/

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
    else if (!validator.matches(password, '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*]).{8,}$')) {
      errorsList.password = "Password must contain numbers, special chars, uppercase and lowercase letters and at least 8 chars"
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
            console.log("Allreight")
            if( props.onCompleted )
              props.onCompleted();
          })
          .catch(err => setErrors({
            response: err.message
          }));
    }
  };

  return (
    <Container maxWidth="sm" className={classes.back}>
      <div className={classes.paper}>
        {/* {showAlert && <div className="alert-box"><p>{auth.signupError}</p></div>} */}
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
          <Button
            color="primary"
            text="Sign up"
            type="submit"
          />
          {errors && errors.response && (
              <div>
                {errors.response}!!!!!!
              </div>
          )}
          <Typography variant="h6">Or Via</Typography>
        </form>
      </div>
    </Container>
  );
}
