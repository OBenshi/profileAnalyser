import React, {
  FC,
  Fragment,
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
} from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../GraphQL/Mutations";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import background from "../img/bground.jpeg";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 360,
      margin: `${theme.spacing(0)} auto`,
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
    },
    header: {
      textAlign: "center",
      background: "#FF7600",
    },
    card: {
      marginTop: theme.spacing(10),
    },
  })
);

interface FormData {
  password: string;
  email: string;
}

const LogIn: React.FC = () => {
  const [logIn, { error }] = useMutation(LOGIN_USER);
  const classes = useStyles();
  const history = useHistory();
  //const [user, setUser] = useState("");
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);
  const [input, setInput] = useState<FormData>({
    password: "",
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const handleCLick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      alert("Enter email and password!");
    } else {
      console.log(input.email);
      logIn({
        variables: {
          logInEmail: input.email,
          logInPassword: input.password,
        },
      })
        .then(({ data }) => {
          localStorage.setItem("token", data.logIn.token);
          console.log(data);
          setUser(data.logIn);
          setIsAuthenticated(true);
          console.log(data.logIn);
          history.push('/');
        })
        .catch((error) => {
          console.log(error);
        });
      if (error) {
        console.log(error);
      } else {
        console.log("user logged in");
      }
    }
  };

  const backgroundStyles = {
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "repeat",
    width: "100vw",
    height: "100vh",
  };
  return (
    <>
      <div style={backgroundStyles}>
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={handleCLick}
        >
          <Card className={classes.card}>
            <CardHeader
              className={classes.header}
              title="Log in"
            />
            <CardContent>
              <div>
                <TextField
                  fullWidth
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Email"
                  margin="normal"
                  value={input.email}
                  name="email"
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  margin="normal"
                  value={input.password}
                  name="password"
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="large"
                type="submit"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    </>
  );
};

export default LogIn;
