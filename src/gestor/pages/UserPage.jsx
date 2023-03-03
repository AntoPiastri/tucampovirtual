import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../hooks";
import { selectErrorMessage, selectIdSesion, selectSuccessMessage, selectUser } from "../../store/auth";
import { cleanMessagge, deleteUser, newError, updateUser } from "../../store/auth/thunks";
import { GestorLayout } from "../layout/GestorLayout"


export const UserPage = () => {

    const id =useSelector(selectIdSesion);
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch();
    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    useEffect(() => { if (errorMessage || successMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage, successMessage])


    let { newName, newPassword, onInputChange } = useForm({
        newName: "",
        newPassword: ""
    })
    const user = useSelector(selectUser);

    const onSubmit = (type) => {
        event.preventDefault();
        if (nameChange == true && newName.length < 4) {
            dispatch(newError("El nuevo nombre usuario debe contener al menos 4 caracteres"))
        }
        else if (nameChange == false && newPassword < 8) {
            dispatch(newError("La contraseña debe contener al menos 8 caracteres"))
        }
        else {
            dispatch(updateUser(id,user.email, user.token, newName, newPassword, type))
        }

    }

    const [nameChange, setNameChange] = useState(false);
    const showNameChange = () => {
        setNameChange(true)
    }
    const showPasswordChange = () => {
        setNameChange(false)
    }
    const callDeleteUser = () => {
        dispatch(deleteUser(id,user.email, user.token))
    }
    return (
        <Grid>
            <GestorLayout>
            </GestorLayout>
            <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url(http://demos.alan.sh/files/images/ujkoW.jpg)`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
                <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
                    <Grid container spacing={4} direction="row" alignItems="center" justifyContent="center">
                        <Grid item>
                            <Button variant="contained" sx={{ marginBottom: 2 }} onClick={showNameChange}>Cambiar nombre de usuario</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" sx={{ marginBottom: 2 }} onClick={showPasswordChange}>Cambiar contraseña</Button>
                        </Grid>
                    </Grid>
                    <Grid item className="box-shadow" display={(nameChange) ? "" : "none"}
                        xs={3}
                        sx={{ width: { sm: 450 }, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 3, borderRadius: 2 }}>
                        <Typography variant="h5">Cambiar nombre de usuario</Typography>
                        <form onSubmit={() => { onSubmit("name") }}>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <TextField
                                        label="Nuevo nombre"
                                        type="text"
                                        placeholder="Juan Perez"
                                        fullWidth
                                        name="newName"
                                        value={newName}
                                        onChange={onInputChange} />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }} display={!!successMessage ? "" : "none"}>
                                    <Alert severity="success">{successMessage}</Alert>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }} display={!!errorMessage ? "" : "none"}>
                                    <Alert severity="error">{errorMessage}</Alert>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                                <Grid item xs={12} sm={12}>
                                    <Button type="submit" variant="contained" fullWidth>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item className="box-shadow" display={!nameChange ? "" : "none"}
                        xs={3}
                        sx={{ width: { sm: 450 }, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 3, borderRadius: 2 }}>
                        <Typography variant="h5">Cambiar contraseña</Typography>
                        <form onSubmit={() => { onSubmit("password") }}>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <TextField
                                        label="Nueva contraseña"
                                        type="password"
                                        fullWidth
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={onInputChange} />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }} display={!!successMessage ? "" : "none"}>
                                    <Alert severity="success">{successMessage}</Alert>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }} display={!!errorMessage ? "" : "none"}>
                                    <Alert severity="error">{errorMessage}</Alert>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 0, mt: 1 }}>
                                <Grid item xs={12} sm={12}>
                                    <Button type="submit" variant="contained" fullWidth>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item >
                        <Button variant="contained" sx={{ marginTop: 3 }} onClick={handleClickOpen} color="transparencias">Eliminar usuario</Button>
                    </Grid>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">{"Solicitaste eliminar tu usuario"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Recuerda que esta acción no se puede revertir y perderas toda la información almacenada en nuestra plataforma
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button onClick={callDeleteUser}>Eliminar</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Grid>
    )
}