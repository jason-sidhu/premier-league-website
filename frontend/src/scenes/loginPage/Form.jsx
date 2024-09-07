import React, { useState } from "react";
import {
    Box, 
    Button, 
    TextField, 
    useMediaQuery,
    Typography, 
    useTheme, 
    MenuItem, 
    Select, 
    InputLabel,
    FormControl,
    IconButton,
    InputAdornment,
    Alert,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { teamMapping } from "components/Mapping";

const registerSchema = yup.object().shape({
    firstName: yup.string()
        .min(2, 'First Name must be at least 2 characters')
        .required("Required"),
    lastName: yup.string()
        .min(2, 'Last Name must be at least 2 characters')
        .required("Required"),
    username: yup.string()
        .min(2, 'Username must be at least 2 characters')
        .required("Required"),
    email: yup.string()
        .email("Invalid email")
        .required("Required"),
    favouriteTeam: yup.string()
        .required("Required"),
    password: yup.string()
        .min(5, 'Password must be at least 5 characters')
        .required("Required"),
    verifyPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required("Required")
});


const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required")
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    favouriteTeam: "",
    password: "",
    username:"",
    verifyPassword: "",
};

const initialValuesLogin = {
    email: "",
    password: ""
};

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const backendUrl = process.env.REACT_APP_BACKEND_URL; 



    const register = async (values, onSubmitProps) => {
        setError(""); // Reset error message
        try {
            const savedUserResponse = await fetch(
                // "http://localhost:3001/auth/register",
                `${backendUrl}/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );

            if (!savedUserResponse.ok) {
                const errorData = await savedUserResponse.json();
                setError(errorData.message || "Registration failed.");
                return;
            }

            const savedUser = await savedUserResponse.json();
            onSubmitProps.resetForm();

            if (savedUser) {
                setPageType("login");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again later.");
        }
    };

    const login = async (values, onSubmitProps) => {
        setError(""); // Reset error message
        try {
            const loggedInResponse = await fetch(
                // "http://localhost:3001/auth/login",
                `${backendUrl}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );

            const loggedIn = await loggedInResponse.json();
            if (!loggedInResponse.ok) {
                setError(loggedIn.message || "Login failed.");
                return;
            }

            onSubmitProps.resetForm();
            if (loggedIn) {
                dispatch(
                    setLogin({
                        user: loggedIn.user,
                        token: loggedIn.token
                    })
                );
                navigate("/");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again later.");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        setError(""); // Reset error message
        if (isLogin) {
            await login(values, onSubmitProps);
        } else if (isRegister) {
            await register(values, onSubmitProps);
        }
    };

    return (
        <Formik 
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values, 
                errors, 
                touched, 
                handleBlur, 
                handleChange,
                handleSubmit, 
                resetForm, 
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                    <TextField 
                            label="Email"
                            onBlur={handleBlur}
                            onChange={(e) => {
                                handleChange(e);
                                setError(''); 
                            }}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4"}}
                        />
                        {isRegister && (
                            <>
                                <TextField 
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField 
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField 
                                    label="Username"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setError(''); 
                                    }}
                                    value={values.username}
                                    name="username"
                                    error={Boolean(touched.username) && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                    sx={{ gridColumn: "span 4"}}
                                />
                                <FormControl sx={{ gridColumn: "span 4" }} error={Boolean(touched.favouriteTeam) && Boolean(errors.favouriteTeam)}>
                                    <InputLabel>Favourite Team</InputLabel>
                                    <Select
                                        label="Favourite Team"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.favouriteTeam}
                                        name="favouriteTeam"
                                    >
                                        {Object.entries(teamMapping).map(([key, value]) => (
                                            <MenuItem key={key} value={value}>{value}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.favouriteTeam && errors.favouriteTeam && (
                                        <Typography variant="body2" color="error">
                                            {errors.favouriteTeam}
                                        </Typography>
                                    )}
                                </FormControl>
                                <TextField 
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={Boolean(touched.password) && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    sx={{ gridColumn: "span 4"}}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField 
                                    label="Verify Password"
                                    type={showPassword ? "text" : "password"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.verifyPassword}
                                    name="verifyPassword"
                                    error={Boolean(touched.verifyPassword) && Boolean(errors.verifyPassword)}
                                    helperText={touched.verifyPassword && errors.verifyPassword}
                                    sx={{ gridColumn: "span 4"}}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </>
                        )}
                        
                        {isLogin && (
                            <TextField 
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={Boolean(touched.password) && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: "span 4"}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m:"2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover" : { color: palette.primary.main}
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Typography
                            fontWeight="bold"
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                                setShowPassword(false);
                                setError("")
                            }}
                            sx={{
                                textDecoration: "underline", 
                                color: palette.primary.main,
                                "&:hover" : { 
                                    cursor: "pointer",
                                    color: palette.primary.light
                                },
                            }}
                        >
                            {isLogin ? "Don't have an account? Sign up here." : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default Form;
