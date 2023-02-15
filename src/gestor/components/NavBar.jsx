import { AccountCircle, LogoutOutlined } from "@mui/icons-material"
import { AppBar, Grid, IconButton, Toolbar, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectEstablecimiento, selectUser } from "../../store/auth";
import { closeSession } from "../../store/auth/thunks";


export const NavBar = () => {

    const user = useSelector(selectUser);
    const establecimiento = useSelector(selectEstablecimiento)
    const dispatch = useDispatch();
    const onLogout = () => {
        dispatch(closeSession())
    }
    const navigate = useNavigate()
    const goToUserPage = () => {
        navigate("/user")
    }
    return (
        <AppBar position="fixed" sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
            <Toolbar >
                <IconButton onClick={goToUserPage}><AccountCircle /></IconButton>
                <Grid container direction={"row"} justifyContent="space-between"></Grid>
                <Grid container direction={"column"} alignItems="center" color={"rgba(25,38,55,255)"}>

                    <Typography variant="button">{user?.nombre}</Typography>
                    <Typography variant="button">{establecimiento?.nombre}</Typography>
                </Grid>
                <Grid container direction={"row"} justifyContent="space-between"></Grid>
                <IconButton onClick={onLogout}><LogoutOutlined /></IconButton>
            </Toolbar>
        </AppBar >

    )
}
